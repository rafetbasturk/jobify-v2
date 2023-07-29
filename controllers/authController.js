import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import { comparePasswords, hashPassword } from "../utils/passwordUtils.js";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  req.body.password = await hashPassword(req.body.password);

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "user created" });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user && (await comparePasswords(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError(`invalid credentials`);

  const token = createJWT({ userId: user._id, role: user.role });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.status(StatusCodes.OK).json({ message: "user logged in" });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "user logged out" });
};
