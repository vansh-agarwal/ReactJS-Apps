import { useState, useRef } from "react";
import "./App.css";

const PRIORITIES = ["High", "Medium", "Low"];

const PRIORITY_META = {
  High: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", icon: "🔴" },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", icon: "🟡" },
  Low: { color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.3)", icon: "🟢" },
};

const seedTasks = [
  { id: 1, title: "Fix critical login bug", priority: "High", done: false },
  { id: 2, title: "Deploy to production server", priority: "High", done: false },
  { id: 3, title: "Write unit tests for API", priority: "Medium", done: false },
  { id: 4, title: "Update project documentation", priority: "Medium", done: true },
  { id: 5, title: "Team standup meeting notes", priority: "Low", done: false },
  { id: 6, title: "Review open pull requests", priority: "Medium", done: false },
  { id: 7, title: "Upgrade npm dependencies", priority: "Low", done: false },
];

export default function App() {
  const [tasks, setTasks] = useState(seedTasks);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const nextId = useRef(8);

  // Drag state
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: nextId.current++, title: input.trim(), priority, done: false }]);
    setInput("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const handleDragStart = (e, id) => { dragItem.current = id; e.dataTransfer.effectAllowed = "move"; };
  const handleDragEnter = (e, id) => { dragOver.current = id; e.preventDefault(); };
  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e, dropPriority) => {
    e.preventDefault();
    if (dragItem.current === null) return;
    setTasks((prev) => {
      const draggedTask = prev.find((t) => t.id === dragItem.current);
      if (!draggedTask) return prev;
      // Drop onto a priority group → move to that group at the end
      if (dragOver.current === null || dragOver.current === dragItem.current) {
        if (draggedTask.priority !== dropPriority) {
          dragItem.current = null; dragOver.current = null;
          return prev.map((t) => t.id === draggedTask.id ? { ...t, priority: dropPriority } : t);
        }
        dragItem.current = null; dragOver.current = null;
        return prev;
      }
      // Reorder within group
      const withoutDragged = prev.filter((t) => t.id !== dragItem.current);
      const dropIndex = withoutDragged.findIndex((t) => t.id === dragOver.current);
      const updated = [...withoutDragged];
      updated.splice(dropIndex, 0, { ...draggedTask, priority: dropPriority });
      dragItem.current = null; dragOver.current = null;
      return updated;
    });
  };

  const handleDragEnd = () => { dragItem.current = null; dragOver.current = null; };

  const visible = tasks.filter((t) =>
    filter === "All" ? true : filter === "Done" ? t.done : !t.done
  );

  const counts = {
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
    pending: tasks.filter((t) => !t.done).length,
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <span className="header-icon">📋</span>
          <h1>Task Scheduler</h1>
        </div>
        <div className="header-stats">
          <div className="stat"><span className="stat-val">{counts.total}</span><span className="stat-label">Total</span></div>
          <div className="stat green"><span className="stat-val">{counts.done}</span><span className="stat-label">Done</span></div>
          <div className="stat yellow"><span className="stat-val">{counts.pending}</span><span className="stat-label">Pending</span></div>
        </div>
      </header>

      {/* ADD TASK */}
      <div className="card add-card">
        <form onSubmit={addTask} className="add-form">
          <input
            className="task-input"
            type="text"
            placeholder="New task description..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="priority-select">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                className={`priority-btn ${priority === p ? "active" : ""}`}
                style={{ "--pc": PRIORITY_META[p].color, "--pb": PRIORITY_META[p].bg, "--pbo": PRIORITY_META[p].border }}
                onClick={() => setPriority(p)}
              >
                {PRIORITY_META[p].icon} {p}
              </button>
            ))}
          </div>
          <button type="submit" className="btn-add">Add Task</button>
        </form>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        {["All", "Pending", "Done"].map((f) => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {/* TASK GROUPS */}
      <div className="groups">
        {PRIORITIES.map((p) => {
          const group = visible.filter((t) => t.priority === p);
          const meta = PRIORITY_META[p];
          return (
            <div
              key={p}
              className="group"
              style={{ "--gc": meta.color, "--gb": meta.bg, "--gbo": meta.border }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, p)}
            >
              <div className="group-header">
                <span>{meta.icon} {p} Priority</span>
                <span className="group-count">{group.length}</span>
              </div>
              <div className="task-list">
                {group.length === 0 ? (
                  <div className="empty-group">Drop tasks here or add one above</div>
                ) : (
                  group.map((task) => (
                    <div
                      key={task.id}
                      className={`task-item ${task.done ? "task-done" : ""}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnter={(e) => handleDragEnter(e, task.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <span className="drag-handle">⠿</span>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleDone(task.id)}
                        className="task-checkbox"
                      />
                      <span className="task-title">{task.title}</span>
                      <button className="btn-delete-task" onClick={() => deleteTask(task.id)}>✕</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
