import mongoose, { Schema, Document } from "mongoose";

interface IFormData extends Document {
  title: string;
  reportType: string;
  details: string;
  reportedBy: mongoose.Types.ObjectId;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

const reportSchema: Schema<IFormData> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reportType: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Add a geospatial index for location queries
reportSchema.index({ location: "2dsphere" });

export default mongoose.models.Report ||
  mongoose.model<IFormData>("Report", reportSchema);
