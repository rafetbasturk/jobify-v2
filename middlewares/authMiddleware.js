import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("authentication invalid");
  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "64c0b3aabc836a3dfcf7c4d8";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("unauthorized to acces this route");
    }
    next();
  };
};

export const checkTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Test user. Read only!");
  next();
};
