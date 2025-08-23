import { connectDB } from "@/lib/db";
import { HealthcareProviderModel } from "@/models/HealthcareProvider";
import { ngoModel } from "@/models/Ngo";
import { PatientModel } from "@/models/Patient";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const fields = await req.formData();

    // Extract fields from the parsed data
    const name = fields.get("name")?.toString();
    const email = fields.get("email")?.toString();
    const password = fields.get("password")?.toString();
    const role = fields.get("role")?.toString();
    const phone_number = fields.get("phone_number")?.toString();
    const address = JSON.parse(fields.get("address")?.toString() || "{}");

    console.log(fields);

    // Basic validation
    if (!name || !email || !password || !role || !phone_number) {
      return NextResponse.json(
        {
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "User with this email already exists.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullname: name,
      email,
      phone: phone_number,
      password: hashedPassword,
      role,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
      },
    });
    await newUser.save();

    let newRoleDocument;
    let prefferedLang;

    switch (role) {
      case "patient":
        prefferedLang = fields.get("prefferedLang")?.toString();

        if (!prefferedLang) prefferedLang = "english";

        newRoleDocument = new PatientModel({
          user: newUser._id,
          prefferedLang: prefferedLang,
        });
        break;
      case "healthcare_provider":
        const professional_license_id = fields
          .get("professional_license_id")
          ?.toString();
        const specialization = fields.get("specialization")?.toString();
        const associatedOrganization = fields
          .get("associatedOrganization")
          ?.toString();
        const yearsOfExperience = parseInt(
          fields.get("yearsOfExperience")?.toString() || "0",
          10
        );
        prefferedLang = fields.get("prefferedLang")?.toString();

        newRoleDocument = new HealthcareProviderModel({
          user: newUser._id,
          professional_license_id: professional_license_id,
          specialization: specialization,
          associatedOrganization: associatedOrganization,
          yearsOfExperience: yearsOfExperience,
          prefferedLang: prefferedLang,
          calLink: "",
        });
        break;
      case "ngo":
        const organizationName = fields.get("organizationName")?.toString();
        const areaOfFocus = fields.get("areaOfFocus")?.toString();

        newRoleDocument = new ngoModel({
          organizationName: organizationName,
          contactPerson: newUser._id,
          areaOfFocus: areaOfFocus,
        });
        break;
      default:
        await UserModel.findByIdAndDelete(newUser._id);
        return NextResponse.json(
          {
            message: "Invalid role specified.",
          },
          { status: 400 }
        );
    }

    await newRoleDocument.save();

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: {
          name: newUser.fullname,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json(
      {
        message: "Registration failed. Please try again later.",
      },
      { status: 500 }
    );
  }
}
