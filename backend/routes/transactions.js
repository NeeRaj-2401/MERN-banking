import express from "express";
import { getUserTransactions } from "../controller/transactions.js";
// this file will contain all the routes realted to posts
const router = express.Router();
router.post("/get-user-transaction", getUserTransactions);

export default router;
