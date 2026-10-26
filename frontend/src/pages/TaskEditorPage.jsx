import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/common/Feedback";
import { TaskForm } from "../forms/TaskForm";
import { useTaskFlow } from "../context/useTaskFlow";

function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const message = Object.values(data).flat().find((value) => typeof value === "string");
    if (message) return message;
  }
  return "Unable to save task. Please try again.";
}

export function TaskEditorPage({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, spaces, loading, loadErrors, saveTask } = useTaskFlow();
  const task = editing
    ? tasks.find((item) => String(item.id) === id)
    : undefined;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await saveTask(editing ? task.id : undefined, payload);
      navigate("/tasks", { replace: true });
    } catch (requestError) {
      console.error("Error saving task:", requestError);
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (editing && loading.tasks) return <Loading>Loading task...</Loading>;
  if (editing && loadErrors.tasks) {
    return <div className="page-stack"><ErrorMessage>{loadErrors.tasks}</ErrorMessage><Link to="/tasks">Back to tasks</Link></div>;
  }
  if (editing && !task) {
    return (
      <section className="empty-state">
        <h1>Task not found</h1>
        <p>This task may have been deleted or the address may be incorrect.</p>
        <Link className="button button-primary" to="/tasks">Back to tasks</Link>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><p className="eyebrow">Tasks</p><h1>{editing ? "Edit task" : "Create a task"}</h1></div>
      </div>
      <section className="panel editor-panel">
        <TaskForm
          key={task?.id || "new-task"}
          initialValues={task}
          spaces={spaces}
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/tasks")}
        />
      </section>
    </div>
  );
}
