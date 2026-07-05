import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: Number,
      unique: true,
      required: true,
    },

    ownerId: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "waiting",
    },

    maxPlayers: {
      type: Number,
      default: 6,
    },

    baseScore: {
      type: Number,
      default: 100,
    },

    robMode: {
      type: String,
      default: "free",
    },

    players: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Room", roomSchema);