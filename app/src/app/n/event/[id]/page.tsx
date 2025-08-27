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
import { ArrowLeft, LoaderCircle, MapPin, Calendar, User, Clock, Loader2, Heart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const eventId = useParams().id;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await axios.get("/api/event/" + eventId);
        console.log("Event data:", res.data);
        if (res.data) {
          setEventData(res.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Loading Event Details...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
      {/* Header */}
      <header className="p-6 mb-8 rounded-b-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border-b border-slate-700">
        <div className="container mx-auto">
          <Link href="/n/dashboard">
            <Button
              variant="ghost"
              className="text-white hover:text-emerald-300 hover:bg-white/10 cursor-pointer transition-all duration-300 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to NGO Dashboard
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Event Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Map Section */}
          <div className="xl:col-span-2">
            <Card className="bg-slate-800/30 border-slate-700/50 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-emerald-400" />
                  Event Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl overflow-hidden border border-slate-600/50">
                  {isClient && eventData.location.coordinates[0] !== 0 && (
                    <MapComponent
                      initialPosition={{
                        lng: eventData.location.coordinates[0],
                        lat: eventData.location.coordinates[1],
                      }}
                      draggable={false}
                    />
                  )}
                  {(!isClient || eventData.location.coordinates[0] === 0) && (
                    <div className="h-96 bg-slate-700/50 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400">Map loading...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1 space-y-6">
            
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardContent className="space-y-6">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-emerald-400" />
                    <Label className="text-slate-200 font-medium">Event Name</Label>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-white font-semibold text-lg">{eventData.name}</p>
                  </div>
                </div>

                {/* Event Date */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-emerald-400" />
                    <Label className="text-slate-200 font-medium">Event Date</Label>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-emerald-300 font-semibold">{eventData.eventDate}</p>
                  </div>
                </div>

                {/* Location Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    <Label className="text-slate-200 font-medium">Location</Label>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-white">{eventData.locationDesc}</p>
                  </div>
                </div>

                {/* Listed By */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-emerald-400" />
                    <Label className="text-slate-200 font-medium">Listed By</Label>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
                    <p className="text-white">{eventData.listedBy}</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}