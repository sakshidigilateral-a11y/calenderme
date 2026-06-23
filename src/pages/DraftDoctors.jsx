import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getDoctors, deleteDoctor } from "../api/doctorAPI";
import { FileText, UserPlus, Trash2, X, AlertCircle } from "lucide-react";
import Layout from "../components/Layout";
import {
  StatCard,
  Badge,
  Button,
  Toolbar,
  Actions,
  DataTable,
  Crumbs,
} from "../components/UIComponents";
import { getDraftDoctors } from "../api/doctorAPI";

export default function DraftDoctors() {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    doctorId: null,
    doctorName: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = await getDraftDoctors(user.mrId);
        setDoctorData(data.doctors);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleDelete = async () => {
    const { doctorId, doctorName } = deletePopup;
    if (!doctorId) return;

    try {
      await deleteDoctor(doctorId);
      setDoctorData(doctorData.filter((d) => d._id !== doctorId));
      closeDeletePopup();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete doctor.");
    }
  };

  const openDeletePopup = (doctorId, doctorName) => {
    setDeletePopup({ isOpen: true, doctorId, doctorName });
  };

  const closeDeletePopup = () => {
    setDeletePopup({ isOpen: false, doctorId: null, doctorName: "" });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout active="My Doctors">
      <Crumbs items={["My Doctors", "Draft Doctors"]} />
      <div className="pageHead">
        <div>
          <h1>Draft Doctors</h1>
          <p className="subtitle">
            Below are the doctors you've added and saved as draft.
          </p>
        </div>
        <Button icon={UserPlus} onClick={() => navigate("/add-doctor")}>
          Add New Doctor
        </Button>
      </div>

      <div className="grid cards4">
        <StatCard
          title="Draft Doctors Summary"
          value={doctorData.length}
          icon={FileText}
          tone="blue"
        />
      </div>

      <Toolbar />

      <DataTable
        headers={[
          "Doctor Name",
          "Speciality",
          "MCL Code",
          "City",
          "Date Saved",
          "Modified Date",
          "Actions",
        ]}
        rows={doctorData.map((doctor) => [
          doctor.doctorName,
          doctor.speciality,
          doctor.mclCode,
          doctor.city,
          new Date(doctor.createdAt).toLocaleDateString(),
          doctor.updatedAt
            ? new Date(doctor.updatedAt).toLocaleDateString()
            : new Date(doctor.createdAt).toLocaleDateString(),
          <Actions
            key={doctor._id}
            edit
            onEdit={() => navigate(`/edit-doctor/${doctor._id}`)}
            delete
            onDelete={() => openDeletePopup(doctor._id, doctor.doctorName)}
          />,
        ])}
      />

      {/* Custom Delete Confirmation Popup */}
      {deletePopup.isOpen && (
        <div
          className="popup-overlay"
          onClick={closeDeletePopup}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div
            className="popup-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "scaleIn 0.3s ease",
              position: "relative",
            }}
          >
            <button
              onClick={closeDeletePopup}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#999",
                padding: "4px",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                }}
              >
                <AlertCircle size={32} />
              </div>
            </div>

            <h2
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
                color: "#991b1b",
              }}
            >
              Delete Doctor?
            </h2>

            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#666",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              Are you sure you want to delete <strong>{deletePopup.doctorName}</strong>?<br />
              This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={closeDeletePopup}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#b91c1c";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#dc2626";
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </Layout>
  );
}