import "./FormStyles.css";

const EMPTY_TASK = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  due_date: "",
  space: "",
};

export function TaskForm({
  initialValues = EMPTY_TASK,
  spaces,
  submitting,
  error,
  onSubmit,
  onCancel,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSubmit({
      title: data.get("title"),
      description: data.get("description"),
      status: data.get("status"),
      priority: data.get("priority"),
      due_date: data.get("due_date") || null,
      space: data.get("space") || null,
    });
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="form-field form-field-wide" htmlFor="task-title">
        Title
        <input
          id="task-title"
          name="title"
          defaultValue={initialValues.title || ""}
          required
          maxLength={200}
        />
      </label>
      <label className="form-field form-field-wide" htmlFor="task-description">
        Description
        <textarea
          id="task-description"
          name="description"
          defaultValue={initialValues.description || ""}
          rows={4}
        />
      </label>
      <label className="form-field" htmlFor="task-status">
        Status
        <select id="task-status" name="status" defaultValue={initialValues.status || "pending"}>
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <label className="form-field" htmlFor="task-priority">
        Priority
        <select id="task-priority" name="priority" defaultValue={initialValues.priority || "medium"}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label className="form-field" htmlFor="task-due-date">
        Due date
        <input
          id="task-due-date"
          type="date"
          name="due_date"
          defaultValue={initialValues.due_date || ""}
        />
      </label>
      <label className="form-field" htmlFor="task-space">
        Space
        <select
          id="task-space"
          name="space"
          defaultValue={initialValues.space || ""}
        >
          <option value="">No space</option>
          {spaces.map((space) => (
            <option key={space.id} value={space.id}>{space.name}</option>
          ))}
        </select>
      </label>
      {error && <p className="feedback feedback-error form-field-wide" role="alert">{error}</p>}
      <div className="form-actions form-field-wide">
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save task"}
        </button>
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
