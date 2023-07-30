import rateLimiter from "express-rate-limit";
import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../middlewares/validationHandler.js";

const apiLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  message: { message: "IP rate limit exceeded, retry in 5 minutes." },
});

const router = Router();

router.post("/register", apiLimiter, validateRegisterInput, register);
router.post("/login", apiLimiter, validateLoginInput, login);
router.get("/logout", logout);

export default router;
