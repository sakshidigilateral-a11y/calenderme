// pages/CalendarDesigns.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Eye, 
  Grid3x3, 
  List,
  Printer
} from "lucide-react";
import Layout from "../components/Layout";
import { Button, Crumbs, Badge } from "../components/UIComponents";
import { months } from "../utils/helpers";

// Import your actual design assets from CalendarSelect - ALL DESIGNS PER MONTH
const designAssets = {
  January: [
    { id: "jan-v1", label: "Jan V1", file: new URL("../assets/Jan v1.webp", import.meta.url).href },
    { id: "jan-v2", label: "Jan V2", file: new URL("../assets/Jan v2.webp", import.meta.url).href },
    { id: "jan-v3", label: "Jan V3", file: new URL("../assets/Jan v3.webp", import.meta.url).href },
    { id: "jan",    label: "Jan",    file: new URL("../assets/jan.webp",    import.meta.url).href },
  ],
  February: [
    { id: "feb-v1", label: "Feb V1", file: new URL("../assets/Feb v1.webp", import.meta.url).href },
    { id: "feb",    label: "Feb",    file: new URL("../assets/feb.webp",    import.meta.url).href },
  ],
  March: [
    { id: "march-v1", label: "March V1", file: new URL("../assets/March v1.webp", import.meta.url).href },
    { id: "march-v2", label: "March V2", file: new URL("../assets/March v2.webp", import.meta.url).href },
    { id: "march",    label: "March",    file: new URL("../assets/march.webp",    import.meta.url).href },
  ],
  April: [
    { id: "april", label: "April", file: new URL("../assets/april.webp", import.meta.url).href },
  ],
  May: [
    { id: "may-v1", label: "May V1", file: new URL("../assets/May v1.webp", import.meta.url).href },
    { id: "may",    label: "May",    file: new URL("../assets/may.webp",    import.meta.url).href },
  ],
  June: [
    { id: "june-v1", label: "June V1", file: new URL("../assets/June v1.webp", import.meta.url).href },
    { id: "june",    label: "June",    file: new URL("../assets/june.webp",    import.meta.url).href },
  ],
  July: [
    { id: "july-v1", label: "July V1", file: new URL("../assets/July v1.webp", import.meta.url).href },
    { id: "july-v2", label: "July V2", file: new URL("../assets/July v2.webp", import.meta.url).href },
    { id: "july-v3", label: "July V3", file: new URL("../assets/July v3.webp", import.meta.url).href },
    { id: "july-v4", label: "July V4", file: new URL("../assets/July v4.webp", import.meta.url).href },
    { id: "july-v5", label: "July V5", file: new URL("../assets/July v5.webp", import.meta.url).href },
    { id: "july",    label: "July",    file: new URL("../assets/july.webp",    import.meta.url).href },
  ],
  August: [
    { id: "aug-v1", label: "Aug V1", file: new URL("../assets/Aug v1.webp", import.meta.url).href },
    { id: "aug-v2", label: "Aug V2", file: new URL("../assets/Aug v2.webp", import.meta.url).href },
    { id: "aug-v3", label: "Aug V3", file: new URL("../assets/Aug v3.webp", import.meta.url).href },
    { id: "august", label: "August", file: new URL("../assets/august.webp", import.meta.url).href },
  ],
  September: [
    { id: "sep-v1",    label: "Sep V1",    file: new URL("../assets/Sep v1.webp", import.meta.url).href },
    { id: "sep-v2",    label: "Sep V2",    file: new URL("../assets/Sep v2.webp", import.meta.url).href },
    { id: "september", label: "September", file: new URL("../assets/september.webp", import.meta.url).href },
  ],
  October: [
    { id: "oct-v1", label: "Oct V1", file: new URL("../assets/Oct v1.webp", import.meta.url).href },
    { id: "oct",    label: "Oct",    file: new URL("../assets/oct.webp",    import.meta.url).href },
  ],
  November: [
    { id: "nov-v1", label: "Nov V1", file: new URL("../assets/Nov v1.webp", import.meta.url).href },
    { id: "nov",    label: "Nov",    file: new URL("../assets/nov.webp",    import.meta.url).href },
  ],
  December: [
    { id: "dec-v1", label: "Dec V1", file: new URL("../assets/Dec v1.webp", import.meta.url).href },
    { id: "dec",    label: "Dec",    file: new URL("../assets/dec.webp",    import.meta.url).href },
  ],
};

const CALENDAR_YEAR = 2027;

function PreviewModal({ design, month, onClose }) {
  if (!design) return null;
  
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          maxWidth: 700,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #f3f4f6"
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {design.label} — {month} {CALENDAR_YEAR}
            </div>
            {/* <div style={{ fontSize: 12, color: "#6b7280" }}>Code: {design.id}</div> */}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#6b7280"
            }}
          >
            ✕
          </button>
        </div>
        
        <img
          src={design.file}
          alt={design.label}
          style={{
            width: "100%",
            display: "block",
            maxHeight: "65vh",
            objectFit: "contain",
            background: "#f9fafb"
          }}
        />
        
        <div style={{
          padding: "14px 20px",
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          borderTop: "1px solid #f3f4f6"
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = design.file;
              link.download = `${month}_${CALENDAR_YEAR}_${design.label}.webp`;
              link.click();
            }}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              background: "#0b55f4",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

