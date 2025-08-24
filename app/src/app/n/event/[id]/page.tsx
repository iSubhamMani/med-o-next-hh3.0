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
import { useParams, useRouter } from "next/navigation";

interface EventData {
  _id: string;
  name: string;
  eventDate: string;
  listedBy: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  locationDesc: string;
}

export default function EventDetails() {
  const [eventData, setEventData] = useState<EventData>({
    _id: "",
    name: "",
    eventDate: "",
    listedBy: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    locationDesc: "",
  });
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const eventId = useParams().id;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get("/api/event/" + eventId);
        console.log("Event data:", res.data);
        if (res.data) {
          setEventData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchEvent();
  }, []);

  return (
    eventData && (
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
            <CardTitle className="text-3xl font-bold">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 space-y-4">
              {/* Map Integration */}
              <div className="space-y-2">
                <Label>Event Location</Label>
                {isClient && (
                  <MapComponent
                    initialPosition={{
                      lng: eventData.location.coordinates[0],
                      lat: eventData.location.coordinates[1],
                    }}
                    draggable={false}
                  />
                )}
              </div>
            </div>
            <div className="w-full md:w-1/3 space-y-4">
              <div className="space-y-2 text-neutral-600">
                <p>
                  Event Name:{" "}
                  <span className="font-bold text-neutral-900">
                    {eventData.name}
                  </span>
                </p>
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>
                  Event Date:{" "}
                  <span className="font-bold text-neutral-900">
                    {eventData.eventDate}
                  </span>
                </p>
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>
                  Event Location:{" "}
                  <span className="font-bold text-neutral-900">
                    {eventData.locationDesc}
                  </span>
                </p>
              </div>
              <div className="space-y-2 text-neutral-600">
                <p>
                  Event Listed By:{" "}
                  <span className="font-bold text-neutral-900">
                    {eventData.listedBy}
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
