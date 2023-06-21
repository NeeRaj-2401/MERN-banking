import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { users } from "./defaultUser.js";
import User from "./models/user.js";

import userRoutes from "./routes/users.js"; // imp
import transactionsRoutes from "./routes/transactions.js"; // imp

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/users", userRoutes); // imp /users/register
app.use("/transactions", transactionsRoutes); // imp /users/register

const createDefaultUsers = async () => {
  try {
    for (const userData of users) {
      const { username } = userData;
      const existingUser = await User.findOne({ username });
      console.log(existingUser);
      if (!existingUser) {
        await User.create(userData);
        console.log(`User created: ${username}`);
      }
    }
  } catch (error) {
    console.error("Error creating default users:", error);
  }
}

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, async () => {
      await createDefaultUsers();
      console.log(`Server Running on Port: http://localhost:${process.env.PORT}`);
    })
  )
  .catch((e) => console.log(e.message));
