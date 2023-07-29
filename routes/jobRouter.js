import { Router } from "express";
import {
  createJob,
  deleteJob,
  editJob,
  getAllJobs,
  getJob,
  showStats,
} from "../controllers/jobController.js";
import {
  validateJobInput,
  validateIdParam,
} from "../middlewares/validationHandler.js";
import { checkTestUser } from "../middlewares/authMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getAllJobs)
  .post(checkTestUser, validateJobInput, createJob);

router
  .route("/stats")
  .get(showStats)

router
  .route("/:id")
  .get(validateIdParam, getJob)
  .patch(checkTestUser, validateJobInput, validateIdParam, editJob)
  .delete(checkTestUser, validateIdParam, deleteJob);

export default router;
