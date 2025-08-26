"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, User, Search } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";

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
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const eventId = useParams().id;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get("/api/event/" + eventId);
        if (res.data) {
          setEventData(res.data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.log(error);
        setNotFound(true);
      }
    }
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

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
            Event Details
          </h1>
        </div>
      </div>

      {notFound ? (
        <div className="text-center py-12 animate-fade-in-up">
          <div className="w-24 h-24 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Event Found</h2>
          <p className="text-neutral-400">
            Sorry, we couldn't find the event you're looking for.
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            Please check back later.
          </p>
        </div>
      ) : eventData ? (
        <Card className="w-full max-w-4xl mx-auto rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-slate-700 ring-1 ring-slate-700/50 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-400 text-center">
              {eventData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-8 p-6">
            <div className="w-full md:w-2/3">
              <Label className="text-lg font-semibold text-neutral-300 mb-2 block">
                Event Location
              </Label>
              <div className="h-64 md:h-full rounded-lg overflow-hidden border-2 border-slate-700">
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
              <div className="space-y-2 text-neutral-300">
                <p className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">{new Date(eventData.eventDate).toLocaleDateString()}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400 mt-1" />
                  <span className="font-bold">{eventData.locationDesc}</span>
                </p>
                <p className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">{eventData.listedBy}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-400">Loading event details...</p>
        </div>
      )}
    </div>
  );
}
