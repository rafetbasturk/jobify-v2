import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { readFile } from "fs/promises";
import Job from "./models/jobModel.js";
import User from "./models/userModel.js";
dotenv.config();

try {
  await mongoose.connect(process.env.CONNECTION_STRING);
  const user = await User.findOne({ email: "rafet@gmail.com" });

  const data = JSON.parse(
    await readFile(new URL("./utils/mockData.json", import.meta.url))
  );
  const jobs = data.map((job) => {
    return { ...job, createdBy: user._id };
  });
  await Job.deleteMany({ createdBy: user._id });
  await Job.create(jobs);
  console.log("Success");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
