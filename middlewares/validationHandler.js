import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import User from "../models/userModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new NotFoundError(errorMessages);
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError(`'${email}' address is in use`);
      }
    }),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new BadRequestError(`'${email}' address is in use`);
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("password should be between 6 to 10 characters"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    console.log(value);
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid MongoDB id");

    const job = await Job.findById(value);

    if (!job) throw new NotFoundError(`no job with id '${value}'`);

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === job.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required").trim(),
  body("position").notEmpty().withMessage("position is required").trim(),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value"),
]);
