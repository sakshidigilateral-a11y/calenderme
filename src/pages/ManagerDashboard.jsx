import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFLMDashboard,
  getSLMDashboard,
  getTLMDashboard,
} from "../api/managerAPI";

import {
  Users,
  UserPlus,
  CheckCircle2,
  CalendarDays,
  Clock3,
  XCircle,
  Hand,
  RefreshCw,
} from "lucide-react";
import Layout from "../components/Layout";
import {
  StatCard,
  Panel,
  ListLine,
  ManagerActivity,
  DataTable,
  Badge,
  Button,
  Crumbs,
} from "../components/UIComponents";

// Funnel Panel Component
function FunnelPanel({ funnel }) {
  const palette = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  const data = [
    { name: "Registered", v: funnel?.registered || 0 },
    { name: "Approved", v: funnel?.approved || 0 },
    { name: "Input Given", v: funnel?.inputGiven || 0 },
    { name: "Calendar Frozen", v: funnel?.frozen || 0 },
    { name: "Rejected", v: funnel?.rejected || 0 },
  ];

  const conversionRate =
    funnel?.registered > 0
      ? Math.round(((funnel.inputGiven || 0) / funnel.registered) * 100)
      : 0;

  return (
    <Panel title="Campaign Progress Overview">
      <div
        className="funnel"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {data.map((d, i) => (
          <div
            key={d.name}
            style={{
              width: `calc(${Math.max(20, 100 - i * 13)}% - 16px)`,
              maxWidth: "100%",
              boxSizing: "border-box",
              background: palette[i],
              display: "flex",
              padding: "8px 12px",
              marginBottom: "4px",
              borderRadius: "4px",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              <span>{d.name}</span>
              <strong>{d.v}</strong>
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: "16px", textAlign: "center" }}>
        Conversion Rate (Registered to Input Given){" "}
        <strong style={{ color: "#3b82f6" }}>{conversionRate}%</strong>
      </p>
    </Panel>
  );
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const user = JSON.parse(localStorage.getItem("user"));

      let data;
      if (user.role === "flm") {
        data = await getFLMDashboard(user.flmId);
      } else if (user.role === "slm") {
        data = await getSLMDashboard(user.slmId);
      } else if (user.role === "tlm") {
        data = await getTLMDashboard(user.tlmId);
      }

      console.log("Dashboard data:", data);
      console.log("Recent Activities:", data?.recentActivities);
      setDashboard(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    fetchDashboard();
  };

  const handleViewAllMRs = () => {
    navigate("/manager/mr-progress");
  };

  const handleViewPendingApprovals = () => {
    navigate("/manager/approvals");
  };

  const handleViewDoctor = (doctorId) => {
    navigate(`/doctor-details/${doctorId}`);
  };

  const handleViewAllActivities = () => {
    navigate("/manager/activity-log");
  };

  if (loading) {
    return (
      <Layout role="manager" active="Dashboard">
        <Crumbs items={["Dashboard"]} />
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading dashboard data...
        </div>
      </Layout>
    );
  }

  if (!dashboard) {
    return (
      <Layout role="manager" active="Dashboard">
        <Crumbs items={["Dashboard"]} />
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          <h3>Failed to load dashboard data</h3>
          <Button onClick={handleRefresh} variant="primary">
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const managerName =
    user?.flmName || user?.slmName || user?.tlmName || "Manager";

  return (
    <Layout role="manager" active="Dashboard">
      <Crumbs items={["Dashboard"]} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1>Manager Dashboard</h1>
          <p className="subtitle">
            Welcome back, {managerName}! Here's an overview of your team's
            campaign progress.
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={17} /> {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="cards6">
        <StatCard
          title="Total MRs"
          value={dashboard.totalMRs || 0}
          icon={Users}
          tone="purple"
          sub="View All →"
          onClick={handleViewAllMRs}
        />
        <StatCard
          title="Total Doctors"
          value={dashboard.totalDoctors || 0}
          icon={UserPlus}
          tone="blue"
          sub="Total registered"
        />
        <StatCard
          title="Approved Doctors"
          value={dashboard.approvedDoctors || 0}
          icon={CheckCircle2}
          tone="green"
          sub={`${dashboard.funnel?.approved || 0} approved`}
        />
        <StatCard
          title="Input Given"
          value={dashboard.inputGiven || 0}
          icon={CalendarDays}
          tone="orange"
          sub="Completed input"
        />
        <StatCard
          title="Pending Actions"
          value={dashboard.pendingActions || 0}
          icon={Clock3}
          tone="orange"
          sub="Need attention"
          onClick={handleViewPendingApprovals}
        />
        <StatCard
          title="Rejected Doctors"
          value={dashboard.rejectedDoctors || 0}
          icon={XCircle}
          tone="red"
          sub="Rejected"
        />
      </div>

      {/* Two Column Layout with overflow fix */}
      <div
        className="two"
        style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}
      >
        <div
          style={{
            flex: 1,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <FunnelPanel funnel={dashboard.funnel} />
        </div>

        <div style={{ flex: 1, minWidth: "300px", overflow: "hidden" }}>
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            <Panel
              title="MR-wise Performance"
              action="View All"
              onActionClick={handleViewAllMRs}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <table style={{ width: "100%", minWidth: "500px" }}>
                  <thead>
                    <tr
                      style={{
                        background: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <th style={{ padding: "12px", textAlign: "left" }}>
                        MR Name
                      </th>
                      <th style={{ padding: "12px", textAlign: "left" }}>
                        Total Doctors
                      </th>
                      <th style={{ padding: "12px", textAlign: "left" }}>
                        Approved (%)
                      </th>
                      <th style={{ padding: "12px", textAlign: "left" }}>
                        Input Given (%)
                      </th>
                      <th style={{ padding: "12px", textAlign: "left" }}>
                        Pending
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.mrPerformance?.map((mr, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "12px" }}>{mr.mrName}</td>
                        <td style={{ padding: "12px" }}>
                          {mr.totalDoctors || 0}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {mr.approvedDoctors || 0} (
                          {mr.approvedPercentage || 0}
                          %)
                        </td>
                        <td style={{ padding: "12px" }}>
                          {mr.inputGivenDoctors || 0} (
                          {mr.inputGivenPercentage || 0}%)
                        </td>
                        <td style={{ padding: "12px" }}>
                          <Badge tone="red">{mr.pendingDoctors || 0}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* Pending Actions and Recent Activity - Dynamic based on API */}
      <div
        className="two"
        style={{
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          marginTop: "24px",
        }}
      >
        <div style={{ flex: 1, minWidth: "300px", overflow: "hidden" }}>
          <Panel title="Pending Actions (Requires Your Attention)">
            <ListLine
              icon={Clock3}
              title="Doctors awaiting approval"
              sub="Doctors submitted by MRs pending your approval"
              value={dashboard.pendingApprovals || 0}
              onClick={handleViewPendingApprovals}
              clickable={(dashboard.pendingApprovals || 0) > 0}
            />
            <ListLine
              icon={CalendarDays}
              title="Calendars pending freeze"
              sub="Calendar design selected but not yet frozen by MR"
              value={dashboard.pendingFreeze || 0}
              onClick={() => navigate("/manager/calendar-designs")}
              clickable={(dashboard.pendingFreeze || 0) > 0}
            />
            <ListLine
              icon={Hand}
              title="Input given pending"
              sub="Frozen calendars not yet marked as input given"
              value={dashboard.inputGivenPending || 0}
              onClick={() => navigate("/input-given")}
              clickable={(dashboard.inputGivenPending || 0) > 0}
            />
          </Panel>
        </div>

        <div style={{ flex: 1, minWidth: "300px", overflow: "hidden" }}>
          <Panel
            title="Recent Activity"
            action="View All"
            onActionClick={handleViewAllActivities}
          >
            {dashboard.recentActivities &&
            dashboard.recentActivities.length > 0 ? (
              dashboard.recentActivities.map((activity, index) => {
                // Handle different activity structures
                let title = "Activity performed";
                let status = "Completed";
                let time = activity.createdAt || new Date();

                if (activity.action) {
                  title = activity.action;
                }

                if (activity.doctor && activity.doctor.doctorName) {
                  title = `${activity.doctor.doctorName} - ${activity.action || "Activity"}`;
                }

                if (activity.description) {
                  title = activity.description;
                }

                if (activity.status) {
                  status = activity.status;
                }

                return (
                  <ManagerActivity
                    key={activity._id || index}
                    title={title}
                    status={status}
                    time={time}
                  />
                );
              })
            ) : (
              <div
                style={{ textAlign: "center", padding: "40px", color: "#999" }}
              >
                No recent activities
              </div>
            )}
          </Panel>
        </div>
      </div>

      {/* Recent Doctors Section */}
      {dashboard.recentDoctors && dashboard.recentDoctors.length > 0 && (
        <Panel title="Recently Added Doctors" action="View All">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {dashboard.recentDoctors.map((doctor) => (
              <div
                key={doctor._id}
                style={{
                  padding: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() => handleViewDoctor(doctor._id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 4px 0" }}>{doctor.doctorName}</h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                      {doctor.speciality}
                    </p>
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      Added: {new Date(doctor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    tone={
                      doctor.approvalStatus === "approved" ? "green" : "orange"
                    }
                  >
                    {doctor.approvalStatus === "approved"
                      ? "Approved"
                      : "Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </Layout>
  );
}
