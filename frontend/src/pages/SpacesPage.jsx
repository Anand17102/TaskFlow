import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/common/Feedback";
import { SpaceCard } from "../components/spaces/SpaceCard";
import { useTaskFlow } from "../context/useTaskFlow";
import "./SpacesPage.css";

function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const message = Object.values(data).flat().find((value) => typeof value === "string");
    if (message) return message;
  }
  return "Unable to delete space. Please try again.";
}

export function SpacesPage() {
  const { spaces, tasks, loading, loadErrors, removeSpace } = useTaskFlow();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async (space) => {
    if (!window.confirm(`Are you sure you want to delete the space "${space.name}"?`)) return;
    setError("");
    setMessage("");
    try {
      await removeSpace(space.id);
      setMessage("Space deleted successfully.");
    } catch (requestError) {
      console.error("Error deleting space:", requestError);
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><p className="eyebrow">Organize your work</p><h1>Spaces</h1></div>
        <Link className="button button-primary" to="/spaces/new">Create space</Link>
      </div>
      <ErrorMessage>{loadErrors.spaces}</ErrorMessage>
      <ErrorMessage>{error}</ErrorMessage>
      {message && <p className="feedback feedback-success" role="status">{message}</p>}
      {loading.spaces ? <Loading>Loading spaces...</Loading> : spaces.length === 0 ? (
        <section className="empty-state">
          <h2>No spaces yet</h2>
          <p>Create your first space to group related tasks and track progress.</p>
          <Link className="button button-primary" to="/spaces/new">Create space</Link>
        </section>
      ) : (
        <div className="space-grid">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} tasks={tasks} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
