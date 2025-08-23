"use client";

import Link from "next/link";

interface Event {
  _id: string;
  name: string;
  eventDate: string;
  listedBy: string;
  locationDesc: string;
}

interface EventsListProps {
  events: Event[];
}

export const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className="flex flex-col gap-3">
      {events.map((event) => (
        <Link href={"/p/event/" + event._id} key={event._id}>
          <div className="backdrop-blur-sm bg-glass-hover/50 p-3 rounded-lg border border-glass-border/50 hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm">
                  {event.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  📍 {event.locationDesc}
                </p>
              </div>
              <span className="text-xs text-primary font-medium ml-3">
                {event.eventDate}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
