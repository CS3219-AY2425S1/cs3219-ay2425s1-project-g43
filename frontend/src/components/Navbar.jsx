import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getButtonClass = (path) => {
    return isActive(path)
      ? "rounded-full bg-white px-8 py-2 text-black border border-white"
      : "rounded-full border border-gray-300/30 px-8 py-2 text-white hover:border-white hover:bg-white hover:text-black";
  };

  return (
    <nav className="mt-6 flex items-center justify-between px-8">
      <div className="flex space-x-2">
        {/* Logo */}
        <div className="ml-2 mr-3 flex items-center">
          <img src="/images/8bit-star-1.png" alt="logo" className="h-8 w-8" />
        </div>
        <Link to="/">
          <button className={getButtonClass("/")}>HOME</button>
        </Link>
        <Link to="/about">
          <button className={getButtonClass("/about")}>ABOUT</button>
        </Link>
        <Link to="/features">
          <button className={getButtonClass("/features")}>FEATURES</button>
        </Link>
      </div>

      {/* Login and Register Buttons */}
      <div className="flex space-x-2">
        <Link to="/login">
          <button className="rounded-full bg-white px-8 py-2 text-black hover:transform hover:bg-gradient-to-r hover:from-white hover:to-cyan-400 hover:transition-colors hover:ease-linear">
            LOGIN
          </button>
        </Link>
        <Link to="/register">
          <button className="rounded-full border border-transparent bg-[#C6FF46] px-8 py-2 font-medium text-black hover:transform hover:bg-gradient-to-r hover:from-white hover:to-lime-400 hover:transition-colors hover:ease-linear">
            REGISTER
          </button>
        </Link>
      </div>
    </nav>
  );
}
