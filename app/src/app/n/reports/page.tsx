"use client";

import ReportsMap from "@/components/ReportMap";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NGOMapPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await axios.get("/api/report");
        if (res.status === 200) {
          setReports(res.data);
        }
      } catch (error) {
        console.log("Error fetching reports:", error);
      }
    }

    fetchReports();
  }, []);

  console.log("Fetched Reports:", reports);

  if (!reports || reports?.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">NGO Reports Tracker</h1>
        <p>Loading Reports...</p>
      </div>
    );
  }

  return (
    reports && (
      <div className="p-4">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/p/dashboard">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h2>Report Tracker</h2>
        </div>
        <ReportsMap reports={reports} />
      </div>
    )
  );
}
