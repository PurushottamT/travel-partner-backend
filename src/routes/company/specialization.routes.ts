import express from "express";
import { authenticate } from "../../middlewares/auth";
import {
  createSpecialization,
  getSpecializationByUsername,
  updateSpecializationByUsername,
} from "../../controllers/company/specialization.controller";

const router = express.Router();

router.post(
  "/:username/specialization/create",
  authenticate,
  createSpecialization
);
router.get(
  "/:username/specialization/profile",
  authenticate,
  getSpecializationByUsername
);
router.put(
  "/:username/specialization/profile",
  authenticate,
  updateSpecializationByUsername
);

export default router;
