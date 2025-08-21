"use client";

import { Camera, Brain, MessageCircle, FileText, Calendar } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { ReportsList } from "@/components/ReportsList";
import { EventsList } from "@/components/EventsList";
import { useRouter } from "next/navigation";

// Sample data
const recentReports = [
  {
    id: "1",
    title: "Flu Outbreak - Downtown Area",
    date: "Dec 18",
    description: "Increased flu cases reported in downtown medical centers",
  },
  {
    id: "2",
    title: "Food Poisoning Cluster",
    date: "Dec 15",
    description: "Multiple cases linked to local restaurant chain",
  },
  {
    id: "3",
    title: "Allergy Season Peak",
    date: "Dec 12",
    description: "High pollen count affecting respiratory patients",
  },
];

const upcomingEvents = [
  {
    id: "1",
    name: "Free Health Screening Camp",
    date: "Dec 22",
    location: "Central Park Community Center",
  },
  {
    id: "2",
    name: "COVID-19 Booster Drive",
    date: "Dec 25",
    location: "City Medical Hospital",
  },
  {
    id: "3",
    name: "Pediatric Immunization Drive",
    date: "Dec 28",
    location: "Westside Clinic",
  },
];

const PatientDashboardFeatures = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Med-o-Lens */}
        <DashboardCard
          title="Med-o-Lens"
          description="AI-powered prescription reader"
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
          title="Med-o-Chat"
          description="Chat with doctors"
          icon={<MessageCircle />}
          buttonText="Start Chat"
          onButtonClick={() => console.log("Med-o-Chat clicked")}
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

        {/* Med-o-Report */}
        <DashboardCard
          title="Med-o-Report"
          description="Report health cases & outbreaks"
          icon={<FileText />}
          buttonText="Report Now"
          onButtonClick={() => router.push("/p/report")}
          className="md:col-span-2 lg:col-span-1"
        >
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Recent Reports
            </h4>
            <ReportsList reports={recentReports} />
          </div>
        </DashboardCard>

        {/* Med-o-Track */}
        <DashboardCard
          title="Med-o-Track"
          description="Track health camps & immunization"
          icon={<Calendar />}
          buttonText="See All Events"
          onButtonClick={() => console.log("See all events clicked")}
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
