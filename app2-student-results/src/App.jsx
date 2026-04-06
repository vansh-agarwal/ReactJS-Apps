import { useState } from "react";
import "./App.css";

const SUBJECTS = ["Mathematics", "Science", "English", "History", "Computer"];

const getGrade = (avg) => {
  if (avg >= 90) return { grade: "A+", color: "#48bb78" };
  if (avg >= 80) return { grade: "A", color: "#68d391" };
  if (avg >= 70) return { grade: "B", color: "#90cdf4" };
  if (avg >= 60) return { grade: "C", color: "#f6ad55" };
  if (avg >= 50) return { grade: "D", color: "#fc8181" };
  return { grade: "F", color: "#f56565" };
};

const emptyForm = { name: "", marks: SUBJECTS.map(() => "") };

export default function App() {
  const [students, setStudents] = useState([
    { id: 1, name: "Aarav Sharma", marks: [88, 76, 92, 65, 95] },
    { id: 2, name: "Priya Patel", marks: [55, 48, 62, 70, 45] },
    { id: 3, name: "Rohan Iyer", marks: [78, 82, 74, 88, 91] },
    { id: 4, name: "Sneha Gupta", marks: [44, 52, 38, 60, 50] },
  ]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [threshold, setThreshold] = useState(60);
  const [searchTerm, setSearchTerm] = useState("");
  const [nextId, setNextId] = useState(5);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    form.marks.forEach((m, i) => {
      if (m === "" || isNaN(m) || Number(m) < 0 || Number(m) > 100)
        e[`mark${i}`] = "0–100";
    });
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStudents([
      ...students,
      { id: nextId, name: form.name.trim(), marks: form.marks.map(Number) },
    ]);
    setNextId(nextId + 1);
    setForm(emptyForm);
    setErrors({});
  };

  const handleDelete = (id) => setStudents(students.filter((s) => s.id !== id));

  const processed = students
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((s) => {
      const total = s.marks.reduce((a, b) => a + b, 0);
      const avg = total / s.marks.length;
      const { grade, color } = getGrade(avg);
      const pass = avg >= 40 && s.marks.every((m) => m >= 30);
      return { ...s, total, avg: avg.toFixed(1), grade, gradeColor: color, pass };
    });

  const aboveThreshold = students.filter((s) => {
    const avg = s.marks.reduce((a, b) => a + b, 0) / s.marks.length;
    return avg >= threshold;
  });

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <span className="header-icon">🎓</span>
          <h1>Student Result Analyzer</h1>
        </div>
        <div className="header-stats">
          <div className="stat"><span className="stat-val">{students.length}</span><span className="stat-label">Students</span></div>
          <div className="stat accent2"><span className="stat-val">{aboveThreshold.length}</span><span className="stat-label">Above {threshold}% avg</span></div>
        </div>
      </header>

      <div className="content">
        {/* ADD FORM */}
        <div className="card">
          <h2>➕ Add Student</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label>Student Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="marks-grid">
              {SUBJECTS.map((sub, i) => (
                <div className="field" key={sub}>
                  <label>{sub}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.marks[i]}
                    onChange={(e) => {
                      const m = [...form.marks];
                      m[i] = e.target.value;
                      setForm({ ...form, marks: m });
                      setErrors({ ...errors, [`mark${i}`]: "" });
                    }}
                    placeholder="/100"
                  />
                  {errors[`mark${i}`] && <span className="error">{errors[`mark${i}`]}</span>}
                </div>
              ))}
            </div>
            <button type="submit" className="btn btn-primary">Add Student</button>
          </form>
        </div>

        {/* FILTER & SEARCH */}
        <div className="card filter-card">
          <div className="filter-row">
            <div className="field search-field">
              <label>🔍 Search</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="field">
              <label>🎯 Avg Threshold: {threshold}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>
          <p className="threshold-info">
            Showing {aboveThreshold.length} student{aboveThreshold.length !== 1 ? "s" : ""} scoring above {threshold}% average.
          </p>
        </div>

        {/* RESULTS TABLE */}
        <div className="card">
          <h2>📊 Results</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  {SUBJECTS.map((s) => <th key={s}>{s}</th>)}
                  <th>Total</th>
                  <th>Avg</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {processed.map((s) => (
                  <tr key={s.id} className={s.avg < threshold ? "below-threshold" : ""}>
                    <td className="name-cell">{s.name}</td>
                    {s.marks.map((m, i) => (
                      <td key={i} className={m < 30 ? "mark-fail" : "mark-ok"}>{m}</td>
                    ))}
                    <td><strong>{s.total}</strong></td>
                    <td>{s.avg}%</td>
                    <td><span className="grade-badge" style={{ color: s.gradeColor, borderColor: s.gradeColor }}>{s.grade}</span></td>
                    <td>
                      <span className={`status-badge ${s.pass ? "pass" : "fail"}`}>
                        {s.pass ? "PASS" : "FAIL"}
                      </span>
                    </td>
                    <td><button className="btn btn-sm btn-delete" onClick={() => handleDelete(s.id)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
