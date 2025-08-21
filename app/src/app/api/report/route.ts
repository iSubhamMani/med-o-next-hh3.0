import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/config";
import Report from "@/models/Report";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const user = (await getServerSession(authOptions))?.user;

    if (!user) {
      throw new Error("Unauthorized user");
    }

    const formData = await req.formData();
    const reportType = formData.get("reportType")?.toString();
    const details = formData.get("details")?.toString();
    const location = formData.get("location")?.toString();
    const title = formData.get("title")?.toString();

    if (!reportType || !details || !location || !title) {
      throw new Error("Missing required fields");
    }

    await Report.create({
      title,
      reportType,
      details,
      reportedBy: user._id,
      location: {
        type: "Point",
        coordinates: location
          .split(",")
          .map((coord) => parseFloat(coord.trim())),
      },
    });

    return NextResponse.json(
      {
        message: "Report submitted successfully",
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
    const reports = await Report.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedByUser",
        },
      },
      {
        $unwind: "$reportedByUser",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          reportType: 1,
          details: 1,
          reportedBy: "$reportedByUser.fullname",
          location: 1,
        },
      },
    ]);

    return NextResponse.json(reports, {
      status: 200,
    });
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
