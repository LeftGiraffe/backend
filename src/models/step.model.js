import mongoose from "mongoose";

const stepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    step: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 99999,
    },
  },
  { timestamps: true }
);

const Step = mongoose.model("Step", stepSchema);

export default Step;
