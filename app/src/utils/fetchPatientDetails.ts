import { connectDB } from "@/lib/db";
import { PatientModel } from "@/models/Patient";
import mongoose from "mongoose";

export async function fetchPatientDetails(userId: string) {
  await connectDB();

  console.log("Fetching patient details for userId:", userId);

  const user = await PatientModel.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "patientDetails",
      },
    },
    {
      $unwind: "$patientDetails",
    },
    {
      $project: {
        _id: 0,
        fullname: "$patientDetails.fullname",
        email: "$patientDetails.email",
        phone: "$patientDetails.phone",
        address: "$patientDetails.address",
        preferredLang: "$patientDetails.preferredLang",
        //age: "$patientDetails.age",
      },
    },
  ]);
  return user.length > 0 ? user[0] : null;
}
