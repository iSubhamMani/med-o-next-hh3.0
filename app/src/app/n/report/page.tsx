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
import { ArrowLeft, LoaderCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// --- Custom Geolocation Hook ---
// This hook gets the user's current location
const useGeolocation = () => {
  const [location, setLocation] = useState<{
    loaded: boolean;
    coordinates: { lat: number; lng: number };
    error: GeolocationPositionError | null;
  }>({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
    error: null,
  });

  const onSuccess = (position: GeolocationPosition) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      error: null,
    });
  };

  const onError = (error: GeolocationPositionError) => {
    setLocation({
      loaded: true,
      coordinates: { lat: 0, lng: 0 },
      error,
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation((prevState) => ({
        ...prevState,
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported",
        } as GeolocationPositionError,
      }));
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }, []);

  return location;
};

// --- Main Form Component ---
interface ReportData {
  title: string;
  reportType: string;
  location: string;
  details: string;
}

export default function HealthReportForm() {
  const [reportData, setReportData] = useState<ReportData>({
    title: "",
    reportType: "",
    location: "",
    details: "",
  });
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const userLocation = useGeolocation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLocationUpdate = (loc: { lat: number; lng: number }) => {
    setReportData((prevData) => ({
      ...prevData,
      location: `${loc.lng}, ${loc.lat}`,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setReportData((prevData) => ({
      ...prevData,
      reportType: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !reportData.location ||
      !reportData.reportType ||
      !reportData.details ||
      !reportData.title
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    const fd = new FormData();
    fd.append("reportType", reportData.reportType);
    fd.append("title", reportData.title);
    fd.append("details", reportData.details);
    fd.append("location", reportData.location);

    try {
      const res = await axios.post("/api/report", fd);

      if (res.data.success) {
        toast.success("Report submitted successfully!");
        router.push("/p/dashboard");
      }
    } catch (error) {
      console.log("Error submitting report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (userLocation.loaded && !userLocation.error) {
      setReportData((prevData) => ({
        ...prevData,
        location: `${userLocation.coordinates.lng}, ${userLocation.coordinates.lat}`,
      }));
    }
  }, [userLocation]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="mb-4">
        <Link href="/p/dashboard">
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
          <CardTitle className="text-3xl font-bold">
            Report a Health Incident
          </CardTitle>
          <CardDescription className="text-gray-500">
            Click on the map to set the incident location, then fill out the
            form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex space-x-6">
            <div className="w-2/3 space-y-4">
              {/* Map Integration */}
              <div className="space-y-2">
                <Label>Incident Location</Label>
                {isClient ? (
                  userLocation.loaded ? (
                    userLocation.error ? (
                      <div className="text-red-500">
                        {userLocation.error.message}
                      </div>
                    ) : (
                      <MapComponent
                        initialPosition={userLocation.coordinates}
                        onLocationChange={handleLocationUpdate}
                      />
                    )
                  ) : (
                    <div className="h-64 flex justify-center items-center bg-gray-200 rounded-xl">
                      <p>Loading map...</p>
                    </div>
                  )
                ) : (
                  <div className="h-64 flex justify-center items-center bg-gray-200 rounded-xl">
                    <p>Initializing map...</p>
                  </div>
                )}
              </div>

              {/* Location Coordinates Input (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="location">Selected Coordinates</Label>
                <Input
                  id="location"
                  name="location"
                  readOnly
                  className="cursor-not-allowed"
                  placeholder="Click on the map to set location"
                  value={reportData.location}
                />
                <p className="text-sm text-gray-500">Latitude, Longitude</p>
              </div>
            </div>
            <div className="w-1/3 space-y-4">
              {/* Report Type */}
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={reportData.reportType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the type of incident" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="illness">Illness</SelectItem>
                    <SelectItem value="outbreak">Outbreak</SelectItem>
                    <SelectItem value="mentalHealth">
                      Mental Health Crisis
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <Label htmlFor="details">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief title of the incident"
                  value={reportData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  name="details"
                  placeholder="Please provide a brief description of the incident."
                  className="resize-none"
                  value={reportData.details}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                disabled={
                  !reportData.location ||
                  !reportData.reportType ||
                  !reportData.details ||
                  submitting
                }
                type="submit"
                className="mt-4 w-full flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
              >
                {submitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
