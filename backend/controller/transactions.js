import Transaction from "../models/transaction.js";
import User from "../models/user.js";

export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userID: req.body.userID });
    if (!transactions || transactions.length === 0) {
      return res.status(200).send({ transactions: [] });
    }
    return res.status(200).json({ transactions });
  } catch (error) {}
};
