import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ role = "mr", active = "Dashboard", children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar 
        role={role} 
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <main style={{
        flex: 1,
        marginLeft: isSidebarOpen ? "260px" : "70px",
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
        background: "#f5f7fa",
      }}>
        <Header 
          role={role} 
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isMobile={isMobile}
        />
        <section className="content" style={{ padding: "20px" }}>
          {children}
        </section>
      </main>

      {isMobile && isSidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}