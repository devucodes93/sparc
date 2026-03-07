import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    count: Number,
  },
  {
    timestamps: true,
  },
);
const Visits = mongoose.model("Visits", visitSchema);

export default Visits;
