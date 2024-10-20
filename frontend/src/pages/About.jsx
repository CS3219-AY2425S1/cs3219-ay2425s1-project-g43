import React from "react";
import Navbar from "../components/Navbar";

const developers = [
  {
    imgSrc: "https://avatar.iran.liara.run/public/boy?username=Adhitya",
    name: "Adhitya Gopalakrishnan",
    title: "Backend Developer",
  },
  {
    imgSrc: "https://avatar.iran.liara.run/public/boy?username=Darren",
    name: "Darren Sim",
    title: "Backend Developer",
  },
  {
    imgSrc: "https://avatar.iran.liara.run/public/boy?username=Jay",
    name: "Junhu Song",
    title: "Frontend Developer",
  },
  {
    imgSrc: "https://avatar.iran.liara.run/public/boy?username=Ravi",
    name: "Ravi Kishore",
    title: "Backend Developer",
  },
  {
    imgSrc: "https://avatar.iran.liara.run/public/boy?username=Ujjwal",
    name: "Ujjwal Gaurav",
    title: "Product Designer, Frontend Developer",
  },
];

const DeveloperCard = ({ imgSrc, name, title }) => (
  <div className="flex h-full flex-col items-center rounded-3xl border border-lime-300/20 bg-gradient-to-br from-black to-lime-950 p-6 shadow-lg shadow-lime-300/10">
    <div className="relative mb-4 h-32 w-32 md:h-40 md:w-40">
      <img
        src={imgSrc}
        alt={name}
        className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform rounded-full border-4 border-lime-300 object-cover drop-shadow-[0_0_10px_rgba(132,204,22,0.5)]"
      />
    </div>
    <h2 className="mb-2 bg-gradient-to-r from-lime-300 to-lime-50 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
      {name}
    </h2>
    <p className="text-sm text-lime-100/80 md:text-base">{title}</p>
  </div>
);

const About = () => {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="relative m-4 h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-lime-300/20 px-8">
          <div className="h-full w-full overflow-auto bg-black p-7 text-white">
            {/* About Section */}
            <div className="flex flex-col items-center py-8">
              <h1 className="mb-4 bg-gradient-to-r from-lime-400 to-lime-200 bg-clip-text text-5xl font-extrabold text-transparent">
                About PeerPrep
              </h1>
              <p className="mb-12 max-w-3xl text-center text-lg text-lime-100">
                PeerPrep is a collaborative platform that connects users to
                prepare for technical interviews through real-time coding
                challenges. It allows users to match with peers, write code
                together, share knowledge, and enhance their problem-solving
                skills in a friendly environment.
              </p>

              <h2 className="mb-8 bg-gradient-to-r from-lime-400 to-lime-200 bg-clip-text text-3xl font-bold text-transparent">
                Meet Our Developers
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {developers.map((dev, index) => (
                  <DeveloperCard
                    key={index}
                    imgSrc={dev.imgSrc}
                    name={dev.name}
                    title={dev.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
