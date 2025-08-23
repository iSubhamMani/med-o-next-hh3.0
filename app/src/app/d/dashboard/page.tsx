"use client";

import { DashboardCard } from "@/components/DashboardCard";
import { EventsList } from "@/components/EventsList";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Calendar, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface EventCard {
  _id: string;
  name: string;
  eventDate: string;
  listedBy: string;
  locationDesc: string;
}

const DoctorDashboard = () => {
  const router = useRouter();
  const [upcomingEvents, setUpcomingEvents] = useState<EventCard[]>([]);
  const [calLink, setCalLink] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getListedEvents() {
      try {
        setLoading(true);
        const res = await axios.get("/api/list-event/all");
        console.log(res.data);
        setUpcomingEvents(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function getCalLink() {
      try {
        const res = await axios.get("/api/saveCalLink");
        console.log(res.data);
        setCalLink(res.data.link);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getCalLink();
    getListedEvents();
  }, []);

  async function saveCalLink() {
    try {
      const fd = new FormData();
      fd.append("calLink", calLink);
      const res = await axios.post("/api/saveCalLink", fd);

      if (res.data.success) {
        toast.success("Link updated successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log("Upcoming:", upcomingEvents);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pb-8 pt-4">
        <p className="text-base">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8 pt-4">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
      <h2 className="text-center text-2xl font-bold mb-6">Welcome!</h2>
      <div className="flex gap-6">
        <DashboardCard
          title="Med-o-Track"
          description="Track health camps & immunization"
          icon={<Calendar />}
          className="md:col-span-2 lg:col-span-2 flex-1"
        >
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Upcoming Events
            </h4>
            {upcomingEvents && upcomingEvents.length > 0 && (
              <EventsList events={upcomingEvents} />
            )}
            {upcomingEvents && upcomingEvents.length === 0 && (
              <p>No upcoming events</p>
            )}
          </div>
        </DashboardCard>
        <Card className="h-max">
          <CardContent>
            <CardTitle>Consult With Patients</CardTitle>
            <p className="text-neutral-600 mt-6">
              Enter your cal.com link to start accepting consultations.
            </p>
            <div className="space-y-2">
              <Label className="mt-4 text-neutral-700">Your Cal.com Link</Label>
              <Input
                type="text"
                placeholder="https://cal.com/your-link"
                className="mt-4"
                value={calLink}
                onChange={(e) => setCalLink(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={saveCalLink}
                size="sm"
                className="bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
