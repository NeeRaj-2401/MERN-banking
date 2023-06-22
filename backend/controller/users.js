import UserMessage from "../models/user.js";
import Transaction from "../models/transaction.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

function generateAccountNumber() {
  const alphabetCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberCharacters = "0123456789";
  let accountNumber = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * alphabetCharacters.length);
    accountNumber += alphabetCharacters[randomIndex];
  }
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * numberCharacters.length);
    accountNumber += numberCharacters[randomIndex];
  }
  return accountNumber;
}

function generateTransactionId() {
  const length = 10;
  let transactionId = "";
  const characters = "0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters[randomIndex];
  }

  return transactionId;
}

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { username: usernameOrEmail, password } = req.body;
    const user = await UserMessage.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    console.log("user ", user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Username or email does not exist" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.SECRECT_KEY,
      {
        expiresIn: "24h",
      }
    );
    const hashedAccessToken = crypto
      .createHash("sha256")
      .update(accessToken)
      .digest("hex")
      .slice(0, 36);
    console.log(hashedAccessToken);
    return res.status(200).json({
      message: "Login successful!",
      user,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Some error occurred! Please try again." });
  }
};

export const createUser = async (req, res) => {
  let user = req.body.data;
  user = { ...user, accountNumber: generateAccountNumber() };
  const newUser = new UserMessage(user);
  try {
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};

export const getUserBalance = async (req, res) => {
  try {
    const user = await UserMessage.findOne({
      _id: req.body.userID,
    });
    return res.status(200).json({ balance: user.balance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const depositMoney = async (req, res) => {
  try {
    const user = await UserMessage.findOne({
      _id: req.body.userID,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newBalance = user.balance + parseInt(req.body.depositAmount);
    user.balance = newBalance;
    await user.save();
    const data = {
      userID: user._id,
      transactionId: generateTransactionId(),
      transactionType: "Deposit",
      amount: parseInt(req.body.depositAmount),
      balance: newBalance.toString(),
    };
    const newTrans = new Transaction(data);
    await newTrans.save();
    return res
      .status(200)
      .json({ message: "Balance updated successfully", balance: newBalance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update balance" });
  }
};

export const withdrawMoney = async (req, res) => {
  try {
    const user = await UserMessage.findOne({
      _id: req.body.userID,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newBalance = user.balance - parseInt(req.body.withdrawalAmount);
    if (newBalance < 0) {
      return res.status(400).json({ message: "Insufficient Balance" });
    }
    user.balance = newBalance;
    await user.save();
    const data = {
      userID: user._id,
      transactionId: generateTransactionId(),
      transactionType: "Withdrawal",
      amount: parseInt(req.body.withdrawalAmount),
      balance: newBalance.toString(),
    };
    const newTrans = new Transaction(data);
    await newTrans.save();
    return res
      .status(200)
      .json({ message: "Balance updated successfully", balance: newBalance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update balance" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let users = await UserMessage.find({});

    // Filter out users where the username includes 'admin'
    users = users.filter((user) => !user.username.includes("admin"));

    users = users.map((user) => ({
      userId: user._id,
      username:user.username,
      accountNumber: user.accountNumber,
      balance: user.balance,
    }));
    return res.status(200).send({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get all users" });
  }
};

export const getUserdata = async (req, res) => {
  try {
    const user = await UserMessage.findOne({
      _id: req.body.userID,
    });
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
