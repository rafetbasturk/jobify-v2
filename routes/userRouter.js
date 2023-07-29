import { Router } from "express";

const router = Router();

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from "../controllers/userController.js";
import { validateUpdateUserInput } from "../middlewares/validationHandler.js";
import {
  authorizePermissions,
  checkTestUser,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

router.get("/current-user", getCurrentUser);
router.get(
  "/admin/app-stats",
  authorizePermissions("admin"),
  getApplicationStats
);
router.patch(
  "/update-user",
  checkTestUser,
  upload.single("avatar"),
  validateUpdateUserInput,
  updateUser
);

export default router;
