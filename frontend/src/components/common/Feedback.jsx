export function ErrorMessage({ children, role = "alert" }) {
  if (!children) return null;
  return <p className="feedback feedback-error" role={role}>{children}</p>;
}

export function Loading({ children = "Loading..." }) {
  return <p className="feedback" role="status">{children}</p>;
}
