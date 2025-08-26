import { User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientDashboardFeatures from "@/components/PatientDashboardFeatures";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { fetchPatientDetails } from "@/utils/fetchPatientDetails";
import LogoutButton from "@/components/LogoutButton";
import { Loader2, AlertTriangle } from "lucide-react";

const PatientDashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Please log in to access your dashboard.
          </h1>
        </div>
      </div>
    );
  }

  const userId = session.user._id as string;
  let user;
  let error;

  try {
    user = await fetchPatientDetails(userId);
  } catch (e) {
    error = "Failed to fetch user details. Please try again later.";
    console.error(e);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400">{error}</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white">
      <header className="p-4 mb-8 rounded-b-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border-b border-slate-700">
        <div className="flex items-center justify-between container mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl flex items-center gap-2 text-center font-bold animate-fade-in-down">
              <User className="h-5 w-5 text-emerald-300" /> Welcome{" "}
              {user.fullname}!
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative mb-8 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border-y border-slate-700 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 animate-pulse" />
        <div className="relative p-8 text-center container mx-auto">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-4 animate-fade-in-up">
            Your Health, Our Priority
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Experience the future of healthcare with our AI-powered medical
            solutions designed to keep you healthy and informed.
          </p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <PatientDashboardFeatures />
    </div>
  );
};

export default PatientDashboard;
