import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import mongoose from "mongoose";
import Report from "@/models/Report";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const reportId = params.id;
  console.log("Fetching report with ID:", reportId);

  if (!reportId) {
    return NextResponse.json(
      {
        message: "Event ID is required",
        error: true,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const reports = await Report.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(reportId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "reportedBy",
          foreignField: "_id",
          as: "reportedByUser",
        },
      },
      {
        $lookup: {
          from: "ngos",
          localField: "reportedBy",
          foreignField: "contactPerson",
          as: "ngoDetails",
        },
      },
      {
        $unwind: "$reportedByUser",
      },
      {
        $unwind: "$ngoDetails",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          reportType: 1,
          details: 1,
          reportedBy: "$reportedByUser.fullname",
          location: 1,
          createdAt: 1,
          ngoName: "$ngoDetails.organizationName",
        },
      },
    ]);

    console.log("Report found:", reports[0]);

    return NextResponse.json(reports[0], {
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
