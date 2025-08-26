"use client";

import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite'
        }}
      ></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/85 to-teal-900/90"></div>

      {/* Animated medical themed background elements */}
      <div className="absolute inset-0">
        {/* Large pulsing medical cross */}
        <div className="absolute top-20 right-20 w-32 h-32 opacity-15 animate-pulse">
          <div className="absolute top-1/2 left-0 w-full h-4 bg-gradient-to-r from-emerald-400 to-teal-400 transform -translate-y-1/2 rounded-full"></div>
          <div className="absolute left-1/2 top-0 w-4 h-full bg-gradient-to-b from-emerald-400 to-teal-400 transform -translate-x-1/2 rounded-full"></div>
        </div>

        {/* Floating animated shapes */}
        <div className="absolute top-40 left-20 w-24 h-24 border-4 border-emerald-400/30 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 right-40 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg opacity-60 transform rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-60 right-1/3 w-16 h-16 border-2 border-teal-400/40 rounded-full opacity-50 animate-ping" style={{ animationDuration: '2s' }}></div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 1s ease-out; }
        .fade-in-up-delay-1 { animation: fadeInUp 1s ease-out 0.2s both; }
        .fade-in-up-delay-2 { animation: fadeInUp 1s ease-out 0.4s both; }
      `}</style>

      {/* Main Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-20">
        <div className="text-center max-w-6xl mx-auto space-y-16">

          {/* Brand Name with glow effect */}
          <div className="fade-in-up mb-8">
            <h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent tracking-wide"
              style={{
                textShadow: "0 0 30px rgba(16, 185, 129, 0.5)",
                filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8))"
              }}
            >
              Med-o-Next
            </h2>
          </div>

          {/* Main Heading with enhanced gradients */}
          <div className="space-y-8 fade-in-up-delay-1">
            <h1
              className="text-white text-6xl md:text-8xl font-black leading-tight"
              style={{
                textShadow: "0 8px 32px rgba(0,0,0,0.8), 0 4px 16px rgba(16, 185, 129, 0.3)"
              }}
            >
              Empowering{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                  Patients
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 blur-xl opacity-70 animate-pulse"></div>
              </span>
            </h1>
            <h1
              className="text-white text-6xl md:text-8xl font-black leading-tight"
              style={{
                textShadow: "0 8px 32px rgba(0,0,0,0.8), 0 4px 16px rgba(16, 185, 129, 0.3)"
              }}
            >
              Enhancing{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-500 bg-clip-text text-transparent">
                  Care
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-teal-400/30 to-emerald-400/30 blur-xl opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </span>
            </h1>
          </div>

          {/* Description with glassmorphism effect */}
          <div className="max-w-4xl mx-auto fade-in-up-delay-1">
            <div
              className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-emerald-500/30 relative overflow-hidden"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(16, 185, 129, 0.3)"
              }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-teal-500/10 animate-pulse"></div>

              <p className="relative text-white text-lg md:text-xl leading-relaxed space-y-4">
                <span className="block mb-4">
                  Unifying patients, healthcare providers, and caregivers in a
                </span>
                <span className="font-bold bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-300 bg-clip-text text-transparent text-2xl md:text-3xl block mb-4">
                  single, intuitive system
                </span>
                <span className="block">
                  designed to simplify the complexities of modern healthcare.
                </span>
              </p>

              {/* Decorative animated corners */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-emerald-400/60 rounded-tl-lg animate-pulse"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-emerald-400/60 rounded-br-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Action Buttons with enhanced effects */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8 fade-in-up-delay-2">
            <div className="relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-30 hover:opacity-50 transition duration-300 blur"></div>
              <div className="relative">
                <LoginModal />
              </div>
            </div>

            <div className="relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl opacity-30 hover:opacity-50 transition duration-300 blur"></div>
              <div className="relative">
                <SignupModal />
              </div>
            </div>
          </div>
          {/* Medical Stats/Features with gradient cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-5xl mx-auto fade-in-up-delay-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-30 group-hover:opacity-50 transition duration-300 blur"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-500/30 transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Secure</h3>
                <p className="text-emerald-200 text-sm">HIPAA compliant healthcare data protection</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl opacity-30 group-hover:opacity-50 transition duration-300 blur"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center border border-teal-500/30 transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ animationDelay: '0.5s' }}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Connected</h3>
                <p className="text-teal-200 text-sm">Seamless communication across care teams</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-30 group-hover:opacity-50 transition duration-300 blur"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-500/30 transform hover:scale-105 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ animationDelay: '1s' }}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Efficient</h3>
                <p className="text-emerald-200 text-sm">Streamlined workflows for better outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced floating particles with animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '2s' }}></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-gradient-to-r from-teal-300 to-emerald-300 rounded-full opacity-70 animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full opacity-80 animate-ping" style={{ animationDelay: '1.5s', animationDuration: '2s' }}></div>
      </div>
    </section>
  );
};

export default HeroSection;