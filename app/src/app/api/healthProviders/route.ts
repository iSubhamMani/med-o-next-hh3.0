import { connectDB } from "@/lib/db";
import { HealthcareProviderModel } from "@/models/HealthcareProvider";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const providers = await HealthcareProviderModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: "$user._id",
          fullname: "$user.fullname",
          email: "$user.email",
          phone: "$user.phone",
          specialization: "$specialization",
          associatedOrganization: "$associatedOrganization",
          yearsOfExperience: "$yearsOfExperience",
          calLink: "$calLink",
        },
      },
    ]);

    console.log(providers);

    return NextResponse.json(
      {
        message: "Health Providers fetched",
        success: true,
        providers,
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
