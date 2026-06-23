import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pencil,
  Download,
  Upload,
  Clock3,
  CheckCircle2,
  Camera,
  CalendarDays,
  Hand,
  Send,
  X,
  AlertCircle,
} from "lucide-react";
import Layout from "../components/Layout";
import { uploadDoctorPhotos } from "../api/doctorAPI";
import {
  Badge,
  Button,
  IconBox,
  Section,
  Crumbs,
} from "../components/UIComponents";
import { ConsentModal } from "../components/Modal";
import { getDoctorDetails } from "../api/doctorAPI";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// ─── Popup Component ────────────────────────────────────
function Popup({ isOpen, type, title, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay"
      onClick={onClose}
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
          maxWidth: "450px",
          width: "90%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "scaleIn 0.3s ease",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
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
          {type === "success" ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#d1fae5",
                color: "#065f46",
              }}
            >
              <CheckCircle2 size={32} />
            </div>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
              }}
            >
              <AlertCircle size={32} />
            </div>
          )}
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: type === "success" ? "#065f46" : "#991b1b",
          }}
        >
          {title}
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
          {message}
        </p>

        <button
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            padding: "12px",
            backgroundColor: type === "success" ? "#10b981" : "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor =
              type === "success" ? "#059669" : "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor =
              type === "success" ? "#10b981" : "#ef4444";
          }}
        >
          Got it
        </button>
      </div>

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
    </div>
  );
}

