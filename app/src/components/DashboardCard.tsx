import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  animationDelay?: string;
}

const DashboardCard = ({
  title,
  description,
  icon,
  link,
  animationDelay,
}: DashboardCardProps) => {
  return (
    <Link href={link}>
      <Card
        className="h-full rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-slate-700 ring-1 ring-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up"
        style={{ animationDelay }}
      >
        <CardHeader>
          <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
            {icon}
          </div>
          <CardTitle className="text-lg font-bold text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-400 text-sm mb-4">{description}</p>
          <div className="flex items-center text-emerald-400 font-semibold">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DashboardCard;