function DesignCard({ design, onPreview, onDownload }) {
  return (
    <div
      style={{
        border: "1.5px solid #e5e7eb",
        borderRadius: 12,
        background: "#fff",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#f9fafb" }}>
        <img
          src={design.file}
          alt={design.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }}
          onError={e => {
            e.target.style.display = "none";
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = "flex";
            }
          }}
        />
        <div style={{
          display: "none",
          position: "absolute",
          inset: 0,
          background: "#f3f4f6",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 6,
          color: "#9ca3af",
          fontSize: 12
        }}>
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span>{design.label}</span>
        </div>
      </div>
      <div style={{ padding: "10px 12px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{design.label}</div>
          {/* <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>Code: {design.id}</div> */}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(design); }}
            style={{
              padding: "5px 8px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              color: "#374151",
              cursor: "pointer"
            }}
          >
            <Eye size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(design); }}
            style={{
              padding: "5px 8px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              border: "none",
              background: "#0b55f4",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            <Download size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarDesigns({ role = "manager" }) {
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(CALENDAR_YEAR);
  const [viewMode, setViewMode] = useState("grid");
  const [previewDesign, setPreviewDesign] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Get all designs across all months (ALL DESIGNS, not just one per month)
  const getAllDesigns = () => {
    const allDesigns = [];
    months.forEach(month => {
      const designs = designAssets[month] || [];
      designs.forEach(design => {
        allDesigns.push({
          ...design,
          month: month,
          status: "available"
        });
      });
    });
    return allDesigns;
  };

  const allDesigns = getAllDesigns();

  // Filter designs
  const getFilteredDesigns = () => {
    let filtered = [...allDesigns];
    
    if (searchTerm) {
      filtered = filtered.filter(design =>
        design.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedMonth !== "all") {
      filtered = filtered.filter(design => design.month === selectedMonth);
    }
    
    return filtered;
  };

  const filteredDesigns = getFilteredDesigns();
  const uniqueMonths = [...new Set(allDesigns.map(d => d.month))];

  const handleDownload = (design) => {
    const link = document.createElement('a');
    link.href = design.file;
    link.download = `${design.month}_${currentYear}_${design.label}.webp`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleYearChange = (delta) => {
    setCurrentYear(prev => prev + delta);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedMonth("all");
  };

  // Group designs by month for better organization
  const designsByMonth = {};
  filteredDesigns.forEach(design => {
    if (!designsByMonth[design.month]) {
      designsByMonth[design.month] = [];
    }
    designsByMonth[design.month].push(design);
  });

  return (
    <Layout role={role} active="Calendar Designs">
      <Crumbs items={["Calendar Designs"]} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0 }}>Calendar Designs Gallery</h1>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Browse all available calendar designs for {currentYear}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px', border: '1px solid #ddd', borderRadius: '6px', padding: '2px' }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: '6px 12px',
                background: viewMode === "grid" ? '#3b82f6' : 'white',
                color: viewMode === "grid" ? 'white' : '#666',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: '6px 12px',
                background: viewMode === "list" ? '#3b82f6' : 'white',
                color: viewMode === "list" ? 'white' : '#666',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <List size={16} />
            </button>
          </div>
          <Button variant="outline" icon={Printer} onClick={handlePrint}>
            Print
          </Button>
        </div>
      </div>

      {/* Year Selector */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
        <button
          onClick={() => handleYearChange(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
        >
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '80px', textAlign: 'center' }}>{currentYear}</span>
        <button
          onClick={() => handleYearChange(1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by design name, month, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '200px'
            }}
          />
          
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: 'white' }}
          >
            <option value="all">All Months</option>
            {uniqueMonths.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          
          <button
            onClick={handleClearFilters}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{allDesigns.length}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Total Designs</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{uniqueMonths.length}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>Months Covered</div>
        </div>
        <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
            {Math.round(allDesigns.length / uniqueMonths.length)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Designs Per Month (Avg)</div>
        </div>
      </div>

      {/* Designs Display - Grouped by Month */}
      {filteredDesigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '12px' }}>
          <p>No designs found matching your criteria.</p>
        </div>
      ) : viewMode === "grid" ? (
        // Group by month for better organization
        Object.keys(designsByMonth).sort().map(month => (
          <div key={month} style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#374151' }}>{month}</h2>
              <Badge tone="blue">{designsByMonth[month].length} designs</Badge>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {designsByMonth[month].map((design) => (
                <DesignCard
                  key={`${design.month}-${design.id}`}
                  design={design}
                  onPreview={setPreviewDesign}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Preview</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Design Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Month</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Code</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Year</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDesigns.map((design, idx) => (
                <tr key={`${design.month}-${design.id}-${idx}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <img src={design.file} alt={design.label} style={{
                      width: '60px',
                      height: '45px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} />
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{design.label}</td>
                  <td style={{ padding: '12px' }}>{design.month}</td>
                  <td style={{ padding: '12px' }}>{design.id}</td>
                  <td style={{ padding: '12px' }}>{currentYear}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button size="small" variant="outline" icon={Eye} onClick={() => setPreviewDesign(design)} />
                      <Button size="small" variant="primary" icon={Download} onClick={() => handleDownload(design)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {previewDesign && (
        <PreviewModal
          design={previewDesign}
          month={previewDesign.month}
          onClose={() => setPreviewDesign(null)}
        />
      )}
    </Layout>
  );
}