import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/common/Feedback";
import { SpaceForm } from "../forms/SpaceForm";
import { useTaskFlow } from "../context/useTaskFlow";

function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const message = Object.values(data)
      .flat()
      .find((value) => typeof value === "string");
    if (message) return message;
  }
  return "Unable to save space. Please try again.";
}

export function SpaceEditorPage({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spaces, loading, loadErrors, saveSpace } = useTaskFlow();
  const space = editing
    ? spaces.find((item) => String(item.id) === id)
    : undefined;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await saveSpace(editing ? space.id : undefined, payload);
      navigate("/spaces", { replace: true });
    } catch (requestError) {
      console.error("Error saving space:", requestError);
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (editing && loading.spaces) return <Loading>Loading space...</Loading>;
  if (editing && loadErrors.spaces) {
    return (
      <div className="page-stack">
        <ErrorMessage>{loadErrors.spaces}</ErrorMessage>
        <Link to="/spaces">Back to spaces</Link>
      </div>
    );
  }
  if (editing && !space) {
    return (
      <section className="empty-state">
        <h1>Space not found</h1>
        <p>This space may have been deleted or the address may be incorrect.</p>
        <Link className="button button-primary" to="/spaces">
          Back to spaces
        </Link>
      </section>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Spaces</p>
          <h1>{editing ? "Edit space" : "Create a space"}</h1>
        </div>
      </div>
      <section className="panel editor-panel">
        <SpaceForm
          key={space?.id || "new-space"}
          space={space}
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/spaces")}
        />
      </section>
    </div>
  );
}
