import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    gold: {
      type: Number,
      default: 1000,
    },

    diamond: {
      type: Number,
      default: 0,
    },

    totalWin: {
      type: Number,
      default: 0,
    },

    totalLose: {
      type: Number,
      default: 0,
    },

    totalGames: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);