import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Send,
  CheckCircle2,
  Camera,
  CalendarDays,
  Hand,
  BarChart3,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import Layout from "../components/Layout";
import {
  StatCard,
  Panel,
  ListLine,
  DoctorActivity,
  Crumbs,
  Badge,
} from "../components/UIComponents";
import { useEffect, useState } from "react";
import { getDashboardData } from "../api/doctorAPI";

function QuickActions({ onNavigate }) {
  const actions = [
    { name: "Add Doctor", icon: UserPlus, path: "/add-doctor" },
    { name: "Approved Doctors", icon: CheckCircle2, path: "/approved-doctors" },
    { name: "Consent Pending", icon: Send, path: "/submitted-doctors?status=consent-pending" },
    { name: "Calendar Selection", icon: CalendarDays, path: "/calendar-selection" },
    { name: "Input Given", icon: Hand, path: "/input-given" },
    { name: "My Reports", icon: BarChart3, path: "/manager-dashboard" },
  ];

  return (
    <div className="quick">
      {actions.map(({ name, icon: Icon, path }) => (
        <div 
          key={name} 
          onClick={() => onNavigate && onNavigate(path)} 
          style={{ cursor: 'pointer' }}
        >
          <Icon />
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}

const MRDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    draftCount: 0,
    submittedCount: 0,
    approvedCount: 0,
    consentPendingCount: 0,
    photoPendingCount: 0,
    calendarFrozenCount: 0,
    inputGivenPendingCount: 0,
    calendarDeliveredCount: 0,
    sendConsentCount: 0,
    uploadPhotoCount: 0,
    calendarSelectionCount: 0,
    inputGivenCount: 0,
    frozenDoctors: [],
    recentDoctors: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user data safely
  const getUserData = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.log("No user data found in localStorage");
        return null;
      }
      const userData = JSON.parse(userString);
      console.log("User data from localStorage:", userData);
      return userData;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };
  
  const userData = getUserData();
  const mrname = userData?.mrName || userData?.name || "User";
  
  // Get MR ID - try multiple sources
  let mrId = null;
  
  if (userData) {
    // Priority order: mrId (string like E89565) > _id (ObjectId)
    mrId = userData.mrId || userData._id;
  }
  
  // If still no mrId, try session storage
  if (!mrId) {
    mrId = sessionStorage.getItem("mrId");
  }
  
  console.log("Final MR ID used:", mrId);
  console.log("User role:", userData?.role);

  useEffect(() => {
    const fetchDashboard = async () => {
      console.log("Fetching dashboard data for MR:", mrId);
      
      if (!mrId) {
        console.error("No MR ID found");
        setError("User not properly authenticated. Please login again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await getDashboardData(mrId);
        console.log("API Response:", response);
        
        let data = response;
        if (response.data && response.success) {
          data = response.data;
        } else if (response.data) {
          data = response.data;
        }
        
        setDashboardData({
          draftCount: data.draftCount || 0,
          submittedCount: data.submittedCount || 0,
          approvedCount: data.approvedCount || 0,
          consentPendingCount: data.consentPendingCount || 0,
          photoPendingCount: data.photoPendingCount || 0,
          calendarFrozenCount: data.calendarFrozenCount || 0,
          inputGivenPendingCount: data.inputGivenPendingCount || 0,
          calendarDeliveredCount: data.calendarDeliveredCount || 0,
          sendConsentCount: data.sendConsentCount || 0,
          uploadPhotoCount: data.uploadPhotoCount || 0,
          calendarSelectionCount: data.calendarSelectionCount || 0,
          inputGivenCount: data.inputGivenCount || 0,
          frozenDoctors: data.frozenDoctors || [],
          recentDoctors: data.recentDoctors || []
        });
        
      } catch (error) {
        console.error("API Error:", error);
        
        // If 404, user might not exist or session expired
        if (error.response?.status === 404) {
          setError("Session expired or user not found. Please login again.");
          // Clear invalid data after showing error
          setTimeout(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            sessionStorage.clear();
            navigate("/");
          }, 3000);
        } else {
          setError(error.response?.data?.message || error.message || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (mrId) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [mrId, navigate]);

  // Navigation handlers
  const handleNavigate = (path, state = {}) => {
    navigate(path, { state });
  };

  const handleStatClick = (title, count) => {
    if (count === 0) {
      alert(`No ${title.toLowerCase()} found`);
      return;
    }
    
    switch(title) {
      case "Draft Doctors":
        navigate("/draft-doctors");
        break;
      case "Submitted Doctors":
        navigate("/submitted-doctors");
        break;
      case "Approved Doctors":
        navigate("/approved-doctors");
        break;
      case "Consent Pending":
        navigate("/approved-doctors?filter=consent-pending");
        break;
      case "Photo Pending":
        navigate("/approved-doctors?filter=photo-pending");
        break;
      case "Calendar Frozen":
        navigate("/calendar-finalized");
        break;
      case "Input Given Pending":
        navigate("/input-given");
        break;
      case "Calendar Delivered":
        navigate("/input-given?status=delivered");
        break;
      default:
        navigate("/my-doctors");
    }
  };

  const handlePendingAction = (action, count) => {
    if (count === 0) {
      alert(`No ${action.toLowerCase()} pending`);
      return;
    }
    
    switch(action) {
      case "Send Consent":
        navigate("/approved-doctors?filter=send-consent");
        break;
      case "Upload Doctor Photo":
        navigate("/approved-doctors?filter=upload-photo");
        break;
      case "Calendar Selection":
        navigate("/calendar-selection");
        break;
      case "Input Given":
        navigate("/input-given");
        break;
      default:
        navigate("/my-doctors");
    }
  };

  const handleViewAllRecent = () => {
    console.log("View All clicked - navigating to all doctors");
    navigate("/my-doctors");
  };

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor-details/${doctorId}`);
  };

  // Handle retry button click
  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <Layout active="Dashboard">
        <Crumbs />
        <div className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          fontSize: '18px',
          color: '#666'
        }}>
          <div>Loading dashboard data...</div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout active="Dashboard">
        <Crumbs />
        <div className="error-container" style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#fee',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h3 style={{ color: '#dc3545' }}>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Retry
          </button>
          <button 
            onClick={() => navigate("/")}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="Dashboard">
      <Crumbs />
      <h1>Welcome {mrname} 👋</h1>
      <p className="subtitle">Here's your campaign overview and next steps.</p>
      
      {/* Stats Cards Grid */}
      <div className="grid cards5">
        {[
          { title: "Draft Doctors", value: dashboardData.draftCount, icon: FileText, tone: "blue" },
          { title: "Submitted Doctors", value: dashboardData.submittedCount, icon: Send, tone: "purple" },
          { title: "Approved Doctors", value: dashboardData.approvedCount, icon: CheckCircle2, tone: "green" },
          { title: "Consent Pending", value: dashboardData.consentPendingCount, icon: Send, tone: "orange" },
          { title: "Photo Pending", value: dashboardData.photoPendingCount, icon: Camera, tone: "red" },
          { title: "Calendar Frozen", value: dashboardData.calendarFrozenCount, icon: CalendarDays, tone: "blue" },
          { title: "Input Given Pending", value: dashboardData.inputGivenPendingCount, icon: Hand, tone: "orange" },
          { title: "Calendar Delivered", value: dashboardData.calendarDeliveredCount, icon: CheckCircle2, tone: "green" },
        ].map((stat) => (
          <div 
            key={stat.title} 
            onClick={() => handleStatClick(stat.title, stat.value)}
            style={{ cursor: stat.value > 0 ? 'pointer' : 'not-allowed', opacity: stat.value === 0 ? 0.6 : 1 }}
          >
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              tone={stat.tone}
              sub="View all →"
            />
          </div>
        ))}
      </div>
      
      {/* Two Column Layout */}
      <div className="two">    
        <Panel title="Today's Pending Actions">
          {[
            { title: "Send Consent", icon: Send, sub: "Doctors waiting for consent email", value: dashboardData.sendConsentCount },
            { title: "Upload Doctor Photo", icon: Camera, sub: "Consent approved, photo pending", value: dashboardData.uploadPhotoCount },
            { title: "Calendar Selection", icon: CalendarDays, sub: "Photo uploaded, selection pending", value: dashboardData.calendarSelectionCount },
            { title: "Input Given", icon: Hand, sub: "Calendars ready to be handed over", value: dashboardData.inputGivenCount },
          ].map((action) => (
            <div 
              key={action.title}
              onClick={() => handlePendingAction(action.title, action.value)}
              style={{ cursor: action.value > 0 ? 'pointer' : 'not-allowed', opacity: action.value === 0 ? 0.6 : 1 }}
            >
              <ListLine
                icon={action.icon}
                title={action.title}
                sub={action.sub}
                value={action.value}
              />
            </div>
          ))}
        </Panel>
        
        {/* Recent Doctor Activities Panel */}
        <Panel 
          title="Recent Doctor Activities" 
          action={dashboardData.recentDoctors?.length > 0 ? "View all" : null}
          onActionClick={handleViewAllRecent}
        >
          {dashboardData.recentDoctors && dashboardData.recentDoctors.length > 0 ? (
            dashboardData.recentDoctors.map((doctor) => (
              <div 
                key={doctor._id}
                onClick={() => handleDoctorClick(doctor._id)}
                style={{ cursor: 'pointer' }}
              >
                <DoctorActivity doctor={doctor} />
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No recent doctor activities
            </div>
          )}
        </Panel>

        {/* Frozen Calendars Panel */}
        {dashboardData.frozenDoctors && dashboardData.frozenDoctors.length > 0 && (
          <Panel 
            title="❄️ Frozen Calendars" 
            action="View all" 
            onActionClick={() => navigate("/calendar-finalized")}
          >
            {dashboardData.frozenDoctors.map((doctor) => (
              <div 
                key={doctor._id}
                onClick={() => navigate(`/calendar-selection?doctorId=${doctor._id}&mrId=${mrId}`)}
                style={{ 
                  cursor: 'pointer', 
                  padding: '12px', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>{doctor.doctorName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{doctor.speciality} • MCL: {doctor.mclCode}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge tone="green">✓ Frozen</Badge>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {doctor.calendarFrozenAt ? new Date(doctor.calendarFrozenAt).toLocaleDateString() : 'Recently'}
                  </span>
                  <ArrowRight size={16} color="#999" />
                </div>
              </div>
            ))}
          </Panel>
        )}
      </div>
      
      <QuickActions onNavigate={handleNavigate} />
    </Layout>
  );
};

export default MRDashboard;