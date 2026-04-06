import { useState } from "react";
import "./App.css";

const STEPS = ["Personal Details", "Address Details", "Review & Submit"];

const emptyData = {
  firstName: "", lastName: "", email: "", phone: "", dob: "",
  street: "", city: "", state: "", pincode: "", country: "India",
};

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const isValidPhone = (p) => /^[6-9]\d{9}$/.test(p);
const isValidPin = (p) => /^\d{6}$/.test(p);

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(emptyData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const change = (field) => (e) => {
    setData({ ...data, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" });
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!data.firstName.trim()) e.firstName = "Required";
      if (!data.lastName.trim()) e.lastName = "Required";
      if (!data.email.trim()) e.email = "Required";
      else if (!isValidEmail(data.email)) e.email = "Invalid email";
      if (!data.phone.trim()) e.phone = "Required";
      else if (!isValidPhone(data.phone)) e.phone = "Invalid phone (10 digits, starts 6-9)";
      if (!data.dob) e.dob = "Required";
    }
    if (step === 1) {
      if (!data.street.trim()) e.street = "Required";
      if (!data.city.trim()) e.city = "Required";
      if (!data.state.trim()) e.state = "Required";
      if (!data.pincode.trim()) e.pincode = "Required";
      else if (!isValidPin(data.pincode)) e.pincode = "6-digit PIN required";
      if (!data.country.trim()) e.country = "Required";
    }
    return e;
  };

  const next = () => {
    const errs = validateStep();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(step + 1);
  };

  const back = () => { setErrors({}); setStep(step - 1); };
  const submit = () => setSubmitted(true);
  const reset = () => { setData(emptyData); setStep(0); setSubmitted(false); setErrors({}); };

  if (submitted) {
    return (
      <div className="app">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Registration Complete!</h2>
          <p>Welcome, <strong>{data.firstName} {data.lastName}</strong>!</p>
          <p className="sub">A confirmation will be sent to <em>{data.email}</em></p>
          <button className="btn btn-primary" onClick={reset}>Register Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="form-container">
        <div className="form-header">
          <h1>📝 Registration</h1>
          <p className="sub-header">Complete all steps to register</p>
        </div>

        {/* STEPPER */}
        <div className="stepper">
          {STEPS.map((label, i) => (
            <div key={i} className={`step-item ${i < step ? "done" : i === step ? "active" : ""}`}>
              <div className="step-circle">{i < step ? "✓" : i + 1}</div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* STEP CONTENT */}
        <div className="step-content">
          {step === 0 && (
            <>
              <h2>👤 Personal Details</h2>
              <div className="grid-2">
                <Field label="First Name" value={data.firstName} onChange={change("firstName")} error={errors.firstName} placeholder="Aarav" />
                <Field label="Last Name" value={data.lastName} onChange={change("lastName")} error={errors.lastName} placeholder="Sharma" />
              </div>
              <Field label="Email Address" type="email" value={data.email} onChange={change("email")} error={errors.email} placeholder="aarav@example.com" />
              <div className="grid-2">
                <Field label="Phone Number" value={data.phone} onChange={change("phone")} error={errors.phone} placeholder="9876543210" />
                <Field label="Date of Birth" type="date" value={data.dob} onChange={change("dob")} error={errors.dob} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2>🏠 Address Details</h2>
              <Field label="Street / House No." value={data.street} onChange={change("street")} error={errors.street} placeholder="42, MG Road" />
              <div className="grid-2">
                <Field label="City" value={data.city} onChange={change("city")} error={errors.city} placeholder="Mumbai" />
                <Field label="State" value={data.state} onChange={change("state")} error={errors.state} placeholder="Maharashtra" />
              </div>
              <div className="grid-2">
                <Field label="PIN Code" value={data.pincode} onChange={change("pincode")} error={errors.pincode} placeholder="400001" />
                <Field label="Country" value={data.country} onChange={change("country")} error={errors.country} placeholder="India" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>🔍 Review & Submit</h2>
              <div className="review-grid">
                <ReviewSection title="Personal Details">
                  <ReviewRow label="Full Name" value={`${data.firstName} ${data.lastName}`} />
                  <ReviewRow label="Email" value={data.email} />
                  <ReviewRow label="Phone" value={data.phone} />
                  <ReviewRow label="Date of Birth" value={data.dob} />
                </ReviewSection>
                <ReviewSection title="Address">
                  <ReviewRow label="Street" value={data.street} />
                  <ReviewRow label="City" value={data.city} />
                  <ReviewRow label="State" value={data.state} />
                  <ReviewRow label="PIN Code" value={data.pincode} />
                  <ReviewRow label="Country" value={data.country} />
                </ReviewSection>
              </div>
            </>
          )}
        </div>

        {/* NAV */}
        <div className="form-nav">
          {step > 0 && <button className="btn btn-ghost" onClick={back}>← Back</button>}
          {step < 2 ? (
            <button className="btn btn-primary" onClick={next}>Next →</button>
          ) : (
            <button className="btn btn-submit" onClick={submit}>Submit Registration 🚀</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, error, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div className="review-section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="review-row">
      <span className="review-label">{label}</span>
      <span className="review-value">{value || "—"}</span>
    </div>
  );
}
