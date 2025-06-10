import express from "express";
import { authenticate } from "../../middlewares/auth";
import {
  createCertification,
  getCertificationByUsername,
  updateCertificationByUsername,
} from "../../controllers/company/certification.controller";

const router = express.Router();

router.post(
  "/:username/certification/create",
  authenticate,
  createCertification
);
router.get(
  "/:username/certification/profile",
  authenticate,
  getCertificationByUsername
);
router.put(
  "/:username/certification/profile",
  authenticate,
  updateCertificationByUsername
);

export default router;
