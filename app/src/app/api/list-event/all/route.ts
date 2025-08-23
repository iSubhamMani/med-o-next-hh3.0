import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Event from "@/models/Event";

export async function GET() {
  await connectDB();

  try {
    const events = await Event.aggregate([
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

    return NextResponse.json(events, {
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