// ─── Campaign Summary ──────────────────────────────────
function CampaignSummary({ doctor }) {
  return (
    <div className="campaignSummary">
      <h3>Campaign Status Summary</h3>

      {[
        ["Consent", doctor.consentStatus || "Pending", CheckCircle2],
        ["Photo", doctor.photoUploaded ? "Uploaded" : "Pending", Camera],
        [
          "Calendar",
          doctor.calendarFrozen ? "Frozen" : "Pending",
          CalendarDays,
        ],
        [
          "Input Given",
          doctor.inputGivenStatus === "completed" ? "Yes" : "No",
          Hand,
        ],
        ["Delivered", doctor.calendarDelivered ? "Yes" : "No", CheckCircle2],
      ].map(([title, value, Icon]) => (
        <div key={title}>
          <IconBox icon={Icon} tone="green" />
          <b>{title}</b>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Timeline ──────────────────────────────────────────
function Timeline({ doctor }) {
  const timelineItems = [
    {
      title: "Doctor Added",
      by: doctor.mr?.mrName,
      date: doctor.createdAt,
      icon: CheckCircle2,
      tone: "green",
    },
    {
      title: "Consent Sent",
      by: doctor.mr?.mrName,
      date: doctor.consentSentAt,
      icon: Send,
      tone: "purple",
    },
    {
      title: "Consent Approved",
      by: doctor.mr?.mrName,
      date: doctor.consentDate || doctor.approvedAt,
      icon: CheckCircle2,
      tone: "orange",
    },
    {
      title: "Photo Uploaded",
      by: doctor.mr?.mrName,
      date: doctor.photoUploadedAt,
      icon: Camera,
      tone: "green",
    },
    {
      title: "Calendar Design Selected",
      by: doctor.mr?.mrName,
      date: doctor.calendarSelectedAt,
      icon: CalendarDays,
      tone: "purple",
    },
    {
      title: "Calendar Frozen",
      by: doctor.mr?.mrName,
      date: doctor.calendarFrozenAt,
      icon: CalendarDays,
      tone: "orange",
    },
    {
      title: "Input Given",
      by: doctor.mr?.mrName,
      date: doctor.inputGivenAt,
      icon: Hand,
      tone: "green",
    },
    {
      title: "Calendar Delivered",
      by: doctor.mr?.mrName,
      date: doctor.deliveredAt,
      icon: Send,
      tone: "purple",
    },
  ];

  timelineItems.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <aside className="timeline">
      <h3>Activity Timeline</h3>

      {timelineItems.map((item) => (
        <div key={item.title} className="timelineItem">
          <IconBox icon={item.icon} tone={item.tone} />
          <div>
            <b>{item.title}</b>
            <span>By {item.by || "-"} (MR)</span>
          </div>
          <small>
            {item.date ? (
              <>
                {new Date(item.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })}
                <br />
                {new Date(item.date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}
              </>
            ) : (
              <>
                -
                <br />-
              </>
            )}
          </small>
        </div>
      ))}

      <Button variant="outline" icon={Clock3}>
        View Full Timeline
      </Button>
    </aside>
  );
}

// ─── Main Component ─────────────────────────────────────
export default function DoctorDetail({ consentModal = false }) {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const fileInputRef = useRef(null);
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const showPopup = (type, title, message) => {
    setPopup({ isOpen: true, type, title, message });
  };
  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctorDetails(doctorId);
        setDoctor(data.doctor);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  if (!doctor) {
    return <Layout active="My Doctors">Loading...</Layout>;
  }

  const isPhotoLimitReached = (doctor?.doctorPhotos?.length || 0) >= 5;
  const isApproved = doctor?.approvalStatus === "approved";

  const handlePhotoUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("photos", file);
      });

      await uploadDoctorPhotos(doctorId, formData);
      const data = await getDoctorDetails(doctorId);
      setDoctor(data.doctor);
      showPopup("success", "Photos Uploaded!", "Photos uploaded successfully!");
    } catch (error) {
      console.log(error);
      showPopup("error", "Upload Failed", "Failed to upload photos");
    }
  };

  // ─── Edit Doctor ──────────────────────────────────────
  const handleEditDoctor = () => {
    navigate(`/edit-doctor/${doctorId}`);
  };

  // ─── Download Profile ────────────────────────────────
// ─── Download Profile as PDF ──────────────────────────
// ─── Download Profile as PDF (with photos) ─────────────
const handleDownloadProfile = async () => {
  if (!doctor) return;

  // Show a loading popup (optional)
  showPopup("success", "Generating PDF...", "Please wait while we prepare your download.");

  try {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor("#0b55f4");
    doc.text("Doctor Profile", 14, 22);

    doc.setDrawColor(11, 85, 244);
    doc.line(14, 26, 196, 26);

    doc.setFontSize(12);
    doc.setTextColor("#1a1a2e");

    let y = 36;
    const lineHeight = 8;
    const x = 16;

    // ─── Doctor Information ───
    doc.setFont("helvetica", "bold");
    doc.text("Doctor Information", x, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");

    const info = [
      `Name:        ${doctor.doctorName}`,
      `Speciality:  ${doctor.speciality}`,
      `MCL Code:    ${doctor.mclCode}`,
      `Clinic:      ${doctor.clinicName || "-"}`,
      `City:        ${doctor.city || "-"}`,
      `Area:        ${doctor.area || "-"}`,
      `Email:       ${doctor.email || "-"}`,
      `Mobile:      ${doctor.mobile || "-"}`,
      `Status:      ${doctor.approvalStatus || "Pending"}`,
    ];

    info.forEach((line) => {
      doc.text(line, x, y);
      y += lineHeight;
    });

    y += 4;

    // ─── Business Information ───
    doc.setFont("helvetica", "bold");
    doc.text("Business Information", x, y);
    y += lineHeight;
    doc.setFont("helvetica", "normal");

    const business = [
      `Current Business:  ₹${doctor.currentBusiness || 0}`,
      `Expected Business: ₹${doctor.expectedBusiness || 0}`,
      `Brand Focus:       ${doctor.brandFocus || "-"}`,
      `Other Activities:  ${doctor.otherActivities || "-"}`,
    ];

    business.forEach((line) => {
      doc.text(line, x, y);
      y += lineHeight;
    });

    y += 6;

    // ─── Photos Section ───
    if (doctor.doctorPhotos && doctor.doctorPhotos.length > 0) {
      // Add a new page if needed (if y is near bottom)
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Photos", x, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");

      // Load images concurrently
      const imagePromises = doctor.doctorPhotos.map((photo, index) => {
        return new Promise((resolve) => {
          const imgUrl = `http://localhost:5000${photo.url}`;
          fetch(imgUrl)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to load");
              return res.blob();
            })
            .then((blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  index,
                  data: reader.result, // base64
                  success: true,
                });
              };
              reader.onerror = () => {
                resolve({ index, success: false });
              };
              reader.readAsDataURL(blob);
            })
            .catch(() => {
              resolve({ index, success: false });
            });
        });
      });

      const results = await Promise.all(imagePromises);

      // Add images to PDF (two per row, each 60mm wide)
      const imgWidth = 60;
      const imgHeight = 60;
      const rowGap = 10;
      const colGap = 10;
      let imgX = x;
      let imgY = y;
      let rowIndex = 0;

      results.forEach((result) => {
        if (result.success) {
          // Check if we need a new page
          if (imgY + imgHeight > 280) {
            doc.addPage();
            imgY = 20;
            imgX = x;
          }

          doc.addImage(result.data, "JPEG", imgX, imgY, imgWidth, imgHeight);
          // Add label
          doc.setFontSize(8);
          doc.text(`Photo ${result.index + 1}`, imgX, imgY + imgHeight + 4);
          doc.setFontSize(12);

          // Move to next position
          imgX += imgWidth + colGap;
          if (imgX + imgWidth > 196) {
            imgX = x;
            imgY += imgHeight + rowGap + 8;
          }
        }
      });

      // Update y to after photos
      y = imgY + imgHeight + rowGap + 8;
    }

    // ─── Footer ───
    doc.setFontSize(10);
    doc.setTextColor("#6b7280");
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(`Downloaded on: ${new Date().toLocaleString()}`, x, y);

    // Save PDF
    doc.save(`Doctor_${doctor.doctorName.replace(/\s/g, "_")}_Profile.pdf`);

    // Close the loading popup (it will be replaced by success)
    closePopup();
    showPopup("success", "Download Complete!", "Profile PDF downloaded successfully.");
  } catch (error) {
    console.error("PDF generation error:", error);
    closePopup();
    showPopup("error", "Download Failed", "Could not generate PDF. Please try again.");
  }
};

  return (
    <Layout active="My Doctors">
      <Crumbs items={["My Doctors", "Doctor Details"]} />
      <div className="pageHead">
        <div>
          <h1>
            {doctor.doctorName}
            <Badge>{doctor.approvalStatus || "Pending"}</Badge>
          </h1>
          <p className="subtitle">
            {doctor.speciality} • {doctor.mclCode}
          </p>
        </div>
        <div>
          <Button variant="outline" icon={Pencil} onClick={handleEditDoctor}>
            Edit Doctor
          </Button>
          <Button variant="outline" icon={Download} onClick={handleDownloadProfile}>
            Download Profile
          </Button>
        </div>
      </div>

      <div className="detailGrid">
        <div>
          <div className="tabs">
            <b>Overview</b>
            {/* <span>Campaign Progress</span> */}
            <span>Calendar & Photo</span>
           
          </div>

          <div className="profile">
            <div className="bigInitial">
              {doctor.doctorName
                ?.trim()
                .split(" ")
                .filter((word) => word.length > 0)
                .map((word) => word.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")}
            </div>

            {/* ─── PHOTO UPLOAD SECTION ─── */}
            {isApproved ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={handlePhotoUpload}
                  disabled={isPhotoLimitReached}
                />
                <div
                  className="uploadBox"
                  onClick={() => {
                    if (!isPhotoLimitReached) {
                      fileInputRef.current?.click();
                    }
                  }}
                  style={{
                    cursor: isPhotoLimitReached ? "not-allowed" : "pointer",
                    opacity: isPhotoLimitReached ? 0.6 : 1,
                  }}
                >
                  <Upload size={28} />
                  <span>
                    {isPhotoLimitReached
                      ? "Photo Limit Reached (5/5)"
                      : `View / Upload Photo (${doctor?.doctorPhotos?.length || 0}/5)`}
                  </span>
                </div>
              </>
            ) : (
              <div
                className="uploadBox"
                style={{
                  backgroundColor: "#f3f4f6",
                  border: "2px dashed #d1d5db",
                  cursor: "not-allowed",
                  opacity: 0.7,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔒</div>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Photos can be uploaded only after approval
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    Current status: {doctor.approvalStatus || "Pending"}
                  </span>
                </div>
              </div>
            )}

            {/* ─── Display uploaded photos ─── */}
            {doctor.doctorPhotos && doctor.doctorPhotos.length > 0 && (
              <div
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "12px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Uploaded Photos ({doctor.doctorPhotos.length}/5)
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {doctor.doctorPhotos.map((photo, idx) => (
                    <div
                      key={photo._id || idx}
                      style={{
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        background: "white",
                      }}
                      onClick={() =>
                        window.open(`http://localhost:5000${photo.url}`, "_blank")
                      }
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <img
                        src={`http://localhost:5000${photo.url}`}
                        alt={`Photo ${idx + 1}`}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => {
                          console.error("Failed to load image:", photo.url);
                          e.target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"%3E%3Crect x="2" y="2" width="20" height="20" rx="2.18"/%3E%3Ccircle cx="8.5" cy="8.5" r="2.5"/%3E%3Cpath d="M21 15l-5-5-6 6-3-3-4 4"/%3E%3C/svg%3E';
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          fontSize: "10px",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        Photo {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Doctor Details ─── */}
            <div className="details">
              <Section
                title="Doctor Information"
                data={[
                  `Speciality: ${doctor.speciality}`,
                  `MCL Code: ${doctor.mclCode}`,
                  `Clinic / Hospital: ${doctor.clinicName || "-"}`,
                  `City: ${doctor.city || "-"}`,
                  `Email: ${doctor.email || "-"}`,
                  `Mobile: ${doctor.mobile || "-"}`,
                ]}
              />
              <Section
                title="Hierarchy"
                data={[
                  `HQ / Location: ${doctor.mr?.hq || "-"}`,
                  `Region: ${doctor.mr?.region || "-"}`,
                  `Zone: ${doctor.mr?.zone || "-"}`,
                  `MR: ${doctor.mr?.mrName || "-"}`,
                  `Manager: ${doctor.mr?.flm?.flmName || "-"}`,
                ]}
              />
            </div>
          </div>

          <div className="business">
            <Section
              title="Business Information"
              data={[
                `Current Business (₹): ${doctor.currentBusiness || 0}`,
                `Expected Business (₹): ${doctor.expectedBusiness || 0}`,
                `Other Activities: ${doctor.otherActivities || "-"}`,
              ]}
            />
          </div>

          <CampaignSummary doctor={doctor} />
        </div>

        <Timeline doctor={doctor} />
      </div>

      {consentModal && <ConsentModal />}
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
      />
    </Layout>
  );
}