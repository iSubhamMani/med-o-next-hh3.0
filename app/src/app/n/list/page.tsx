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
import { Label } from "@/components/ui/label";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, MapPin, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
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
interface EventData {
  name: string;
  eventDate: string;
  location: string;
  locationDesc: string;
}

export default function ListCamps() {
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    eventDate: "",
    location: "",
    locationDesc: "",
  });
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const userLocation = useGeolocation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLocationUpdate = (loc: { lat: number; lng: number }) => {
    setEventData((prevData) => ({
      ...prevData,
      location: `${loc.lng}, ${loc.lat}`,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventData.location || !eventData.name || !eventData.eventDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    const fd = new FormData();
    fd.append("name", eventData.name);
    fd.append("eventDate", eventData.eventDate);
    fd.append("location", eventData.location);
    fd.append("locationDesc", eventData.locationDesc);

    try {
      const res = await axios.post("/api/list-event", fd);

      if (res.data.success) {
        toast.success("Event Listed successfully!");
        router.push("/n/dashboard");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (userLocation.loaded && !userLocation.error) {
      setEventData((prevData) => ({
        ...prevData,
        location: `${userLocation.coordinates.lng}, ${userLocation.coordinates.lat}`,
      }));
    }
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
      {/* Header */}
      <header className="p-6 mb-8 rounded-b-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border-b border-slate-700">
        <div className="container mx-auto">
          <Link href="/p/dashboard">
            <Button
              variant="ghost"
              className="text-white hover:text-emerald-300 hover:bg-white/10 cursor-pointer transition-all duration-300 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-2">
              List Your Health Camp
            </h1>
            <p className="text-slate-300">
              Click on the map to set the event location, then fill out the form below.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-8">
        <Card className="bg-slate-800/30 border-slate-700/50 shadow-2xl">
          <CardContent className="p-8">
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            >
              {/* Map Section */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-6 w-6 text-emerald-400" />
                  <Label className="text-slate-200 font-medium text-lg">Event Location</Label>
                </div>

                {/* Map Integration */}
                <div className="rounded-xl overflow-hidden border border-slate-600/50">
                  {isClient ? (
                    userLocation.loaded ? (
                      userLocation.error ? (
                        <div className="h-96 bg-slate-700/50 flex items-center justify-center text-red-400">
                          {userLocation.error.message}
                        </div>
                      ) : (
                        <MapComponent
                          initialPosition={userLocation.coordinates}
                          onLocationChange={handleLocationUpdate}
                        />
                      )
                    ) : (
                      <div className="h-96 flex justify-center items-center bg-slate-700/50 rounded-xl">
                        <p className="text-slate-400">Loading map...</p>
                      </div>
                    )
                  ) : (
                    <div className="h-96 flex justify-center items-center bg-slate-700/50 rounded-xl">
                      <p className="text-slate-400">Initializing map...</p>
                    </div>
                  )}
                </div>

                {/* Location Coordinates Input */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-200 font-medium">Selected Coordinates</Label>
                  <Input
                    id="location"
                    name="location"
                    readOnly
                    className="cursor-not-allowed bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                    placeholder="Click on the map to set location"
                    value={eventData.location}
                  />
                  <p className="text-sm text-slate-400">
                    Longitude, Latitude
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="xl:col-span-1 space-y-6">

                {/* Event Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-emerald-400" />
                    <Label className="text-slate-200 font-medium">Event Name</Label>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name of the event"
                    value={eventData.name}
                    onChange={handleInputChange}
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-emerald-400"
                  />
                </div>

                {/* Location Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    <Label className="text-slate-200 font-medium">Event Location in Words</Label>
                  </div>
                  <Input
                    id="locationDesc"
                    name="locationDesc"
                    placeholder="E.g., Community Center, Main Hall"
                    value={eventData.locationDesc}
                    onChange={handleInputChange}
                    className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-emerald-400"
                  />
                </div>

                {/* Event Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    <Label htmlFor="eventDate" className="text-slate-200 font-medium">Event Date</Label>
                  </div>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={eventData.eventDate}
                    onChange={handleInputChange}
                    className="bg-slate-700/50 border-slate-600/50 text-white focus:border-emerald-400"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  disabled={
                    !eventData.location ||
                    !eventData.name ||
                    !eventData.eventDate ||
                    submitting
                  }
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "List Event"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}