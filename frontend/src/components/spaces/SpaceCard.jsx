import { Link } from "react-router-dom";
import { getSpaceStats } from "../../utils/taskUtils";
import { SpaceProgress } from "./SpaceProgress";
import "./SpaceCard.css";

const MEDIA_BASE_URL = "http://127.0.0.1:8000";

function getImageUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${MEDIA_BASE_URL}${url}`;
}

export function SpaceCard({ space, tasks, onDelete }) {
  const stats = getSpaceStats(tasks, space.id);

  return (
    <article className="space-card">
      {space.cover_image ? (
        <img
          className="space-cover"
          src={getImageUrl(space.cover_image)}
          alt={`${space.name} cover`}
        />
      ) : (
        <div className="space-cover space-cover-placeholder" aria-hidden="true">
          T
        </div>
      )}
      <div className="space-card-content">
        <div className="space-title-row">
          <h3>{space.name}</h3>
          {stats.total > 0 && stats.completed === stats.total && (
            <span className="badge badge-completed">All tasks completed</span>
          )}
        </div>
        <p className="space-description">
          {space.description || "No description provided."}
        </p>
        <div className="space-stats">
          <div><span>Total</span><strong>{stats.total}</strong></div>
          <div><span>Completed</span><strong>{stats.completed}</strong></div>
          <div><span>Remaining</span><strong>{stats.remaining}</strong></div>
        </div>
        <SpaceProgress name={space.name} progress={stats.progress} />
        <div className="card-actions">
          <Link className="button button-secondary" to={`/tasks?space=${space.id}`}>
            View tasks
          </Link>
          <Link className="button button-secondary" to={`/spaces/${space.id}/edit`}>
            Edit
          </Link>
          <button className="button button-danger" onClick={() => onDelete(space)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
