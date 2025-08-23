import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/config";

export async function POST(req: NextRequest) {
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

    const genAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY!,
    });

    const buffer = Buffer.from(await imgFile.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const prompt = `
You are an expert in analyzing medical documents (such as lab reports, discharge summaries, medical certificates, diagnostic reports, and doctor's notes).
We will upload an image or PDF of a medical document, and you will extract all relevant health-related information. 
This includes diagnoses, test results, treatments, medications, and general advice for the patient. 

---

### Instructions for Output
1.  **Format:** Your output must be a single, valid JSON object. Do not include any text before or after the JSON object.
2.  **Structure:** Adhere strictly to the JSON structure provided in the example below. Pay close attention to commas, colons, and brackets.
3.  **Completeness:** The JSON object must contain all the top-level fields: "title," "error," "errorMessage," and "sections."
4.  **Content:** Extract and populate the content based on the provided document. If an error occurs, set "error" to true and provide a relevant "errorMessage".

---

### JSON Structure
- **"title"**: A brief title summarizing the medical document.
- **"error"**: A boolean.
- **"errorMessage"**: A string for error messages.
- **"sections"**: An array of objects.
    - Each section object must have a **"title"** (e.g., "Diagnosis", "Lab Results", "Treatments", "Medicines", "Lifestyle Advice").
    - Each section object must have an **"items"** array.
        - Each item object must have a **"medicineName"** field (use this as the main label: e.g., a medicine name, a test name, a diagnosis, or an advice label).
        - Each item object must have a **"details"** array.
            - The details array should contain objects with a **"title"** and **"content"** field.
            - For "Side Effects," the content is an array of strings. For all other titles, the content is a string.

---

### Example successful output:
{
  "title": "Medical Document Analysis",
  "error": false,
  "errorMessage": "",
  "sections": [
    {
      "title": "Diagnosis",
      "items": [
        {
          "medicineName": "Hypertension",
          "details": [
            {
              "title": "Description",
              "content": "The patient has been diagnosed with high blood pressure."
            }
          ]
        }
      ]
    },
    {
      "title": "Lab Results",
      "items": [
        {
          "medicineName": "Blood Sugar Test",
          "details": [
            {
              "title": "Result",
              "content": "Fasting glucose level: 130 mg/dL (above normal range)."
            }
          ]
        }
      ]
    },
    {
      "title": "Medicines",
      "items": [
        {
          "medicineName": "Amlodipine",
          "details": [
            {
              "title": "Uses",
              "content": "Used to lower blood pressure."
            },
            {
              "title": "Side Effects",
              "content": ["Dizziness", "Swelling of ankles"]
            },
            {
              "title": "Dosage Advice",
              "content": "Take one tablet daily in the morning."
            }
          ]
        }
      ]
    },
    {
      "title": "Lifestyle Advice",
      "items": [
        {
          "medicineName": "Dietary Recommendations",
          "details": [
            {
              "title": "Description",
              "content": "Reduce salt intake, eat more vegetables, and exercise at least 30 minutes daily."
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
  "errorMessage": "Unable to process the document. Please ensure the text is clear.",
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
      throw new Error("Failed to analyze the medical document");
    }

    const content = JSON.parse(result.text.replace(/```json\s*|\s*```/g, ""));

    return NextResponse.json(
      {
        message: "Medical document analyzed successfully",
        content: content,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
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
