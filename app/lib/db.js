import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "sps",
    });
    if (connection) console.log("connected !!!");
  } catch (error) {
    console.log(error);
  }
};
