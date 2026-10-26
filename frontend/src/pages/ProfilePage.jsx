import { useState } from "react";
import { ErrorMessage, Loading } from "../components/common/Feedback";
import { ProfileForm } from "../forms/ProfileForm";
import { useTaskFlow } from "../context/useTaskFlow";
import "./ProfilePage.css";

const MEDIA_BASE_URL = "http://127.0.0.1:8000";

function getImageUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${MEDIA_BASE_URL}${url}`;
}

export function ProfilePage() {
  const { profile, loading, loadErrors, saveProfile } = useTaskFlow();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await saveProfile(payload);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      console.error("Error updating profile:", requestError);
      const data = requestError.response?.data;
      const validation = data && typeof data === "object"
        ? Object.values(data).flat().find((value) => typeof value === "string")
        : null;
      setError(data?.detail || validation || "Unable to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading.profile) return <Loading>Loading profile...</Loading>;
  if (loadErrors.profile || !profile) {
    return <div className="page-stack"><ErrorMessage>{loadErrors.profile || "Unable to load your profile."}</ErrorMessage></div>;
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div><p className="eyebrow">Your account</p><h1>Profile</h1></div>
        {!editing && (
          <button className="button button-primary" onClick={() => { setEditing(true); setMessage(""); }}>
            Edit profile
          </button>
        )}
      </div>
      {message && <p className="feedback feedback-success" role="status">{message}</p>}
      <section className="panel profile-panel">
        {editing ? (
          <ProfileForm
            key={profile.username}
            profile={profile}
            submitting={submitting}
            error={error}
            onSubmit={handleSubmit}
            onCancel={() => { setEditing(false); setError(""); }}
          />
        ) : (
          <div className="profile-view">
            {profile.profile_image ? (
              <img className="profile-avatar" src={getImageUrl(profile.profile_image)} alt={`${profile.username} profile`} />
            ) : (
              <div className="profile-avatar profile-avatar-placeholder" aria-hidden="true">
                {(profile.username || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <dl className="profile-details">
              <div><dt>Username</dt><dd>{profile.username}</dd></div>
              <div><dt>Email</dt><dd>{profile.email || "Not provided"}</dd></div>
              <div><dt>Name</dt><dd>{[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Not provided"}</dd></div>
            </dl>
          </div>
        )}
      </section>
    </div>
  );
}
