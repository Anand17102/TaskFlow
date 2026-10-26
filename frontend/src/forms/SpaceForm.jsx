import { useState } from "react";
import "./FormStyles.css";

export function SpaceForm({
  space,
  submitting,
  error,
  onSubmit,
  onCancel,
}) {
  const [coverImage, setCoverImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const payload = new FormData();
    payload.append("name", values.get("name"));
    payload.append("description", values.get("description"));
    if (coverImage) payload.append("cover_image", coverImage);
    onSubmit(payload);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {space?.cover_image && (
        <img
          className="space-form-preview form-field-wide"
          src={space.cover_image.startsWith("http")
            ? space.cover_image
            : `http://127.0.0.1:8000${space.cover_image}`}
          alt={`${space.name} current cover`}
        />
      )}
      <label className="form-field form-field-wide" htmlFor="space-name">
        Space name
        <input
          id="space-name"
          name="name"
          defaultValue={space?.name || ""}
          maxLength={200}
          required
        />
      </label>
      <label className="form-field form-field-wide" htmlFor="space-description">
        Description
        <textarea
          id="space-description"
          name="description"
          defaultValue={space?.description || ""}
          rows={4}
        />
      </label>
      <label className="form-field form-field-wide" htmlFor="space-cover">
        Cover image
        <input
          id="space-cover"
          type="file"
          accept="image/*"
          onChange={(event) => setCoverImage(event.target.files?.[0] || null)}
        />
      </label>
      {coverImage && <p className="form-field-wide">Selected image: {coverImage.name}</p>}
      {error && <p className="feedback feedback-error form-field-wide" role="alert">{error}</p>}
      <div className="form-actions form-field-wide">
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save space"}
        </button>
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
