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
    <div className="container mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Med-o-Lens */}
        <DashboardCard
          title="Med-o-Lens"
          description="AI-powered medical records reader"
          icon={<Camera />}
          buttonText="Scan Prescription"
          onButtonClick={() => router.push("/p/lens")}
        >
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
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
        >
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Receive personalized health recommendations based on your medical
              history
            </p>
          </div>
        </DashboardCard>

        {/* Med-o-Chat */}
        <DashboardCard
          title="Med-o-Consult"
          description="Real-time health consultations"
          icon={<MessageCircle />}
          buttonText="Consult"
          onButtonClick={() => router.push("/p/consult")}
        >
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with certified healthcare professionals instantly
            </p>
          </div>
        </DashboardCard>

        {/* Med-o-Track */}
        <DashboardCard
          title="Med-o-Track"
          description="Track health camps & immunization"
          icon={<Calendar />}
          className="md:col-span-2 lg:col-span-2"
        >
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
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
