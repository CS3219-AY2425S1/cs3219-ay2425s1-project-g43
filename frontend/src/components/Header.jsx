const Header = ({ name, username }) => {
  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between px-6 py-4">
      <div className="flex flex-row space-x-6">
        <img
          src="/images/8bit-star-1.png"
          alt="PeerPrep logo"
          className="h-10 w-10"
        />
        <h1 className="text-center text-4xl font-semibold tracking-wider text-white">
          PeerPrep
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <h1 className="font-semibold tracking-wide">{name}</h1>
          <h3 className="text-right text-xs text-gray-300/70">@{username}</h3>
        </div>
        <button className="flex flex-row items-center rounded-full border border-dashed border-gray-300 p-1">
          <img
            src={`https://avatar.iran.liara.run/public/boy?username=${name}`}
            alt="PeerPrep logo"
            className="h-9 w-9 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
