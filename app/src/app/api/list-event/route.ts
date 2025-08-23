import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/config";
import Event from "@/models/Event";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const user = (await getServerSession(authOptions))?.user;

    if (!user) {
      throw new Error("Unauthorized user");
    }

    const formData = await req.formData();
    const eventName = formData.get("name")?.toString();
    const eventDate = formData.get("eventDate")?.toString();
    const location = formData.get("location")?.toString();
    const lcoationDesc = formData.get("locationDesc")?.toString() || "";

    if (!eventName || !eventDate || !location || !lcoationDesc) {
      throw new Error("Missing required fields");
    }

    await Event.create({
      name: eventName,
      eventDate,
      listedBy: user._id,
      location: {
        type: "Point",
        coordinates: location
          .split(",")
          .map((coord) => parseFloat(coord.trim())),
      },
      locationDesc: lcoationDesc,
    });

    return NextResponse.json(
      {
        message: "Event listed successfully",
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

    const eventsById = await Event.aggregate([
      {
        $match: { listedBy: new mongoose.Types.ObjectId(user._id) },
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

    return NextResponse.json(eventsById, {
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
