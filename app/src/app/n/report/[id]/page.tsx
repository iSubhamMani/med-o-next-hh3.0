"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface ReportData {
  _id: string;
  title: string;
  reportType: string;
  details: string;
  location: {
    type: string;
    coordinates: number[];
  };
  createdAt: string;
  reportedBy: string;
  ngoName: string;
}
export default function ReportDetails() {
  const [reportData, setReportData] = useState<ReportData>({
    _id: "",
    title: "",
    reportType: "",
    details: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    createdAt: "",
    reportedBy: "",
    ngoName: "",
  });
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const reportId = useParams().id;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get("/api/report/" + reportId);
        console.log("Report data:", res.data);
        if (res.data) {
          setReportData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchReport();
  }, []);

  return (
    reportData && (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="mb-4">
          <Link href="/n/dashboard">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card className="w-full max-w-7xl shadow-lg rounded-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">Report Details</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div className="w-2/3 space-y-4">
              {/* Map Integration */}
              <div className="space-y-2">
                <Label>Report Location</Label>
                {isClient && (
                  <MapComponent
                    initialPosition={{
                      lng: reportData.location.coordinates[0],
                      lat: reportData.location.coordinates[1],
                    }}
                    draggable={false}
                  />
                )}
              </div>
            </div>
            <div className="w-1/3 space-y-4">
              <div className="space-y-2 text-neutral-700 text-xl font-semibold">
                <p>{reportData.title}</p>
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>
                  Details:{" "}
                  <span className="font-bold text-neutral-900">
                    {reportData.details}
                  </span>
                </p>
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>
                  Type:{" "}
                  <span className="font-bold text-neutral-900">
                    {reportData.reportType}
                  </span>
                </p>
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>
                  Event Listed By:{" "}
                  <span className="font-bold text-neutral-900">
                    {reportData.reportedBy} ({reportData.ngoName})
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
}
