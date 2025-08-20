"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const DashboardCard = ({
  title,
  description,
  icon,
  children,
  buttonText,
  onButtonClick,
  className,
}: DashboardCardProps) => {
  return (
    <Card className={cn("glass-card p-6 group", className)}>
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="medical-icon text-2xl">{icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>

        {children && <div className="mb-6">{children}</div>}

        {buttonText && (
          <div className="flex justify-end">
            <Button
              onClick={onButtonClick}
              size="sm"
              className="bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
            >
              {buttonText}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
