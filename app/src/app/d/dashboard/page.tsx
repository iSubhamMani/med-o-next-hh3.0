"use client";

import DashboardCard from "@/components/DashboardCard";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Calendar, Stethoscope, Users, Clock, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
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

interface Event {
  _id: string;
  name: string;
  eventDate: string;
  listedBy: string;
  locationDesc: string;
}

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <Link href={"/d/event/" + event._id} key={event._id}>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800/70 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-white text-base group-hover:text-emerald-300 transition-colors">
                  {event.name}
                </h4>
                <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                  <span className="text-emerald-400">📍</span> {event.locationDesc}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
                  {event.eventDate}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
      {/* Header */}
      <header className="p-6 mb-8 rounded-b-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border-b border-slate-700">
        <div className="flex items-center justify-between container mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl flex items-center gap-3 text-center font-bold animate-fade-in-down">
              <Stethoscope className="h-7 w-7 text-emerald-300" />
              Doctor Dashboard
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative mb-8 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border-y border-slate-700 overflow-hidden mx-6">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" />
        <div className="relative p-8 text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-4 animate-fade-in-up">
            Welcome, Doctor
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Manage your appointments, connect with patients, and provide exceptional healthcare through our integrated platform.
          </p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Events Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl font-semibold text-white">Upcoming Events</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-sm px-3 py-1 rounded-full">
                  {upcomingEvents.length} events
                </span>
              </div>

              {upcomingEvents && upcomingEvents.length > 0 ? (
                <EventsList events={upcomingEvents} />
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No upcoming events scheduled</p>
                  <p className="text-slate-500 text-sm mt-2">Events will appear here when they are created</p>
                </div>
              )}
            </div>
          </div>

          {/* Cal.com Integration Card */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/30 border-slate-700/50 h-fit">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-emerald-400" />
                  <CardTitle className="text-white text-xl">Patient Consultations</CardTitle>
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed">
                  Connect your Cal.com link to enable patients to schedule consultations directly with you.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="calLink" className="text-slate-200 font-medium mb-2 block">
                      Your Cal.com Link
                    </Label>
                    <Input
                      id="calLink"
                      type="text"
                      placeholder="https://cal.com/your-link"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                      value={calLink}
                      onChange={(e) => setCalLink(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={saveCalLink}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                  >
                    Save Configuration
                  </Button>
                </div>

                {calLink && (
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-emerald-300 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Cal.com integration active
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;