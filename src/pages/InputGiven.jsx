// import React from "react";
// import { CalendarDays, CheckCircle2, Clock3, Box, Info, ArrowLeft, Download } from "lucide-react";
// import Layout from "../components/Layout";
// import { StatCard, Badge, Button, DataTable, Crumbs, SuccessBlock } from "../components/UIComponents";
// import { InputGivenModal } from "../components/Modal";
// import { mrDoctors } from "../utils/helpers";

// export default function InputGiven({ modal = false, success = false }) {
//   if (success) {
//     return (
//       <Layout active="Input Given">
//         <Crumbs items={["Input Given","Confirmed"]} />
//         <h1>Input Given Successfully!</h1>
//         <p className="subtitle">The calendar has been marked as handed over to the doctor.</p>
//         <SuccessBlock title="Input Given Confirmed" status="INPUT GIVEN" />
//         <div className="footerActions">
//           <Button variant="outline" icon={ArrowLeft}>Back to Input Given List</Button>
//           <div className="spacer" />
//           <Button variant="outline" icon={Download}>Download Handover Confirmation (PDF)</Button>
//           <Button>Go to Dashboard</Button>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout active="Input Given">
//       <Crumbs items={["Input Given"]} />
//       <h1>Input Given</h1>
//       <p className="subtitle">Select the doctor whose personalized calendar has been handed over to mark as Input Given.</p>
//       <div className="grid cards4">
//         <StatCard title="Ready for Handover" value="18" icon={CalendarDays} />
//         <StatCard title="Input Given Today" value="6" icon={CheckCircle2} tone="green" />
//         <StatCard title="Pending Input Given" value="12" icon={Clock3} tone="orange" />
//         <StatCard title="Calendar Delivered" value="54" icon={Box} tone="purple" />
//       </div>
//       <div className="notice">
//         <Info />
//         Mark the calendar as Input Given only after the personalized calendar has been physically handed over to the doctor.
//       </div>
//       <DataTable
//         headers={["Doctor Name","Speciality","MCL Code","City","Calendar Status","Last Updated","Action"]}
//         rows={mrDoctors.slice(0, 7).map((d, i) => [
//           d[0], d[1], d[2], d[3],
//           <Badge tone={i % 3 === 0 ? "orange" : "green"}>
//             {i % 3 === 0 ? "Ready for Handover" : "Calendar Frozen"}
//           </Badge>,
//           `${20 + i} May 2025, 04:35 PM`,
//           <Button>Input Given</Button>,
//         ])}
//       />
//       {modal && <InputGivenModal />}
//     </Layout>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, Box, Info, ArrowLeft, Download, X } from "lucide-react";
import Layout from "../components/Layout";
import { StatCard, Badge, Button, DataTable, Crumbs, SuccessBlock } from "../components/UIComponents";

const API_BASE = "http://localhost:5000/api";

