import { useState } from "react";
import { LogOut, UserCircle } from "lucide-react";
import type { User } from "../auth/AuthContext";
import logo from "../assets/logo.svg";

type NavbarProps = {
  userInfo: User | null;
  logout: () => void;
};

export default function SleekNavbar({ userInfo, logout }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const IMAGE_BASE_URL = "https://d1wh1xji6f82aw.cloudfront.net/";

  return (
    <nav className="bg-teal-400 shadow-md sticky top-0 z-50 ">
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        {/* Logo or Title */}
        <div className="">
          <img src={logo} alt="avatar" className="object-cover h-16 " />
        </div>

        {/* Right Section */}
        <div className="relative">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {/* userInfo Avatar with Online Dot */}
            <div className="relative">
              <img
                src={`${IMAGE_BASE_URL}${userInfo?.Avatar}`}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* userInfo Details */}
            <div className="hidden md:block text-right">
              <p className="text-base font-medium text-black">
                {userInfo?.FullName}
              </p>
              <p className="text-xs text-slate-800">
                {userInfo?.Role.Title} • {userInfo?.GiftingCountry.Name} (
                {userInfo?.Currency.Symbol})
              </p>
            </div>
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white border shadow-lg rounded-lg overflow-hidden transition-all duration-150 ease-in-out z-50">
              <a
                href="/profile"
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                My Profile
              </a>
              <button
                onClick={logout}
                className="flex w-full items-center px-4 py-3 text-sm text-red-500 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
