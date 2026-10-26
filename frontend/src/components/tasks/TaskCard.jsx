import { getTaskDueState } from "../../utils/taskUtils";
import "./TaskCard.css";

export function TaskCard({ task, spaceName, onToggle, onEdit, onDelete }) {
  const dueState = getTaskDueState(task);
  const dueLabel = {
    overdue: "Overdue",
    "due-soon": "Due soon",
    completed: "Completed",
  }[dueState] || "Due date";

  return (
    <article className={`task-card ${task.status === "completed" ? "is-completed" : ""}`}>
      <div className="task-card-main">
        <header className="task-card-header">
          <div className="task-title-row">
            <h3>{task.title}</h3>
          </div>
          <div className="task-badges" aria-label="Task status and priority">
            <span className={`badge status-${task.status}`}>
              {task.status.replace("_", " ")}
            </span>
            <span className={`badge priority-${task.priority}`}>
              {task.priority} priority
            </span>
          </div>
        </header>
        <p className="task-description">
          {task.description || "No description provided."}
        </p>
        {(spaceName || task.due_date) && (
          <div className="task-card-meta">
            {spaceName && (
              <p className="task-space-label">
                <span className="task-meta-label">Space</span>
                <span className="task-meta-value">{spaceName}</span>
              </p>
            )}
            {task.due_date && (
              <p className={`task-due-date ${dueState}`}>
                <span className="task-meta-label">{dueLabel}</span>
                <span className="task-meta-value">{task.due_date}</span>
              </p>
            )}
          </div>
        )}
      </div>
      <footer className="task-card-footer">
        <label className="task-completion">
          <input
            type="checkbox"
            checked={task.status === "completed"}
            onChange={() =>
              onToggle(task, task.status === "completed" ? "pending" : "completed")
            }
          />
          <span>Mark as completed</span>
        </label>
        <div className="card-actions task-actions">
          <button className="button button-secondary" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="button button-danger" onClick={() => onDelete(task)}>
            Delete
          </button>
        </div>
      </footer>
    </article>
  );
}
