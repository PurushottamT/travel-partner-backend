import express from "express";
import { authenticate } from "../../middlewares/auth";
import {
  createCompanyInfo,
  getCompanyInfoByUsername,
  updateCompanyInfoByUsername,
} from "../../controllers/company/companyInfo.controller";

const router = express.Router();

router.post("/:username/companyInfo/create", authenticate, createCompanyInfo);
router.get(
  "/:username/companyInfo/profile",
  authenticate,
  getCompanyInfoByUsername
);
router.put(
  "/:username/companyInfo/profile",
  authenticate,
  updateCompanyInfoByUsername
);

export default router;
