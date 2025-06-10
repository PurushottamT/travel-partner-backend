import {
  createBankDetail,
  getBankDetailByUsername,
  updateBankDetailByUsername,
} from "../controllers/company/bankDetail.controller";
import BankDetail from "../models/profile/BankDetail";
import User from "../models/User";
import APIError from "../utils/APIError";

jest.mock("../models/profile/BankDetail");
jest.mock("../models/User");

const mockReq = (
  overrides: { params?: Record<string, any>; body?: Record<string, any> } = {}
) => ({
  params: { username: "john123", ...overrides.params },
  body: { accountNumber: "12345", bankName: "BankX", ...overrides.body },
  user: { id: "mockUserId" },
  ...overrides,
});

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

describe("BankDetail Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBankDetail", () => {
    it("should create new bank detail", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ _id: "mockUserId" });
      (BankDetail.findOne as jest.Mock).mockResolvedValue(null);
      (BankDetail.create as jest.Mock).mockResolvedValue({
        accountNumber: "12345",
      });

      const req = mockReq();
      const res = mockRes();

      await createBankDetail(req as any, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ accountNumber: "12345" });
    });

    it("should throw if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      const req = mockReq();
      const res = mockRes();

      await createBankDetail(req as any, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(APIError));
    });
  });

  describe("getBankDetailByUsername", () => {
    it("should return bank detail by username", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ _id: "mockUserId" });
      (BankDetail.findOne as jest.Mock).mockResolvedValue({
        accountNumber: "12345",
      });

      const req = mockReq();
      const res = mockRes();

      await getBankDetailByUsername(req as any, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accountNumber: "12345" });
    });
  });

  describe("updateBankDetailByUsername", () => {
    it("should update bank detail by username", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ _id: "mockUserId" });
      (BankDetail.findOneAndUpdate as jest.Mock).mockResolvedValue({
        accountNumber: "67890",
      });

      const req = mockReq();
      const res = mockRes();

      await updateBankDetailByUsername(req as any, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accountNumber: "67890" });
    });
  });
});
