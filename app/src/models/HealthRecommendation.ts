import mongoose, { Model, Schema } from "mongoose";
export interface HealthRecommendation {
  recommendationFor: Schema.Types.ObjectId;
  content: string;
}

const healthRecommendationSchema: Schema<HealthRecommendation> =
  new Schema<HealthRecommendation>(
    {
      content: {
        type: String,
        trim: true,
      },
      recommendationFor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    { timestamps: true }
  );

export const HealthRecommendationModel =
  (mongoose.models.HealthRecommendation as Model<HealthRecommendation>) ||
  mongoose.model<HealthRecommendation>(
    "HealthRecommendation",
    healthRecommendationSchema
  );
