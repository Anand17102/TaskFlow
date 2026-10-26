import { Link } from "react-router-dom";
import { ErrorMessage, Loading } from "../components/common/Feedback";
import { TaskSummary } from "../components/dashboard/TaskSummary";
import { useTaskFlow } from "../context/useTaskFlow";
import "./DashboardPage.css";

export function DashboardPage() {
  const { tasks, profile, loading, loadErrors } = useTaskFlow();
  const displayName = profile?.first_name || profile?.username || "there";

  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h1>
            Welcome back, <span className="welcome-name">{displayName}</span>.
          </h1>
          <p>Ready to accomplish something great today?</p>
        </div>
        <Link className="button button-primary" to="/tasks/new">Create a task</Link>
      </section>
      {loading.tasks ? <Loading>Loading your tasks...</Loading> : (
        <>
          <ErrorMessage>{loadErrors.tasks}</ErrorMessage>
          <TaskSummary tasks={tasks} />
        </>
      )}
      <section className="panel quick-links">
        <div className="section-heading">
          <div>
            <h2>Keep things moving</h2>
            <p>Jump to the work you want to manage.</p>
          </div>
        </div>
        <div className="quick-link-grid">
          <Link to="/tasks"><strong>View all tasks</strong><span>Search, filter, sort, and update your tasks.</span></Link>
          <Link to="/spaces"><strong>Manage spaces</strong><span>Organize projects and track their progress.</span></Link>
          <Link to="/profile"><strong>View profile</strong><span>Update your account details and photo.</span></Link>
        </div>
      </section>
    </div>
  );
}
