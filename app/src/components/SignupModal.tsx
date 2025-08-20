"use client";

import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import axios from "axios";
import toast from "react-hot-toast";

interface GeneralDetails {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

interface RoleSpecificFields {
  prefferedLang?: string;
  professional_license_id?: string;
  specialization?: string;
  associatedOrganization?: string;
  yearsOfExperience?: string;
  organizationName?: string;
  areaOfFocus?: string;
}

export default function RegistrationModal() {
  const [step, setStep] = useState(1);

  // State for form fields
  const [formData, setFormData] = useState<GeneralDetails>({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  // State for role-specific fields
  const [roleSpecificFields, setRoleSpecificFields] =
    useState<RoleSpecificFields>({});

  // Reset role-specific fields when the role changes
  useEffect(() => {
    switch (formData.role) {
      case "patient":
        setRoleSpecificFields({
          prefferedLang: "",
        });
        break;
      case "healthcare_provider":
        setRoleSpecificFields({
          professional_license_id: "",
          specialization: "",
          associatedOrganization: "",
          yearsOfExperience: "",
          prefferedLang: "",
        });
        break;
      case "ngo":
        setRoleSpecificFields({
          organizationName: "",
          areaOfFocus: "",
        });
        break;
      default:
        setRoleSpecificFields({});
    }
  }, [formData.role]);

  // Handle changes in the form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSpecificChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setRoleSpecificFields((prev) => ({ ...prev, [name]: value }));
  };

  // This function now also handles a new Select component
  const handleSelectChange = (name: string, value: string) => {
    setRoleSpecificFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData();

    for (const key in formData) {
      const value = formData[key as keyof typeof formData];
      if (key === "address") {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, String(value));
      }
    }

    for (const key in roleSpecificFields) {
      const value = roleSpecificFields[key as keyof typeof roleSpecificFields];
      fd.append(key, value !== undefined ? String(value) : "");
    }

    try {
      const res = await axios.post("/api/user", fd);

      if (res.status === 201) {
        toast.success("Registration successful!");
        setFormData({
          name: "",
          email: "",
          phone_number: "",
          password: "",
          role: "",
          address: {
            street: "",
            city: "",
            state: "",
            pinCode: "",
          },
        });
        setRoleSpecificFields({});
        setStep(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render the role-specific fields based on the selected role
  const renderRoleFields = () => {
    switch (formData.role) {
      case "patient":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select
                  value={roleSpecificFields.prefferedLang}
                  onValueChange={(value) =>
                    handleSelectChange("prefferedLang", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="urdu">Urdu</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                    <SelectItem value="odia">Odia</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                    <SelectItem value="punjabi">Punjabi</SelectItem>
                    <SelectItem value="assamese">Assamese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case "healthcare_provider":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="professional_license_id">License ID</Label>
                <Input
                  id="professional_license_id"
                  name="professional_license_id"
                  value={roleSpecificFields.professional_license_id}
                  onChange={handleRoleSpecificChange}
                  placeholder="e.g., 12345678"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={roleSpecificFields.specialization}
                  onChange={handleRoleSpecificChange}
                  placeholder="e.g., Cardiology"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select
                  value={roleSpecificFields.prefferedLang}
                  onValueChange={(value) =>
                    handleSelectChange("prefferedLang", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="urdu">Urdu</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                    <SelectItem value="odia">Odia</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                    <SelectItem value="punjabi">Punjabi</SelectItem>
                    <SelectItem value="assamese">Assamese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label className="w-full" htmlFor="yearsOfExperience">
                  Experience (in years)
                </Label>
                <Input
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  type="number"
                  value={roleSpecificFields.yearsOfExperience || ""}
                  onChange={handleRoleSpecificChange}
                  placeholder="e.g., 5"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="associatedOrganization">
                Associated Organization
              </Label>
              <Input
                id="associatedOrganization"
                name="associatedOrganization"
                value={roleSpecificFields.associatedOrganization}
                onChange={handleRoleSpecificChange}
                placeholder="e.g., Community Hospital"
              />
            </div>
          </>
        );
      case "ngo":
        return (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                value={roleSpecificFields.organizationName}
                onChange={handleRoleSpecificChange}
                placeholder="e.g., Health For All"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="areaOfFocus">Area of Focus</Label>
              <Input
                id="areaOfFocus"
                name="areaOfFocus"
                value={roleSpecificFields.areaOfFocus}
                onChange={handleRoleSpecificChange}
                placeholder="e.g., Immunization, Blood Donation"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="cursor-pointer bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl hover:bg-gray-800 flex items-center space-x-2 transition">
          <span>Get Started</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription>
            Please fill out the form to register as a new user.
          </DialogDescription>
        </DialogHeader>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold">
                  Register as a New User
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {/* Step 1: General Details and Role Selection */}
                {step === 1 && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="role">I am a...</Label>
                      <Select
                        value={formData.role}
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="healthcare_provider">
                            Healthcare Provider
                          </SelectItem>
                          <SelectItem value="ngo">
                            NGO Representative
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Jane Doe"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="e.g., 1234567890"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="street">Street</Label>
                        <Input
                          id="street"
                          name="street"
                          type="text"
                          value={formData.address.street}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                street: e.target.value,
                              },
                            }));
                          }}
                          placeholder="e.g., 123 Main St"
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                city: e.target.value,
                              },
                            }));
                          }}
                          placeholder="e.g., Kolkata"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.address.state}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                state: e.target.value,
                              },
                            }));
                          }}
                          placeholder="e.g., West Bengal"
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          type="number"
                          value={formData.address.pinCode}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                pinCode: e.target.value,
                              },
                            }));
                          }}
                          placeholder="e.g., 700001"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g., janedoe@example.com"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Min. 8 characters"
                        required
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-green-900 hover:bg-green-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
                        onClick={() => setStep(2)}
                        disabled={!formData.role}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2: Role-Specific Details */}
                {step === 2 && (
                  <>
                    {renderRoleFields()}
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-gray-800 hover:bg-gray-800/80 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="secondary"
                          className="bg-gray-800 hover:bg-gray-800/80 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-green-900 hover:bg-green-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
                          type="submit"
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
