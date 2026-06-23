import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Send, CheckCircle2, Clock3, XCircle, Download, Eye, Edit, MoreVertical, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import {
  StatCard,
  Badge,
  Button,
  Toolbar,
  DataTable,
  Crumbs,
} from "../components/UIComponents";
import { getSubmittedDoctors } from "../api/doctorAPI";

// 3 Dots Dropdown Menu Component
function MoreActionsMenu({ onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="more-actions-menu" ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          color: '#6b7280'
        }}
        title="More Actions"
      >
        <MoreVertical size={18} />
      </button>
      
      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '140px',
            overflow: 'hidden'
          }}
        >
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '13px',
              color: '#ef4444'
            }}
          >
            <Trash2 size={14} />
            Delete Doctor
          </button>
        </div>
      )}
      
      <style>{`
        .more-actions-menu button:hover {
          background-color: #f3f4f6;
        }
        .dropdown-menu button:hover {
          background-color: #f9fafb;
        }
      `}</style>
    </div>
  );
}

export default function SubmittedDoctors() {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = await getSubmittedDoctors(user.mrId);
        setDoctorData(data.doctors);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  
  const handleEdit = (doctorId) => {
    navigate(`/edit-doctor/${doctorId}`);
  };
  
  const handleView = (doctorId) => {
    navigate(`/doctor-details/${doctorId}`);
  };
  
  const handleDelete = async (doctorId, doctorName) => {
    if (window.confirm(`Are you sure you want to delete ${doctorName}?`)) {
      try {
        // Add your delete API call here
        alert("Delete functionality - Add your API call");
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("Failed to delete doctor");
      }
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout active="My Doctors">
      <Crumbs items={["My Doctors", "Submitted Doctors"]} />
      <div className="pageHead">
        <div>
          <h1>Submitted Doctors</h1>
          <p className="subtitle">
            Below are the doctors you've submitted for approval.
          </p>
        </div>
        <Button variant="outline" icon={Download}>
          Export
        </Button>
      </div>

      <div className="grid cards4">
        <StatCard
          title="Total Submitted"
          value={doctorData.length}
          icon={Send}
          tone="purple"
        />
        <StatCard
          title="Pending Approval"
          value={doctorData.filter((doctor) => doctor.approvalStatus === "pending").length}
          icon={Clock3}
          tone="orange"
        />
        <StatCard
          title="Approved"
          value={doctorData.filter((doctor) => doctor.approvalStatus === "approved").length}
          icon={CheckCircle2}
          tone="green"
        />
        <StatCard
          title="Rejected / Returned"
          value={doctorData.filter((doctor) => doctor.approvalStatus === "rejected").length}
          icon={XCircle}
          tone="red"
        />
      </div>

      <Toolbar />

      <DataTable
        headers={[
          "Doctor Name",
          "Speciality",
          "MCL Code",
          "Submitted On",
          "Status",
          "Submitted By",
          "Actions",
        ]}
        rows={doctorData.map((doctor, i) => [
          doctor.doctorName,
          doctor.speciality,
          doctor.mclCode,
          new Date(doctor.createdAt).toLocaleDateString(),
          doctor.approvalStatus === "approved" ? (
            <Badge tone="green">Approved</Badge>
          ) : doctor.approvalStatus === "rejected" ? (
            <Badge tone="red">Rejected / Returned</Badge>
          ) : (
            <Badge tone="orange">Pending Approval</Badge>
          ),
          "MR",
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }} key={i}>
            {/* Eye Icon - View */}
            <button
              onClick={() => handleView(doctor._id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                color: '#3b82f6'
              }}
              title="View Details"
            >
              <Eye size={18} />
            </button>
            
            {/* Edit Icon - Only for pending approval */}
            {doctor.approvalStatus === "pending" && (
              <button
                onClick={() => handleEdit(doctor._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#10b981'
                }}
                title="Edit Doctor"
              >
                <Edit size={18} />
              </button>
            )}
            
            {/* 3 Dots - More Actions (only for pending approval) */}
            {doctor.approvalStatus === "pending" && (
              <MoreActionsMenu onDelete={() => handleDelete(doctor._id, doctor.doctorName)} />
            )}
          </div>,
        ])}
      />
    </Layout>
  );
}