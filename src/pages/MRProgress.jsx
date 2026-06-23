// pages/MRProgress.jsx
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, CheckCircle2, CalendarDays, Clock3, Filter, Eye, Info, RefreshCw, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";
import { StatCard, Badge, Button, SelectBox, DataTable, Crumbs, ProgressBar } from "../components/UIComponents";
import { getFLMDashboard, getSLMDashboard, getTLMDashboard, getPendingApprovals } from "../api/managerAPI";

// ─── MR Progress Component ────────────────────────────────
export function MRProgress() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
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
      
      setDashboard(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleViewMR = (mrName) => {
    navigate(`/manager/mr-details?mr=${encodeURIComponent(mrName)}`);
  };

  if (loading) {
    return (
      <Layout role="manager" active="Reports">
        <Crumbs items={["Reports", "MR-wise Progress"]} />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading MR progress data...</div>
      </Layout>
    );
  }

  if (!dashboard) {
    return (
      <Layout role="manager" active="Reports">
        <Crumbs items={["Reports", "MR-wise Progress"]} />
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h3>Failed to load data</h3>
          <Button onClick={handleRefresh} variant="primary">Retry</Button>
        </div>
      </Layout>
    );
  }

  const totalDoctors = dashboard.totalDoctors || 0;
  const approvedDoctors = dashboard.approvedDoctors || 0;
  const inputGiven = dashboard.inputGiven || 0;
  const pendingActions = dashboard.pendingActions || 0;
  const totalMRs = dashboard.totalMRs || 0;

  return (
    <Layout role="manager" active="Reports">
      <Crumbs items={["Reports", "MR-wise Progress"]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>MR-wise Progress</h1>
          <p className="subtitle">Track progress of your team members for this campaign.</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={17} /> {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      
      <div className="grid cards5">
        <StatCard title="Total MRs" value={totalMRs} icon={Users} tone="purple" />
        <StatCard title="Doctors Registered" value={totalDoctors} icon={UserPlus} tone="blue" />
        <StatCard title="Approved Doctors" value={approvedDoctors} icon={CheckCircle2} tone="green" />
        <StatCard title="Input Given" value={inputGiven} icon={CalendarDays} tone="orange" />
        <StatCard title="Pending Actions" value={pendingActions} icon={Clock3} tone="orange" />
      </div>
      
      <DataTable
        headers={[
          "#", 
          "MR Name", 
          "Doctors Registered", 
          "Approved Doctors (%)", 
          "Input Given (%)", 
          "Pending Actions", 
          "Last Activity", 
          "Action"
        ]}
        rows={dashboard.mrPerformance?.map((mr, i) => {
          const total = mr.totalDoctors || 0;
          const approved = mr.approvedDoctors || 0;
          const inputGivenMR = mr.inputGivenDoctors || 0;
          const approvedPercent = mr.approvedPercentage || 0;
          const inputPercent = mr.inputGivenPercentage || 0;
          const pending = mr.pendingDoctors || 0;
          
          return [
            i + 1,
            mr.mrName,
            total,
            <div key={`approved-${i}`}>
              <span>{approved} ({approvedPercent}%)</span>
              <ProgressBar value={approvedPercent} />
            </div>,
            <div key={`input-${i}`}>
              <span>{inputGivenMR} ({inputPercent}%)</span>
              <ProgressBar value={inputPercent} tone="orange" />
            </div>,
            <Badge tone={pending > 5 ? "red" : "orange"}>{pending}</Badge>,
            mr.lastActivity || new Date().toLocaleDateString(),
            <Button 
              variant="ghost" 
              icon={Eye} 
              onClick={() => handleViewMR(mr.mrName)}
            >
              View
            </Button>,
          ];
        }) || []}
      />
    </Layout>
  );
}

// ─── Delay Report Component ────────────────────────────────
export function DelayReport({ role = "manager" }) {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOverdue, setSelectedOverdue] = useState("all");

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const user = JSON.parse(localStorage.getItem("user"));
      
      let data;
      if (role === "manager") {
        if (user.role === "flm") {
          data = await getPendingApprovals(user.flmId);
        } else if (user.role === "slm") {
          data = await getSLMDoctors(user.slmId);
        } else if (user.role === "tlm") {
          data = await getTLMDoctors(user.tlmId);
        }
      }
      
      const doctorsList = data?.doctors || [];
      setDoctors(doctorsList);
      setFilteredData(doctorsList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  useEffect(() => {
    let filtered = [...doctors];
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(d => d.approvalStatus === selectedStatus);
    }
    
    if (selectedOverdue !== "all") {
      const now = new Date();
      filtered = filtered.filter(d => {
        const daysPending = Math.floor((now - new Date(d.createdAt)) / (1000 * 60 * 60 * 24));
        if (selectedOverdue === "overdue") return daysPending > 7;
        if (selectedOverdue === "delayed") return daysPending > 3 && daysPending <= 7;
        if (selectedOverdue === "normal") return daysPending <= 3;
        return true;
      });
    }
    
    setFilteredData(filtered);
  }, [selectedStatus, selectedOverdue, doctors]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedOverdue("all");
  };

  const handleViewDoctor = (doctorId) => {
    navigate(`/doctor-details/${doctorId}`);
  };

  // Calculate stats
  const totalPending = filteredData.length;
  const overdueActions = filteredData.filter(d => {
    const days = Math.floor((new Date() - new Date(d.createdAt)) / (1000 * 60 * 60 * 24));
    return days > 7;
  }).length;
  const delayedActions = filteredData.filter(d => {
    const days = Math.floor((new Date() - new Date(d.createdAt)) / (1000 * 60 * 60 * 24));
    return days > 3 && days <= 7;
  }).length;
  
  const avgDelay = filteredData.length > 0 
    ? Math.round(filteredData.reduce((sum, d) => {
        const days = Math.floor((new Date() - new Date(d.createdAt)) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / filteredData.length)
    : 0;

  if (loading) {
    return (
      <Layout role={role} active={role === "manager" ? "Pending Actions" : "Reports"}>
        <Crumbs items={["Reports", role === "manager" ? "Team Delay / Pending Action" : "Pending Action Report"]} />
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading delay report...</div>
      </Layout>
    );
  }

  return (
    <Layout role={role} active={role === "manager" ? "Pending Actions" : "Reports"}>
      <Crumbs items={["Reports", role === "manager" ? "Team Delay / Pending Action" : "Pending Action Report"]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>{role === "manager" ? "Team Delay / Pending Action Report" : "Pending Action Report"}</h1>
          <p className="subtitle">
            Track pending actions and delays for {role === "manager" ? "your team members" : "each level to ensure timely approvals"}.
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw size={17} /> {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      
      <div className="grid cards5">
        <StatCard 
          title={role === "manager" ? "Pending Approvals" : "Total Pending"} 
          value={totalPending} 
          icon={Clock3} 
          tone="red" 
        />
        <StatCard 
          title="Overdue Actions (>7 days)" 
          value={overdueActions} 
          icon={AlertCircle} 
          tone="orange" 
        />
        <StatCard 
          title="Delayed Actions (3-7 days)" 
          value={delayedActions} 
          icon={Clock3} 
          tone="warning" 
        />
        <StatCard 
          title="Normal Pending (<3 days)" 
          value={totalPending - overdueActions - delayedActions} 
          icon={CalendarDays} 
          tone="green" 
        />
        <StatCard 
          title="Avg. Delay (Days)" 
          value={`${avgDelay} Days`} 
          icon={Info} 
          tone="purple" 
        />
      </div>
      
      <div className="toolbar">
        <SelectBox 
          label="Status" 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
          ]}
        />
        <SelectBox 
          label="Overdue By"
          value={selectedOverdue}
          onChange={(e) => setSelectedOverdue(e.target.value)}
          options={[
            { value: "all", label: "All" },
            { value: "normal", label: "Normal (<3 days)" },
            { value: "delayed", label: "Delayed (3-7 days)" },
            { value: "overdue", label: "Overdue (>7 days)" },
          ]}
        />
        <Button variant="outline" icon={Filter} onClick={handleClearFilters}>
          Clear Filters
        </Button>
        <Button icon={Filter} onClick={() => fetchData()}>
          Apply Filters
        </Button>
      </div>
      
      <DataTable
        headers={[
          "#",
          "Doctor Name",
          "Speciality",
          "MCL Code",
          "Submitted By (MR)",
          "Submission Date",
          "Days Pending",
          "Status",
          "Action",
        ]}
        rows={filteredData.map((doctor, index) => {
          const daysPending = Math.floor((new Date() - new Date(doctor.createdAt)) / (1000 * 60 * 60 * 24));
          let statusText = "Pending";
          let statusTone = "orange";
          
          if (daysPending > 7) {
            statusText = "Overdue";
            statusTone = "red";
          } else if (daysPending > 3) {
            statusText = "Delayed";
            statusTone = "orange";
          } else {
            statusText = "Normal";
            statusTone = "green";
          }
          
          return [
            index + 1,
            doctor.doctorName,
            doctor.speciality,
            doctor.mclCode,
            doctor.mr?.mrName || "N/A",
            new Date(doctor.createdAt).toLocaleDateString(),
            <Badge tone={daysPending > 7 ? "red" : daysPending > 3 ? "orange" : "green"}>
              {daysPending} days
            </Badge>,
            <Badge tone={statusTone}>{statusText}</Badge>,
            <Button 
              variant="ghost" 
              icon={Eye} 
              onClick={() => handleViewDoctor(doctor._id)}
            >
              View
            </Button>,
          ];
        })}
      />
    </Layout>
  );
}