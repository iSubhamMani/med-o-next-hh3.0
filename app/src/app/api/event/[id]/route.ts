import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const eventId = params.id;
  console.log("Fetching event with ID:", eventId);

  if (!eventId) {
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
    const events = await Event.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "listedBy",
          foreignField: "_id",
          as: "listedBy",
        },
      },
      {
        $unwind: "$listedBy",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          eventDate: 1,
          listedBy: "$listedBy.fullname",
          location: 1,
          locationDesc: 1,
        },
      },
    ]);

    return NextResponse.json(events[0], {
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
