import "./SpaceProgress.css";

export function SpaceProgress({ name, progress }) {
  return (
    <div className="space-progress">
      <div className="space-progress-heading">
        <span>Progress</span>
        <strong>{progress}%</strong>
      </div>
      <div
        className="space-progress-track"
        role="progressbar"
        aria-label={`${name} completion progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="space-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
