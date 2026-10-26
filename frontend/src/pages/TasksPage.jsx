import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/common/Feedback";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { useTaskFlow } from "../context/useTaskFlow";
import { filterAndSortTasks } from "../utils/taskUtils";
import "./TasksPage.css";

function getErrorMessage(error, fallback) {
  const data = error.response?.data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const message = Object.values(data).flat().find((value) => typeof value === "string");
    if (message) return message;
  }
  return fallback;
}

export function TasksPage() {
  const { tasks, spaces, loading, loadErrors, removeTask, setTaskStatus } = useTaskFlow();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialSpace = searchParams.get("space");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    space: initialSpace ? Number(initialSpace) : null,
    sort: "newest",
  });
  const [actionError, setActionError] = useState("");
  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks.filter(Boolean), filters),
    [tasks, filters],
  );

  const updateFilter = (name, value) =>
    setFilters((previous) => ({ ...previous, [name]: value }));

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    setActionError("");
    try {
      await removeTask(task.id);
    } catch (error) {
      console.error("Error deleting task:", error);
      setActionError(getErrorMessage(error, "Unable to delete task. Please try again."));
    }
  };

  const handleToggle = async (task, status) => {
    setActionError("");
    try {
      await setTaskStatus(task, status);
    } catch (error) {
      console.error("Failed to update task status:", error);
      setActionError(getErrorMessage(error, "Could not update task status. Please try again."));
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><p className="eyebrow">Stay on top of your work</p><h1>Tasks</h1></div>
        <Link className="button button-primary" to="/tasks/new">Create task</Link>
      </div>
      <TaskFilters
        spaces={spaces}
        filters={filters}
        onChange={updateFilter}
        onClear={() => setFilters({
          search: "",
          status: "all",
          priority: "all",
          space: null,
          sort: "newest",
        })}
      />
      <p className="results-count">
        Showing {filteredTasks.length} of {tasks.filter(Boolean).length} tasks.
      </p>
      <ErrorMessage>{loadErrors.tasks}</ErrorMessage>
      <ErrorMessage>{actionError}</ErrorMessage>
      {loading.tasks ? <Loading>Loading tasks...</Loading> : filteredTasks.length === 0 ? (
        <section className="empty-state">
          <h2>{tasks.length ? "No matching tasks" : "No tasks yet"}</h2>
          <p>{tasks.length ? "Try adjusting your search or filters." : "Create your first task to get started."}</p>
          {tasks.length === 0 && <Link className="button button-primary" to="/tasks/new">Create task</Link>}
        </section>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              spaceName={spaces.find((space) => Number(space.id) === Number(task.space))?.name}
              onToggle={handleToggle}
              onEdit={(selectedTask) => navigate(`/tasks/${selectedTask.id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
