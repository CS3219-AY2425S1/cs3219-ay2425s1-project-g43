import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Settings, LogOut, HelpCircle } from "lucide-react";
import LogoutModal from "../components/LogoutModal"; 

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const menuItems = [
    { icon: Home, label: "Home", href: "/dashboard" },
    { icon: Users, label: "Matching Service", href: "/matching-service" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
  ];

  const handleItemClick = (href) => {
    setActiveItem(href);
    navigate(href);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("jwtToken");
    setIsModalOpen(false);
    navigate("/login");
  };

  return (
    <aside className="z-50 flex w-20 flex-col items-center bg-transparent py-12 pl-4">
      <div className="">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.href}>
            <button
              onClick={() => handleItemClick(item.href)}
              className={`mb-8 rounded-lg p-3 transition-colors duration-200 ${
                activeItem === item.href
                  ? "bg-[#c6fe4c] text-black"
                  : "text-slate-300/70 hover:bg-gray-100 hover:text-black"
              }`}
              aria-label={item.label}
            >
              <item.icon size={24} />
            </button>
          </Link>
        ))}

        {/* Logout Icon */}
        <button
          onClick={handleLogoutClick}
          className="rounded-lg p-3 text-slate-300/70 transition-colors duration-200 hover:bg-gray-100 hover:text-black"
          aria-label="Logout"
        >
          <LogOut size={24} />
        </button>

        <LogoutModal
          isOpen={isModalOpen}
          handleLogout={handleLogoutConfirm}
          handleClose={() => setIsModalOpen(false)}
        />
      </div>
    </aside>
  );
}
