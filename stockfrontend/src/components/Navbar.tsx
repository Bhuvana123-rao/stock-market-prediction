import { Bell, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-[#F5F7FA] border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3A8]"
        />

        <input
          type="text"
          placeholder="Search stocks..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1F7A63]"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-gray-200 transition">
          <Bell size={20} className="text-[#081C2D]" />

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1F7A63] rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#081C2D] flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#081C2D]">
              Bhuvana
            </p>
            <p className="text-xs text-[#9AA3A8]">
              Data Science Student
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}