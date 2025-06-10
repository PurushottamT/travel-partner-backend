import express from "express";
import { authenticate } from "../../middlewares/auth";
import {
  createBankDetail,
  getBankDetailByUsername,
  updateBankDetailByUsername,
} from "../../controllers/company/bankDetail.controller";

const router = express.Router();

router.post("/:username/bankDetail/create", authenticate, createBankDetail);
router.get(
  "/:username/bankDetail/profile",
  authenticate,
  getBankDetailByUsername
);
router.put(
  "/:username/bankDetail/profile",
  authenticate,
  updateBankDetailByUsername
);

export default router;
