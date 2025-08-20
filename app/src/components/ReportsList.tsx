"use client";

interface Report {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface ReportsListProps {
  reports: Report[];
}

export const ReportsList = ({ reports }: ReportsListProps) => {
  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div
          key={report.id}
          className="backdrop-blur-sm bg-glass-hover/50 p-3 rounded-lg border border-glass-border/50 hover:border-primary/30 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">
                {report.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {report.description}
              </p>
            </div>
            <span className="text-xs text-primary font-medium ml-3">
              {report.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
