import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/config";
import { HealthcareProviderModel } from "@/models/HealthcareProvider";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const user = (await getServerSession(authOptions))?.user;

    if (!user) {
      throw new Error("Unauthorized user");
    }

    console.log(user._id);

    const formData = await req.formData();
    const calLink = formData.get("calLink")?.toString();

    if (!calLink) {
      throw new Error("Missing required fields");
    }

    const provider = await HealthcareProviderModel.findOneAndUpdate(
      { user: user._id },
      { $set: { calLink } },
      { new: true }
    );

    console.log(provider);

    return NextResponse.json(
      {
        message: "Link Updated",
        success: true,
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

export async function GET() {
  await connectDB();

  try {
    const user = (await getServerSession(authOptions))?.user;

    if (!user) {
      throw new Error("Unauthorized user");
    }

    const provider = await HealthcareProviderModel.findOne({
      user: user._id,
    });

    console.log(provider);

    return NextResponse.json(
      {
        message: "Link fetched",
        success: true,
        link: provider?.calLink || "",
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
