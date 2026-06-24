import React, { useState } from "react";
import {
  Menu,
  MapPin,
  Bell,
  ChevronDown,
  X,
  User,
  LogOut,
  ArrowLeft, // ✅ Added
} from "lucide-react";
import { Avatar } from "./UIComponents";
import { useNavigate } from "react-router-dom";

export default function Header({ 
  role = "mr", 
  onMenuClick,
  isSidebarOpen = true,
  isMobile = false,
}) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user?.mrName || user?.flmName || user?.slmName || user?.tlmName || "User";
  const designation = user?.role === "mr" ? "MR" : user?.role === "flm" ? "FLM" : user?.role === "slm" ? "SLM" : user?.role === "tlm" ? "TLM" : "Manager";
  const loc = user?.hq || "Mumbai West (Area)";

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate("/profile-edit");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back one step
  };

  return (
    <header className="topbar">
      {/* Menu Toggle */}
      <button
        onClick={onMenuClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          color: "#374151",
        }}
      >
        {isMobile && isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ✅ Back Button */}
      <button
        onClick={handleGoBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          color: "#374151",
        }}
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="spacer" />

      <div className="location">
        <MapPin size={18} />
        {loc}
      </div>

      <div className="bell">
        <Bell />
        <span>
          {role === "ho" ? 18 : role === "manager" ? 12 : 8}
        </span>
      </div>

      <div 
        onClick={() => setIsProfileOpen(!isProfileOpen)} 
        style={{ 
          cursor: "pointer", 
          display: "flex", 
          alignItems: "center", 
          gap: "8px",
          position: "relative",
        }}
      >
        <Avatar name={name} role={designation} />
        <ChevronDown size={18} />
      </div>

      {isProfileOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: "8px",
            minWidth: "180px",
            zIndex: 200,
          }}
        >
          <div
            onClick={handleProfileClick}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <User size={16} />
            Edit Profile
          </div>
          <div
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={16} />
            Logout
          </div>
        </div>
      )}
    </header>
  );
}