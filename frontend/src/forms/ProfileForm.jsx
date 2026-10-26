import { useState } from "react";
import "./FormStyles.css";

export function ProfileForm({ profile, submitting, error, onSubmit, onCancel }) {
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const payload = new FormData();
    payload.append("username", values.get("username"));
    payload.append("first_name", values.get("first_name"));
    payload.append("last_name", values.get("last_name"));
    if (profileImage) payload.append("profile_image", profileImage);
    onSubmit(payload);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="form-field" htmlFor="profile-username">
        Username
        <input
          id="profile-username"
          name="username"
          defaultValue={profile.username || ""}
          required
        />
      </label>
      <label className="form-field" htmlFor="profile-first-name">
        First name
        <input
          id="profile-first-name"
          name="first_name"
          defaultValue={profile.first_name || ""}
        />
      </label>
      <label className="form-field" htmlFor="profile-last-name">
        Last name
        <input
          id="profile-last-name"
          name="last_name"
          defaultValue={profile.last_name || ""}
        />
      </label>
      <label className="form-field form-field-wide" htmlFor="profile-image">
        Profile image
        <input
          id="profile-image"
          type="file"
          accept="image/*"
          onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
        />
      </label>
      {profileImage && <p className="form-field-wide">Selected image: {profileImage.name}</p>}
      {error && <p className="feedback feedback-error form-field-wide" role="alert">{error}</p>}
      <div className="form-actions form-field-wide">
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save profile"}
        </button>
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
