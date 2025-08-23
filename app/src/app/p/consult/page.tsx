"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CalButton from "@/components/CalPopup";

interface HealthProviderData {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  specialization: string;
  associatedOrganization: string;
  yearsOfExperience: number;
  calLink: string;
}

const Consult = () => {
  const [healthProviders, setHealthProviders] = useState<HealthProviderData[]>(
    []
  );

  useEffect(() => {
    async function getHealthProviders() {
      try {
        const res = await axios.get("/api/healthProviders");
        setHealthProviders(res.data.providers);
      } catch (error) {
        console.log(error);
      }
    }
    getHealthProviders();
  }, []);

  return (
    <div className="container mx-auto px-4 pb-8 pt-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Available Health Providers
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthProviders?.map((provider) => (
          <Card
            key={provider._id}
            className="shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {provider.fullname}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Specialisation:{" "}
                <span className="text-neutral-700 font-medium">
                  {provider.specialization}
                </span>
              </p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Email:</span> {provider.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {provider.phone}
              </p>
              <p>
                <span className="font-medium">Organization:</span>{" "}
                {provider.associatedOrganization}
              </p>
              <p>
                <span className="font-medium">Experience:</span>{" "}
                {provider.yearsOfExperience} years
              </p>

              {provider.calLink ? (
                <CalButton calLink={provider.calLink} />
              ) : (
                <p className="text-red-500 mt-4">Booking link not available</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Consult;
