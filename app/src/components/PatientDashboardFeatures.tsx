"use client";

import {
  Stethoscope,
  FileText,
  MessageSquare,
  Video,
  Calendar,
  FlaskConical,
  Camera,
  HeartPulse,
} from "lucide-react";
import DashboardCard from "./DashboardCard";
import { EventsList } from "./EventsList";
import { useEffect, useState } from "react";
import axios from "axios";

const features = [
  {
    title: "AI-Powered Health Analysis",
    description:
      "Upload your medical documents for instant analysis and insights.",
    icon: <Stethoscope className="w-8 h-8 text-emerald-400" />,
    link: "/p/lens",
  },
  {
    title: "Consult with Health Professionals",
    description:
      "Connect with our team of expert doctors and specialists for a consultation.",
    icon: <MessageSquare className="w-8 h-8 text-emerald-400" />,
    link: "/p/consult",
  },
  {
    title: "Take AI Health Tips",
    description:
      "Let AI give you a proper lifestyle assessment and recommendations.",
    icon: <HeartPulse className="w-8 h-8 text-emerald-400" />,
    link: "/p/coach",
  },
];

const PatientDashboardFeatures = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get("/api/list-event/all");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <DashboardCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            link={feature.link}
            animationDelay={`${index * 100}ms`}
          />
        ))}
      </div>
      {events.length > 0 ? (
        <div>
          <h2 className="text-2xl text-white font-bold mt-12 mb-6">
            Upcoming Health Events
          </h2>
          <EventsList events={events} />
        </div>
      ) : (
        <p className="text-base mt-12">No upcoming events.</p>
      )}
    </div>
  );
};

export default PatientDashboardFeatures;
