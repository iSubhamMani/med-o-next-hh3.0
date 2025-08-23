import { Info, MessageCircle, Search, Tent, UserStar } from "lucide-react";

const features = [
  {
    icon: <Search className="h-10 w-10 text-green-400" />,
    title: "Med-o-Lens",
    description:
      "Get AI powered insights on prescriptions written by doctors, ensuring accuracy and clarity.",
  },
  {
    icon: <MessageCircle className="h-10 w-10 text-green-400" />,
    title: "Med-o-Consult",
    description:
      "Engage in real-time conversations with health professionals for immediate assistance and advice.",
  },
  {
    icon: <UserStar className="h-10 w-10 text-green-400" />,
    title: "Med-o-Coach",
    description:
      "Empower patients with personalized health coaching, tailored to their unique needs and conditions.",
  },
  {
    icon: <Info className="h-10 w-10 text-green-400" />,
    title: "Med-o-Report",
    description:
      "Report cases of illness and share insights with healthcare providers, enhancing collaborative care.",
  },
  {
    icon: <Tent className="h-10 w-10 text-green-400" />,
    title: "Med-o-Track",
    description:
      "Track various health camps and events, ensuring community access to essential healthcare services.",
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
          Powerful Features for Smarter Healthcare
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 w-full max-w-sm"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
