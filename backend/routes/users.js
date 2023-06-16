import express from "express";
import {
  createUser,
  login,
  getUserBalance,
  depositMoney,
  withdrawMoney,
  getAllUsers,
  getUserdata,
} from "../controller/users.js";

const router = express.Router();
router.post("/login-user", login);
router.post("/register-user", createUser);
router.post("/get-user-balance", getUserBalance);
router.post("/deposit-money", depositMoney);
router.post("/withdraw-money", withdrawMoney);
router.post("/get-all-users", getAllUsers);
router.post("/get-user-data", getUserdata);

export default router;
