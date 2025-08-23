"use client";

import Link from "next/link";

interface Report {
  _id: string;
  title: string;
  reportType: string;
  details: string;
  location: string;
  createdAt: string;
}
interface ReportsListProps {
  reports: Report[];
}

export const ReportsList = ({ reports }: ReportsListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {reports.map((report) => (
        <Link href={"/n/report/" + report._id} key={report._id}>
          <div
            key={report._id}
            className="backdrop-blur-sm bg-glass-hover/50 p-3 rounded-lg border border-glass-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm">
                  {report.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {report.details}
                </p>
              </div>
              <span className="text-xs text-primary font-medium ml-3">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
