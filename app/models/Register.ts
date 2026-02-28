import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema(
  {
    name: String,
    contact: String,
    email: String,
    ieeeId: String,
    screenshot: String,
    utr: String,
  },
  { timestamps: true },
);

export default mongoose.models.Register ||
  mongoose.model("Register", RegisterSchema);
