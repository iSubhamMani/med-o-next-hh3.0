"use client";

import DashboardCard from "@/components/DashboardCard";
import { ReportsList } from "@/components/ReportsList";
import { FileText, MapPin, MapPinned, Heart, Users, Calendar, Plus, Loader2, AlertTriangle } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    getListedEvents();
    getReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Loading NGO Dashboard...</h1>
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
              <Heart className="h-7 w-7 text-emerald-300" /> 
              NGO Dashboard
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
            Making Healthcare Accessible
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
            Organize health camps, track community reports, and provide essential healthcare services to those who need it most.
          </p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Recent Reports Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-emerald-400" />
                  <CardTitle className="text-white text-lg">Recent Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.length > 0 ? (
                    <ReportsList reports={recentReports} />
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No reports available</p>
                    </div>
                  )}
                </div>
                <Link href="/n/report">
            <Button
              variant="primary"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 w-full mt-4 cursor-pointer"
            >
              Add Report
            </Button>
          </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
            
            {/* Med-o-Track Card */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPinned className="h-7 w-7 text-emerald-400" />
                  <div>
                    <CardTitle className="text-white text-2xl">Med-o-Track</CardTitle>
                    <CardDescription className="text-slate-300 mt-1">
                      List upcoming health camps and events.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/50">
                  <p className="text-slate-200 leading-relaxed">
                    This is where you can create and publish details about your
                    upcoming health events and camps. Fill out the details and share
                    your services with the community and reach a wider audience.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2"
                    onClick={() => router.push("/n/list")}
                  >
                    <Plus className="w-5 h-5" />
                    Create New Event
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events Card */}
            <Card className="bg-slate-800/30 border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-emerald-400" />
                    <CardTitle className="text-white text-xl">Your Upcoming Events</CardTitle>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-sm px-3 py-1 rounded-full">
                    {events.length} events
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">No upcoming events</p>
                    <p className="text-slate-500 text-sm mb-6">Create your first health camp or event to get started</p>
                    <Button
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                      onClick={() => router.push("/n/list")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <Link
                        href={`/n/event/${event._id}`}
                        key={event._id}
                        className="block"
                      >
                        <div className="bg-slate-700/30 p-5 rounded-xl border border-slate-600/50 hover:border-emerald-500/30 hover:bg-slate-700/50 transition-all duration-300 group">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                              {event.name}
                            </h3>
                            <span className="text-xs text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                              {new Date(event.eventDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Users className="w-4 h-4 text-emerald-400" />
                              <span>Listed by: {event.listedBy}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <MapPin className="w-4 h-4 text-emerald-400" />
                              <span>{event.locationDesc}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{events.length}</p>
                  <p className="text-slate-300 text-sm">Active Events</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{recentReports.length}</p>
                  <p className="text-slate-300 text-sm">Recent Reports</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">Uncountable</p>
                  <p className="text-slate-300 text-sm">Lives Impacted</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;