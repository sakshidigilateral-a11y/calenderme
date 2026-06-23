import React from "react";
import { cls } from "../utils/helpers";
import {
  CheckCircle2, Users, BarChart3, ChevronDown, Search, Filter,
  Eye, Pencil, MoreVertical, ArrowRight, ArrowLeft,
} from "lucide-react";

// ─── IconBox ────────────────────────────────────────────
export function IconBox({ icon: Icon = CheckCircle2, tone = "blue" }) {
  return (
    <div className={`iconbox ${tone}`}>
      <Icon size={24} />
    </div>
  );
}

// ─── Badge ──────────────────────────────────────────────
export function Badge({ children, tone = "green" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

// ─── Button ─────────────────────────────────────────────
export function Button({ children, variant = "primary", icon: Icon, onClick, className = "", disabled = false, size = "medium" }) {
  return (
    <button 
      onClick={onClick} 
      className={cls("btn", variant, className, size)} 
      disabled={disabled}
    >
      {Icon && <Icon size={16} />} 
      {children}
    </button>
  );
}

// ─── StatCard ───────────────────────────────────────────
export function StatCard({ title, value, sub, icon, tone = "blue", onClick }) {
  return (
    <div 
      className={`stat ${tone}`} 
      onClick={onClick} 
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <IconBox icon={icon} tone={tone} />
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}

// ─── ProgressBar ────────────────────────────────────────
export function ProgressBar({ value = 60, tone = "green" }) {
  return (
    <span className="progress">
      <span className={tone} style={{ width: `${value}%` }} />
    </span>
  );
}

// ─── Avatar ─────────────────────────────────────────────
export function Avatar({ name, role }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="avatarWrap">
      <div className="avatar">{initials}</div>
      <div>
        <strong>{name}</strong>
        <small>{role}</small>
      </div>
    </div>
  );
}

// ─── SelectBox ──────────────────────────────────────────
export function SelectBox({ label = "All", wide = false, value, onChange, options = [] }) {
  if (options && options.length > 0) {
    return (
      <select 
        className={cls("selectbox", wide && "wide")}
        value={value}
        onChange={onChange}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
  
  return (
    <div className={cls("selectbox", wide && "wide")}>
      {label}
      <ChevronDown size={16} />
    </div>
  );
}

// ─── SearchBox ──────────────────────────────────────────
export function SearchBox({ placeholder = "Search doctor name, MCL code..." }) {
  return (
    <div className="search">
      <Search size={17} />
      <span>{placeholder}</span>
    </div>
  );
}

// ─── Panel ──────────────────────────────────────────────
export function Panel({ title, children, action, onActionClick }) {
  return (
    <div className="panel">
      <div className="panelHead">
        <h3>{title}</h3>
        {action && (
          <button onClick={onActionClick} style={{ cursor: 'pointer' }}>
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── ListLine ───────────────────────────────────────────
export function ListLine({ icon: Icon, title, sub, value, onClick, clickable = true }) {
  return (
    <div 
      className="listline" 
      onClick={onClick}
      style={{ cursor: clickable && onClick ? 'pointer' : 'default' }}
    >
      <IconBox icon={Icon} tone="orange" />
      <div>
        <b>{title}</b>
        <span>{sub}</span>
      </div>
      <strong>{value}</strong>
      <ArrowRight size={18} />
    </div>
  );
}

// ─── DoctorActivity ─────────────────────────────────────
export function DoctorActivity({ doctor }) {
  let status = "";
  let statusTone = "orange";

  if (doctor.approvalStatus === "approved") {
    status = "Approved";
    statusTone = "green";
  } else if (doctor.consentStatus === "approved" && doctor.approvalStatus === "pending") {
    status = "Approval Pending";
    statusTone = "orange";
  } else if (doctor.consentStatus === "pending") {
    status = "Consent Pending";
    statusTone = "orange";
  } else if (doctor.status === "draft") {
    status = "Draft";
    statusTone = "purple";
  } else {
    status = "Pending";
    statusTone = "orange";
  }

  return (
    <div className="doctorAct">
      <div className="miniAvatar">
        {doctor.doctorName?.split(" ")?.map((n) => n[0])?.slice(0, 2)?.join("") || "D"}
      </div>
      <div>
        <b>{doctor.doctorName}</b>
        <span>{doctor.speciality} | {doctor.city}</span>
      </div>
      <Badge tone={statusTone}>{status}</Badge>
      <small>by {doctor.mr?.mrName || "MR"}</small>
    </div>
  );
}

// ─── ManagerActivity ────────────────────────────────────
// In UIComponents.jsx - Updated ManagerActivity
export function ManagerActivity({ title, status, time }) {
  return (
    <div className="doctorAct" style={{ 
      padding: '12px',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div className="miniAvatar" style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#e0e7ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        color: '#4f46e5',
        fontSize: '14px',
        flexShrink: 0
      }}>
        {title?.split(' ').slice(0, 2).map(x => x?.[0] || '').join('') || 'A'}
      </div>

      <div style={{ flex: 1 }}>
        <b style={{ fontSize: '13px', display: 'block' }}>{title || 'Activity'}</b>
        {time && (
          <small style={{ fontSize: '11px', color: '#999' }}>
            {new Date(time).toLocaleString()}
          </small>
        )}
      </div>

      <Badge tone={status === "Completed" ? "green" : status === "Rejected" ? "red" : "purple"}>
        {status || "Completed"}
      </Badge>
    </div>
  );
}
// ─── Toolbar ────────────────────────────────────────────
export function Toolbar() {
  return (
    <div className="toolbar">
      <SearchBox placeholder="Search by Doctor Name, Speciality, MCL Code..." />
      <SelectBox label="All Status" />
      <SelectBox label="All Specialties" />
      <SelectBox label="Select Date Range" />
      <Button variant="outline" icon={Filter}>
        Clear Filters
      </Button>
    </div>
  );
}

// ─── Actions ────────────────────────────────────────────
export function Actions({ edit, onView, onEdit, onDelete }) {
  return (
    <div className="actions">
      <Button variant="icon" icon={Eye} onClick={onView} />
      {edit && <Button variant="icon" icon={Pencil} onClick={onEdit} />}
      <Button variant="icon" icon={MoreVertical} onClick={onDelete} />
    </div>
  );
}

// ─── DataTable ──────────────────────────────────────────
export function DataTable({ headers, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="tableBox">
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="tableBox">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tableFoot">
        <span>
          Showing 1 to {Math.min(rows.length, 10)} of {rows.length} entries
        </span>
        <div className="pager">
          <button>‹</button>
          <button className="on">1</button>
          <button>›</button>
        </div>
      </div>
    </div>
  );
}

// ─── Breadcrumbs ────────────────────────────────────────
export function Crumbs({ items }) {
  return (
    <div className="crumbs">
      Dashboard{" "}
      {items?.map((i) => (
        <React.Fragment key={i}>
          › <span>{i}</span>{" "}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Form helpers ───────────────────────────────────────
export function Field({
  label,
  select,
  textarea,
  custom,
  value,
  onChange,
  name,
  options = [],
  required,
  type = "text",
  disabled,
  helperText,
}) {
  return (
    <label className="field">
      <span>{label}</span>

      {custom ? (
        custom
      ) : textarea ? (
        <textarea
          className="fakeInput area"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.replace(" *", "").toLowerCase()}`}
          disabled={disabled}
        />
      ) : select ? (
        <select
          className="fakeInput"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">
            Select {label.replace(" *", "")}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="fakeInput"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.replace(" *", "").toLowerCase()}`}
          disabled={disabled}
        />
      )}
      {helperText && <small style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>{helperText}</small>}
    </label>
  );
}

export function SectionTitle({ children }) {
  return <h3 className="sectionTitle">{children}</h3>;
}

export function InfoCard({ title, lines }) {
  return (
    <div className="infoCard">
      <h3>{title}</h3>
      {lines.map((l) => (
        <p key={l}>• {l}</p>
      ))}
    </div>
  );
}

export function Section({ title, data }) {
  return (
    <div>
      <h3>{title}</h3>
      {data.map((x) => {
        const [a, b] = x.split(": ");
        return (
          <p key={x}>
            <span>{a}</span>
            <b>{b}</b>
          </p>
        );
      })}
    </div>
  );
}

// ─── SuccessBlock ───────────────────────────────────────
export function SuccessBlock({ title, status }) {
  return (
    <>
      <div className="successBlock">
        <IconBox icon={CheckCircle2} tone="green" />
        <div>
          <h2>{title}</h2>
          <p>
            All 12 months have been selected and the calendar is now frozen. The
            calendar is ready for production and handover process.
          </p>
        </div>
        <div className="statusBox">
          <b>STATUS</b>
          <Badge>{status}</Badge>
          <small>Locked for Production</small>
        </div>
        <div className="facts">
          <span>Doctor Name <b>Dr. Rajesh Shah</b></span>
          <span>Calendar Year <b>2027</b></span>
          <span>Total Months <b>12</b></span>
          <span>Finalized By <b>Amit Sharma (MR)</b></span>
          <span>Finalized On <b>20 May 2025, 04:35 PM</b></span>
        </div>
      </div>
      <Panel title="What happens next?">
        <ListLine icon={CheckCircle2} title="Calendar Locked for Production" sub="The selected designs are locked and sent for production." />
        <ListLine icon={CheckCircle2} title="Calendar Handed Over" sub="Once printed calendars are received, please mark Input Given." />
        <ListLine icon={CheckCircle2} title="Change Request (If Required)" sub="Any changes can be made only through a change request process." />
      </Panel>
    </>
  );
}