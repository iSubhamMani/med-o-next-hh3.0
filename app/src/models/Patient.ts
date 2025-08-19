import mongoose, { Model, Schema } from "mongoose";

interface Patient {
  prefferedLang: string;
  user: mongoose.Schema.Types.ObjectId; // Reference to User model
}

const patientSchema = new Schema<Patient>(
  {
    prefferedLang: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const PatientModel =
  (mongoose.models.Patient as Model<Patient>) ||
  mongoose.model<Patient>("Patient", patientSchema);
