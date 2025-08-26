import { User } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

interface PatientDashboardHeaderProps {
  fullname: string;
}

const PatientDashboardHeader = ({ fullname }: PatientDashboardHeaderProps) => {
  return (
    <header className="p-4 mb-8 rounded-b-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border-b border-slate-700">
      <div className="flex items-center justify-between container mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-xl flex items-center gap-2 text-center font-bold animate-fade-in-down">
            <User className="h-5 w-5 text-emerald-300" /> Welcome {fullname}!
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
};

export default PatientDashboardHeader;