"use client";

import React from "react";
import { Info, MessageCircle, Search, Tent, UserStar, BookPlus } from "lucide-react";

const features = [
  {
    icon: <Search className="h-10 w-10 text-emerald-400" />,
    title: "Med-o-Lens",
    description:
      "Get AI powered insights on prescriptions written by doctors, ensuring accuracy and clarity.",
  },
  {
    icon: <MessageCircle className="h-10 w-10 text-emerald-400" />,
    title: "Med-o-Consult",
    description:
      "Engage in real-time conversations with health professionals for immediate assistance and advice.",
  },
  {
    icon: <UserStar className="h-10 w-10 text-emerald-400" />,
    title: "Med-o-Coach",
    description:
      "Empower patients with personalized health coaching, tailored to their unique needs and conditions.",
  },
  {
    icon: <Info className="h-10 w-10 text-emerald-400" />,
    title: "Med-o-Report",
    description:
      "Report cases of illness and share insights with healthcare providers, enhancing collaborative care.",
  },
  {
    icon: <Tent className="h-10 w-10 text-emerald-400" />,
    title: "Med-o-Track",
    description:
      "Track various health camps and events, ensuring community access to essential healthcare services.",
  },
  {
    icon: <BookPlus className="h-10 w-10 text-emerald-400" />,
    title: "And Many More",
    description:
      "More awesome medical features will be launched soon by our very ideal and witty developer team",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 py-20 overflow-hidden">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 15s linear infinite reverse'
        }}
      ></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-emerald-900/90 to-teal-900/95"></div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-emerald-400/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .fade-in-up-delay-1 { animation: fadeInUp 0.8s ease-out 0.2s both; }
        .fade-in-up-delay-2 { animation: fadeInUp 0.8s ease-out 0.4s both; }
        .fade-in-up-delay-3 { animation: fadeInUp 0.8s ease-out 0.6s both; }
        .fade-in-up-delay-4 { animation: fadeInUp 0.8s ease-out 0.8s both; }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="fade-in-up mb-16">
          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              textShadow: "0 8px 32px rgba(0,0,0,0.8), 0 4px 16px rgba(16, 185, 129, 0.3)"
            }}
          >
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              Smarter Healthcare
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`relative group transform hover:scale-105 transition-all duration-500 fade-in-up-delay-${idx % 5}`}
            >
              {/* Gradient glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-300 blur"></div>

              {/* Card content */}
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 h-full">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>

                <div className="relative z-10">
                  {/* Icon container with glow */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-lg scale-150"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center border border-emerald-400/30 group-hover:border-emerald-400/50 transition-all duration-300">
                        {React.cloneElement(feature.icon, {
                          className: "h-8 w-8 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300"
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Title with gradient */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors duration-300">
                    <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                      {feature.title}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="text-slate-300 leading-relaxed group-hover:text-emerald-50 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner accents */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400/30 rounded-bl-lg opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-gradient-to-r from-teal-300 to-emerald-300 rounded-full opacity-70 animate-ping" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
};

export default Features;