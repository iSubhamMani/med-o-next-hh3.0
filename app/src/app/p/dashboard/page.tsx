import { Menu, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientDashboardFeatures from "@/components/PatientDashboardFeatures";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";

const PatientDashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-700">
          Please log in to access your dashboard.
        </h1>
      </div>
    );
  }

  const userId = session.user._id as string;
  const user = await fetchPatientDetails(userId);

  return (
    user && (
      <div className="min-h-screen">
        {/* Header */}
        <header className="glass-card mx-4 pt-4 mb-8">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div>
                <h1
                  style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}
                  className="text-xl font-bold text-white"
                >
                  Welcome {user.fullname}!
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-white" />
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <div className="relative mx-4 mb-8 glass-card overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" />
          <div className="relative p-8 text-center">
            <h2
              style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}
              className="text-3xl font-bold text-white mb-4"
            >
              Your Health, Our Priority
            </h2>
            <p className="text-lg text-neutral-100 max-w-2xl mx-auto">
              Experience the future of healthcare with our AI-powered medical
              solutions designed to keep you healthy and informed.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <PatientDashboardFeatures />
      </div>
    )
  );
};

export default PatientDashboard;
