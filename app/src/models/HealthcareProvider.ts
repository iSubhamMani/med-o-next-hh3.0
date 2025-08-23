import mongoose, { Model, Schema } from "mongoose";

interface HeatlhcareProvider {
  professional_license_id: string;
  specialization: string;
  prefferedLang: string;
  associatedOrganization: string;
  yearsOfExperience: number;
  user: mongoose.Schema.Types.ObjectId; // Reference to User model
  calLink: string;
}

const healthcareProviderSchema = new Schema<HeatlhcareProvider>(
  {
    prefferedLang: {
      type: String,
      required: true,
      trim: true,
    },
    professional_license_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    associatedOrganization: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    calLink: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export const HealthcareProviderModel =
  (mongoose.models.HeatlhcareProvider as Model<HeatlhcareProvider>) ||
  mongoose.model<HeatlhcareProvider>(
    "HeatlhcareProvider",
    healthcareProviderSchema
  );
