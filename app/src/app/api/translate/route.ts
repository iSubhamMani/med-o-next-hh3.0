import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/config";
import { PatientModel } from "@/models/Patient";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const content = fd.get("content")?.toString();
    const user = (await getServerSession(authOptions))?.user;

    if (!user) {
      throw new Error("Unauthorized user");
    }

    if (!content || !content.trim()) {
      throw new Error("Content not provided");
    }

    const userData = await PatientModel.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(user._id!) },
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
          prefferedLang: "$prefferedLang",
        },
      },
    ]);

    console.log("user data:", content);

    const user_language = userData[0].prefferedLang;

    console.log("User lang:", user_language);

    const genAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
    });

    const prompt = `
     You are an expert content formatter and translator. Your task is to reformat and translate the provided content exactly as requested, without adding any extra information, commentary, or conversational filler.

---

### Instructions

1.  **Translate to Language:** Translate the entire content into the target language specified by the 'user_language' variable.
2.  **Preserve Formatting:** Maintain the **exact original format** of the source content. This includes, but is not limited to, the structure, whitespace, line breaks, markdown, and any special characters. Do not change the layout or add new formatting elements.
3.  **Strict Adherence:** Your response should contain **only** the converted content. Do not include any introductory or concluding sentences.

---

### Variables

* **'user_language'**: The target language for translation (e.g., 'Bengali', 'Hindi', 'Marathi' etc.).
* **'content'**: The raw text content to be translated and reformatted.

---

### Content to Convert

'user_language': ${user_language}

'content':
${content}
  `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!result.text?.trim()) {
      throw new Error("Failed to analyze the prescription image");
    }

    const refinedContent = JSON.parse(
      result.text.replace(/```json\s*|\s*```/g, "")
    );

    return NextResponse.json(
      {
        message: "Content translated successfully",
        content: refinedContent,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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
  }
}
