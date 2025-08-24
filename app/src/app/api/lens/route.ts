import { connectDB } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/config";
import { PrescriptionModel } from "@/models/Prescription";
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
We will upload an image of a medical prescription, and you will extract all relevant health-related information, not just medicines. This includes the prescribed medicines, as well as general advice for the patient.

---

### Instructions for Output
1.  **Format:** Your output must be a single, valid JSON object. Do not include any text before or after the JSON object.
2.  **Structure:** Adhere strictly to the JSON structure provided in the example below. Pay close attention to commas, colons, and brackets.
3.  **Completeness:** The JSON object must contain all the top-level fields: "title," "error," "errorMessage," and "sections."
4.  **Content:** Extract and populate the content based on the provided image. If an error occurs, set "error" to true and provide a relevant "errorMessage".
5. **Buy Link Requirement:** For each medicine, generate a "buyLink" field with a valid product search URL from a reputed Indian online pharmacy.  
   - Preferably use **Apollo Pharmacy**, **Tata 1mg**, **NetMeds**, or **PharmEasy**.  
   - Example format: 'https://www.1mg.com/search/all?name=Paracetamol'. 
   - If the section does not require a buy link (e.g., general advice), put null in the field
---

### JSON Structure
- **"title"**: A brief title about the prescription.
- **"error"**: A boolean.
- **"errorMessage"**: A string for error messages.
- **"sections"**: An array of objects.
    - Each section object must have a **"title"** (e.g., "Medicines").
    - Each section object must have an **"items"** array.
        - Each item object must have a **"medicineName"** field.
        - Each item object must have a **"buyLink"** field. 
        - Each item object must have a **"details"** array.
            - The details array should contain objects with a **"title"** and **"content"** field.
            - For "Side Effects," the content is an array of strings. For all other titles, the content is a string.

---

### Example successful output:
{
  "title": "Medical Prescription Analysis",
  "error": false,
  "errorMessage": "",
  "sections": [
    {
      "title": "Medicines",
      "items": [
        {
          "medicineName": "Medicine Name 1",
          "buyLink": "https://www.1mg.com/search/all?name=Paracetamol",
          "details": [
            {
              "title": "Uses",
              "content": "Used to treat high blood pressure."
            },
            {
              "title": "Side Effects",
              "content": ["Dizziness", "Nausea", "Headache"]
            },
            {
              "title": "Dosage Advice",
              "content": "Take one tablet with water, once daily, in the morning."
            }
          ]
        },
        {
          "medicineName": "Medicine Name 2",
          "buyLink": "https://pharmeasy.in/search/all?name=Amoxicillin",
          "details": [
            {
              "title": "Uses",
              "content": "Helps relieve pain and inflammation."
            },
            {
              "title": "Side Effects",
              "content": ["Upset stomach", "Drowsiness", "Dry mouth"]
            },
            {
              "title": "Dosage Advice",
              "content": "Take two capsules every 4-6 hours as needed for pain."
            }
          ]
        }
      ]
    }
  ]
}

---

### Example error output:
{
  "title": "",
  "error": true,
  "errorMessage": "Unable to process the image. Please ensure the prescription is clear.",
  "sections": []
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