export default function InputGiven({ modal = false, success = false }) {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [stats, setStats] = useState({
    readyForHandover: 0,
    inputGivenToday: 0,
    pendingInputGiven: 0,
    calendarDelivered: 0,
  });

  // Fetch doctors that are frozen/ready for input given
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const mrId = user.mrId;

        if (!mrId) {
          console.error("No MR ID found");
          setLoading(false);
          return;
        }

        // Fetch all doctors for this MR
        const response = await fetch(`${API_BASE}/doctors/mr/${mrId}`);
        const data = await response.json();

        if (data.success && data.doctors) {
          setDoctors(data.doctors);
          
          // Calculate stats
          const ready = data.doctors.filter(d => d.calendarStatus === "frozen" && !d.inputGiven).length;
          const pending = data.doctors.filter(d => d.calendarStatus === "frozen" && !d.inputGiven).length;
          const delivered = data.doctors.filter(d => d.inputGiven === true).length;
          const today = data.doctors.filter(d => {
            if (!d.inputGivenAt) return false;
            const todayDate = new Date().toDateString();
            const inputDate = new Date(d.inputGivenAt).toDateString();
            return todayDate === inputDate;
          }).length;
          
          setStats({
            readyForHandover: ready,
            inputGivenToday: today,
            pendingInputGiven: pending,
            calendarDelivered: delivered,
          });
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleInputGiven = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setRemarks("");
  };

  const handleConfirmInputGiven = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      const response = await fetch(`${API_BASE}/calendar/mark-input-given`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mrId: user.mrId,
          doctorId: selectedDoctor._id,
          year: 2027,
          remarks: remarks,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Input Given marked successfully!");
        setShowModal(false);
        // Refresh the data
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to mark Input Given: " + err.message);
    }
  };

  if (success) {
    return (
      <Layout active="Input Given">
        <Crumbs items={["Input Given", "Confirmed"]} />
        <h1>Input Given Successfully!</h1>
        <p className="subtitle">The calendar has been marked as handed over to the doctor.</p>
        <SuccessBlock title="Input Given Confirmed" status="INPUT GIVEN" />
        <div className="footerActions">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/input-given")}>
            Back to Input Given List
          </Button>
          <div className="spacer" />
          <Button variant="outline" icon={Download}>
            Download Handover Confirmation (PDF)
          </Button>
          <Button onClick={() => navigate("/mr-dashboard")}>Go to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout active="Input Given">
        <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout active="Input Given">
      <Crumbs items={["Input Given"]} />
      <h1>Input Given</h1>
      <p className="subtitle">
        Select the doctor whose personalized calendar has been handed over to mark as Input Given.
      </p>
      
      <div className="grid cards4">
        <StatCard title="Ready for Handover" value={stats.readyForHandover} icon={CalendarDays} />
        <StatCard title="Input Given Today" value={stats.inputGivenToday} icon={CheckCircle2} tone="green" />
        <StatCard title="Pending Input Given" value={stats.pendingInputGiven} icon={Clock3} tone="orange" />
        <StatCard title="Calendar Dispatched" value={stats.calendarDelivered} icon={Box} tone="purple" />
      </div>
      
      <div className="notice">
        <Info />
        Mark the calendar as Input Given only after the personalized calendar has been physically handed over to the doctor.
      </div>
      
      <DataTable
        headers={[
          "Doctor Name",
          "Speciality",
          "MCL Code",
          "City",
          "Calendar Status",
          "Input Given Status",
          "Last Updated",
          "Action",
        ]}
        rows={doctors.map((doctor) => [
          doctor.doctorName,
          doctor.speciality || "N/A",
          doctor.mclCode || "N/A",
          doctor.city || "N/A",
          <Badge tone={doctor.calendarStatus === "frozen" ? "green" : "orange"}>
            {doctor.calendarStatus === "frozen" ? "Frozen" : doctor.calendarStatus || "Not Started"}
          </Badge>,
          <Badge tone={doctor.inputGiven ? "green" : "orange"}>
            {doctor.inputGiven ? "✓ Completed" : "Pending"}
          </Badge>,
          doctor.updatedAt ? new Date(doctor.updatedAt).toLocaleDateString() : "N/A",
          !doctor.inputGiven && doctor.calendarStatus === "frozen" ? (
            <Button onClick={() => handleInputGiven(doctor)}>Mark Input Given</Button>
          ) : doctor.inputGiven ? (
            <Badge tone="green">Completed</Badge>
          ) : (
            <Badge tone="orange">Waiting</Badge>
          ),
        ])}
      />
      
      {/* Modal */}
      {showModal && selectedDoctor && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modal small" onClick={e => e.stopPropagation()}>
            <button className="x" onClick={() => setShowModal(false)}>
              <X />
            </button>
            <h2>Mark Input Given</h2>
            <p>Provide the handover details to mark the calendar as Input Given.</p>
            
            <div style={{ marginBottom: 16, background: "#f9fafb", padding: 12, borderRadius: 8 }}>
              <p><strong>Doctor Name:</strong> {selectedDoctor.doctorName}</p>
              <p><strong>MCL Code:</strong> {selectedDoctor.mclCode || "N/A"}</p>
              <p><strong>Calendar Year:</strong> 2027</p>
              <p><strong>Calendar Status:</strong> {selectedDoctor.calendarStatus}</p>
            </div>
            
            <label>Input Given Date *</label>
            <div className="input" style={{ marginBottom: 16 }}>
              <CalendarDays size={20} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <label>Remarks (Optional)</label>
            <textarea
              placeholder="Enter any remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", marginBottom: 16 }}
              rows={3}
            />
            
            <div className="modalActions">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleConfirmInputGiven}>Confirm Input Given</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}