import mongoose, { Model, Schema } from "mongoose";

export interface Address {
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

interface User {
  fullname: string;
  email: string;
  password: string;
  role: "patient" | "healthcare_provider" | "ngo";
  phone: string;
  address: Address;
}

const userSchema = new Schema<User>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["patient", "healthcare_provider", "ngo"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pinCode: { type: String, required: true, trim: true },
    },
  },
  { timestamps: true }
);

export const UserModel =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", userSchema);
