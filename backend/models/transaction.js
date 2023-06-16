import mongoose from "mongoose";

const { Schema } = mongoose;

// Create the transactions schema
const transactionSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
});

// Create the transactions model
const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
