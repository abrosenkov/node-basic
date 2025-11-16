import createHttpError from 'http-errors';
import { Student } from '../models/student.js';

export const getStudents = async (req, res) => {
  const {
    page,
    perPage,
    gender,
    minAvgMark,
    search,
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;
  const skip = (page - 1) * perPage;

  const studentsQuery = Student.find();

  if (gender) {
    studentsQuery.where('gender').equals(gender);
  }
  if (minAvgMark) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }

  if (search) {
    studentsQuery.where({ $text: { $search: search } });
  }

  // if (search) {
  //   studentsQuery.where({
  //     name: { $regex: search, $options: 'i' },
  //   });
  // }

  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);
  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    students,
  });
};

export const getStudentById = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId);

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }
  res.status(200).json(student);
};

export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

export const deleteStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({ _id: studentId });
  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }
  res.status(200).json(student);
};

export const updateStudent = async (req, res, next) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate({ _id: studentId }, req.body, {
    new: true,
  });

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};
