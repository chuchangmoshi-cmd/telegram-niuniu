import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    roomId: Number,

    players: Array,

    banker: Object,

    winner: Array,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model(
  "GameHistory",
  historySchema
);