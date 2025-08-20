"use client";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
}

interface EventsListProps {
  events: Event[];
}

export const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="backdrop-blur-sm bg-glass-hover/50 p-3 rounded-lg border border-glass-border/50 hover:border-primary/30 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">
                {event.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                📍 {event.location}
              </p>
            </div>
            <span className="text-xs text-primary font-medium ml-3">
              {event.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
