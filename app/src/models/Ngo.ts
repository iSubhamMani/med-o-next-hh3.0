import mongoose, { Model, Schema } from "mongoose";

interface NGO {
  organizationName: string;
  contactPerson: mongoose.Schema.Types.ObjectId;
  areaOfFocus: string;
}

const ngoSchema = new Schema<NGO>(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    areaOfFocus: {
      type: String,
      required: true,
      trim: true,
    },
    contactPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const ngoModel =
  (mongoose.models.NGO as Model<NGO>) || mongoose.model<NGO>("NGO", ngoSchema);
