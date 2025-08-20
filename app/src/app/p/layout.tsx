import React, { ReactNode } from "react";

const PatientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gradient-to-b from-blue-700 via-neutral-200 to-white">
      {children}
    </div>
  );
};

export default PatientLayout;
