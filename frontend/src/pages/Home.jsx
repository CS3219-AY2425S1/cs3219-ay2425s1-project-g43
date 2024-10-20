const Home = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative m-4 h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-3xl px-8">
        <img
          src="/images/guns-unsplash.jpg"
          alt="main image"
          className="absolute left-0 top-0 h-full w-full rounded-3xl object-cover"
        />
        <h1 className="absolute left-0 right-0 top-[17rem] flex items-center justify-center text-9xl font-semibold text-white">
          PeerPrep
        </h1>
      </div>
    </div>
  );
};

export default Home;
