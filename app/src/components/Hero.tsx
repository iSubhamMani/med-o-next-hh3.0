import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/hero.png')`,
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <div className="text-2xl font-bold text-white">
          <p style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}>
            Med-o-Next
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-white">
          <a
            href="#hero"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            Home
          </a>
          <a
            href="#features"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            About Us
          </a>
        </div>
        <button className="cursor-pointer text-white px-6 py-3 flex items-center space-x-2 transition">
          <span>Get Started</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>

      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-5xl mx-auto px-6">
          {/* Heading */}
          <h1
            style={{ textShadow: "0 4px 16px rgba(0,0,0,0.7)" }}
            className="text-white text-5xl md:text-7xl font-extrabold mb-8 tracking-tight fade-in-up"
          >
            Empowering <span className="text-emerald-400">Patients</span>.{" "}
            <br />
            Enhancing <span className="text-emerald-400">Care</span>.
          </h1>

          {/* Subtext */}
          <p
            style={{ backdropFilter: "blur(16px)" }}
            className="bg-white/10 rounded-2xl px-6 py-5 shadow-2xl text-white text-lg md:text-2xl mb-12 opacity-95 fade-in-up-delay-1 max-w-2xl mx-auto leading-relaxed"
          >
            Unifying patients, healthcare providers, and caregivers in a{" "}
            <span className="font-semibold text-emerald-200">
              single, intuitive system
            </span>{" "}
            designed to simplify the complexities of modern care.
          </p>

          {/* Buttons */}
          <div className="fade-in-up-delay-2 flex flex-wrap gap-6 justify-center">
            <LoginModal />
            <SignupModal />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
