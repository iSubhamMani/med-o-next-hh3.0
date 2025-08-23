import mongoose, { Schema, Document } from "mongoose";

interface Event extends Document {
  name: string;
  eventDate: string;
  listedBy: mongoose.Types.ObjectId;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  locationDesc: string;
}

const eventSchema: Schema<Event> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: String,
      required: true,
      trim: true,
    },
    listedBy: {
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
    locationDesc: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Add a geospatial index for location queries
eventSchema.index({ location: "2dsphere" });

export default mongoose.models.Event ||
  mongoose.model<Event>("Event", eventSchema);
