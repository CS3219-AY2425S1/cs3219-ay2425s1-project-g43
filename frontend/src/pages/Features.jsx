import Navbar from "../components/Navbar";
import { Users, Shield, Zap, LineChart, Brain, Wifi } from "lucide-react";

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  secondaryIcon: SecondaryIcon,
}) => (
  <div className="flex h-full flex-col rounded-3xl border border-lime-300/20 bg-gradient-to-br from-black to-lime-950 p-6 shadow-lg shadow-lime-300/10">
    <div className="relative mb-4 flex flex-grow items-center justify-center">
      <div className="relative h-32 w-32 bg-gradient-to-br to-lime-300/10 rounded-xl md:h-52 md:w-52">
        <div className="absolute inset-0 rounded-2xl"></div>
        <Icon className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform text-lime-300 drop-shadow-[0_0_10px_rgba(132,204,22,0.5)] md:h-24 md:w-24" />
        {SecondaryIcon && (
          <div className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 p-2 shadow-lg">
            <SecondaryIcon className="h-6 w-6 text-black md:h-8 md:w-8" />
          </div>
        )}
      </div>
    </div>
    <h2 className="mb-3 bg-gradient-to-r from-lime-400 to-white bg-clip-text text-xl font-bold text-transparent md:text-3xl">
      {title}
    </h2>
    <p className="text-xs text-lime-100 md:text-sm">{description}</p>
  </div>
);

const Features = () => {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="relative m-4 h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-lime-300/20 px-8">
          <div className="h-full w-full overflow-auto bg-black p-6 text-white">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="flex space-x-6">
                <FeatureCard
                  title="Flexible Peer Matching"
                  description="PeerPrep gives you the freedom to find the perfect study partner based on your preferences and needs."
                  icon={Users}
                />

                <FeatureCard
                  title="Real-time Progress Tracking"
                  description="Monitor your improvement and get insights into your coding performance in real-time."
                  icon={LineChart}
                  secondaryIcon={Wifi}
                />
              </div>
              <div className="flex space-x-6">
                <FeatureCard
                  title="Unlimited Learning Potential"
                  description="Access a wide range of coding challenges and interview prep materials to boost your skills."
                  icon={Brain}
                />
                <FeatureCard
                  title="Secure Collaboration"
                  description="Enjoy a safe coding environment with built-in security features to protect your work and discussions."
                  icon={Shield}
                  secondaryIcon={Zap}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
