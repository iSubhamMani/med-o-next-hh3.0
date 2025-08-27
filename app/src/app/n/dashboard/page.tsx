"use client";

import DashboardCard from "@/components/DashboardCard";
import { ReportsList } from "@/components/ReportsList";
import { FileText, MapPin, MapPinned } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

interface EventCard {
  _id: string;
  name: string;
  eventDate: string;
  listedBy: string;
  locationDesc: string;
}

interface ReportCard {
  _id: string;
  title: string;
  reportType: string;
  details: string;
  location: string;
  createdAt: string;
}

const NGODashboard = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventCard[]>([]);
  const [recentReports, setRecentReports] = useState<ReportCard[]>([]);

  useEffect(() => {
    async function getListedEvents() {
      try {
        const res = await axios.get("/api/list-event");
        console.log(res.data);
        setEvents(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function getReports() {
      try {
        const res = await axios.get("/api/report");
        console.log(res.data);
        setRecentReports(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getListedEvents();
    getReports();
  }, []);

  return (
    <div className="container mx-auto px-4 pb-8 pt-4">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
      <div className="flex gap-6">
        {
          <div className="w-1/3 hidden lg:block">
            <div>
              <h4 className="text-lg font-medium text-foreground mb-3">
                Recent Reports
              </h4>
              <ReportsList reports={recentReports} />
            </div>
          </div>
        }
        <div className="flex flex-col gap-4">
          <Card className="flex-1 h-max">
            <CardHeader>
              <CardTitle className="text-2xl flex gap-2 items-center">
                <MapPinned className="size-5" />
                Med-o-Track
              </CardTitle>
              <CardDescription>
                List upcoming health camps and events.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-neutral-700">
                This is where you can create and publish details about your
                upcoming health events and camps. Fill out the details and share
                your services with the community and reach a wider audience.
              </p>
              <div className="flex justify-end">
                <Button
                  className="bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
                  onClick={() => router.push("/n/list")}
                >
                  List
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 h-max">
            <CardHeader>
              <CardTitle className="text-lg flex gap-2 items-center">
                Your Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {events.length === 0 ? (
                <p className="text-neutral-700">
                  You have not listed any upcoming events.
                </p>
              ) : (
                events.map((event) => (
                  <Link
                    href={`/n/event/${event._id}`}
                    key={event._id}
                    className="hover:bg-gray-50 p-2 rounded-md block"
                  >
                    <div key={event._id} className="space-y-1">
                      <h3 className="text-md font-semibold">{event.name}</h3>
                      <div className="flex gap-6 items-start">
                        <div>
                          <p className="text-sm text-neutral-600">
                            Date:{" "}
                            {new Date(event.eventDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Listed By: {event.listedBy}
                          </p>
                        </div>
                        <p className="text-sm text-neutral-600 flex items-center">
                          <MapPin className="size-4" /> {event.locationDesc}
                        </p>
                      </div>
                      <hr />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
