import { connectDB } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/config";
import { PrescriptionModel } from "@/models/Prescription";
import { UserModel } from "@/models/User";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  await connectDB();

  const transaction = await mongoose.startSession();

  try {
    const user = (await getServerSession(authOptions))?.user;

    if (!user) {
      throw new Error("Unauthorized user");
    }

    const formData = await req.formData();
    const imgFile = formData.get("imgFile") as File;

    if (!imgFile) {
      throw new Error("Image file not found");
    }

    transaction.startTransaction();

    const genAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
    });

    const buffer = Buffer.from(await imgFile.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const prompt = `
    You are an expert in understanding handwritten medical prescriptions and act as a pharmacist.
    We will upload an image as a medical prescription, and you will extract all the medicine names based on the uploaded prescription image.
  
    Structure the output as an object with the following fields:
    - "title": A brief title for the prescription.
    - "error": A boolean indicating if an error occurred.
    - "errorMessage": If "error" is true, provide a brief message describing the error; otherwise, leave this empty.
    - "medicines": An array of objects, where each object contains:
        - "name": The name of the medicine.
        - "details": An object containing:
            - "uses": A brief sentence on the use of the medicine.
            - "sideEffects": An array of 3 possible side effects.
            - "safetyAdvice": A brief sentence on safety advice.
  
    Example output for successful extraction:
    {
    "title": "Title of the prescription",
      "error": false,
      "errorMessage": "",
      "medicines": [
        {
          "name": "Medicine Name 1",
          "details": {
            "uses": "Used to treat high blood pressure.",
            "sideEffects": ["Dizziness", "Nausea", "Headache"],
            "safetyAdvice": "Avoid consuming alcohol while taking this medication."
          }
        },
        {
          "name": "Medicine Name 2",
          "details": {
            "uses": "Helps relieve pain and inflammation.",
            "sideEffects": ["Upset stomach", "Drowsiness", "Dry mouth"],
            "safetyAdvice": "Take with food to reduce stomach discomfort."
          }
        }
      ]
    }
  
    Example output if an error occurs:
    {
      "title": "",
      "error": true,
      "errorMessage": "An error occurred while processing the image. Please try again later.",
      "medicines": []
    }
  `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: imgFile.type,
            data: base64Data,
          },
        },
        { text: prompt },
      ],
    });

    if (!result.text?.trim()) {
      throw new Error("Failed to analyze the prescription image");
    }

    const content = JSON.parse(result.text.replace(/```json\s*|\s*```/g, ""));

    const mimeType = imgFile.type;
    const encoding = "base64";
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadToCloudinary(fileUri, "prescriptions");

    if (!res) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    await PrescriptionModel.create({
      imageUrl: res.secure_url,
      content: JSON.stringify(content),
      prescriptionOf: user._id,
    });

    await transaction.commitTransaction();

    return NextResponse.json(
      {
        message: "Prescription analyzed successfully",
        content: content,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    await transaction.abortTransaction();
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
          error: true,
        },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        {
          message: "An unexpected error occurred",
          error: true,
        },
        {
          status: 500,
        }
      );
    }
  } finally {
    transaction.endSession();
  }
}
