const PatientDashboardHero = () => {
  return (
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
  );
};

export default PatientDashboardHero;
