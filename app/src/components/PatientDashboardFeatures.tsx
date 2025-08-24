"use client";

import { Camera, Brain, MessageCircle, Calendar } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { EventsList } from "@/components/EventsList";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface EventCard {
  _id: string;
  name: string;
  eventDate: string;
  listedBy: string;
  locationDesc: string;
}

const PatientDashboardFeatures = () => {
  const router = useRouter();
  const [upcomingEvents, setUpcomingEvents] = useState<EventCard[]>([]);

  useEffect(() => {
    async function getListedEvents() {
      try {
        const res = await axios.get("/api/list-event/all");
        console.log(res.data);
        setUpcomingEvents(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getListedEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 pb-12">
      <div className="absolute w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-40 top-20 left-20" />
      <div className="absolute w-72 h-72 bg-emerald-300 rounded-full blur-3xl opacity-30 bottom-20 right-20" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Med-o-Lens */}
        <DashboardCard
          title="Med-o-Lens"
          description="AI-powered medical records reader"
          icon={<Camera />}
          buttonText="Scan Prescription"
          onButtonClick={() => router.push("/p/lens")}
          className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl backdrop-blur bg-white/80 border border-gray-100"
        >
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Instantly scan and understand your prescriptions with AI-powered
              analysis
            </p>
          </div>
        </DashboardCard>

        {/* Med-o-Coach */}
        <DashboardCard
          title="Med-o-Coach"
          description="Personalized health suggestions"
          icon={<Brain />}
          buttonText="Get Health Tips"
          onButtonClick={() => router.push("/p/coach")}
          className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl backdrop-blur bg-white/80 border border-gray-100"
        >
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Receive personalized health recommendations based on your medical
              history
            </p>
          </div>
        </DashboardCard>

        {/* Med-o-Consult */}
        <DashboardCard
          title="Med-o-Consult"
          description="Real-time health consultations"
          icon={<MessageCircle />}
          buttonText="Consult"
          onButtonClick={() => router.push("/p/consult")}
          className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl backdrop-blur bg-white/80 border border-gray-100"
        >
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-tr from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Schedule a consultation with a certified health professional.
            </p>
          </div>
        </DashboardCard>

        {/* Med-o-Track */}
        <DashboardCard
          title="Med-o-Track"
          description="Track health camps & immunization"
          icon={<Calendar />}
          className="md:col-span-2 lg:col-span-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl backdrop-blur bg-white/80 border border-gray-100"
        >
          <div className="px-4 py-6">
            <h4 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              Upcoming Events
            </h4>
            <EventsList events={upcomingEvents} />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default PatientDashboardFeatures;
