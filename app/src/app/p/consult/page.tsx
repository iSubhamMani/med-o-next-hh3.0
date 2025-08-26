"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CalButton from "@/components/CalPopup";
import Link from "next/link";
import { ArrowLeft, Briefcase, Mail, Phone, Star } from "lucide-react";

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
  const [healthProviders, setHealthProviders] = useState<HealthProviderData[]>([]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white py-8 px-6">
      <div className="mb-8">
        <Link href="/p/dashboard">
          <Button
            variant="ghost"
            className="mb-4 text-emerald-300 hover:text-emerald-100 cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 rounded-full shadow-lg border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-2 animate-fade-in-down">
            Available Health Providers
          </h1>
          <p className="text-neutral-300 text-sm animate-fade-in-down animation-delay-200">
            Consult with our expert health providers
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {healthProviders?.map((provider, index) => (
          <Card
            key={provider._id}
            className="rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-slate-700 ring-1 ring-slate-700/50 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-emerald-400">
                {provider.fullname}
              </CardTitle>
              <p className="text-sm text-neutral-300">
                {provider.specialization}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-neutral-300">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>{provider.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{provider.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>{provider.associatedOrganization}</span>
              </p>
              <p className="flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-400" />
                <span>{provider.yearsOfExperience} years of experience</span>
              </p>

              <div className="pt-4">
                {provider.calLink ? (
                  <CalButton calLink={provider.calLink} />
                ) : (
                  <p className="text-red-400 mt-4">
                    Booking link not available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Consult;