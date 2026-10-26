import { getTaskSummary } from "../../utils/taskUtils";
import "./TaskSummary.css";

const items = [
  ["total", "Total tasks", "summary-total"],
  ["pending", "Pending", "summary-pending"],
  ["inProgress", "In progress", "summary-progress"],
  ["completed", "Completed", "summary-completed"],
  ["overdue", "Overdue", "summary-overdue"],
];

export function TaskSummary({ tasks }) {
  const summary = getTaskSummary(tasks);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Task overview</h2>
          <p>Track your progress at a glance.</p>
        </div>
      </div>
      <div className="summary-grid">
        {items.map(([key, label, className]) => (
          <article className={`summary-card ${className}`} key={key}>
            <span>{label}</span>
            <strong>{summary[key]}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
