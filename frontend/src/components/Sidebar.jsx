
import {
  Home,
  Activity,
  MessageSquare,
  Calendar,
  Bell,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { icon: Home, active: true },
    { icon: Activity },
    { icon: MessageSquare },
    { icon: Calendar },
    { icon: Bell },
    { icon: Settings },
  ];

  return (
    <aside className="flex w-20 flex-col items-center space-y-8 border border-y-0 border-l-0 border-gray-300/20 py-8">
      <div className="mb-8"></div>
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`rounded-lg p-3 ${
            item.active
              ? "bg-[#bcfe4d] text-black"
              : "text-gray-400 hover:bg-gray-500/30 hover:text-white"
          }`}
        >
          <item.icon size={24} />
        </button>
      ))}
    </aside>
  );
}
