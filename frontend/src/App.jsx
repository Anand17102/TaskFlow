import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { TaskFlowProvider } from "./context/TaskFlowContext";
import { DashboardPage } from "./pages/DashboardPage";
import { Register } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SpaceEditorPage } from "./pages/SpaceEditorPage";
import { SpacesPage } from "./pages/SpacesPage";
import { TaskEditorPage } from "./pages/TaskEditorPage";
import { TasksPage } from "./pages/TasksPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <TaskFlowProvider>
              <AppLayout />
            </TaskFlowProvider>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<TaskEditorPage />} />
          <Route path="/tasks/:id/edit" element={<TaskEditorPage editing />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/spaces/new" element={<SpaceEditorPage />} />
          <Route
            path="/spaces/:id/edit"
            element={<SpaceEditorPage editing />}
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
