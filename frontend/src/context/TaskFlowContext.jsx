import { useCallback, useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
} from "../api/auth";
import { TaskFlowContext } from "./taskFlowContextValue";
import {
  createTask as requestCreateTask,
  deleteTask as requestDeleteTask,
  getTasks,
  updateTask as requestUpdateTask,
} from "../api/tasks";
import {
  createSpace as requestCreateSpace,
  deleteSpace as requestDeleteSpace,
  getSpaces,
  updateSpace as requestUpdateSpace,
} from "../api/spaces";

export function TaskFlowProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState({
    tasks: true,
    spaces: true,
    profile: true,
  });
  const [loadErrors, setLoadErrors] = useState({});

  const loadCollection = useCallback(async (key, request, setter) => {
    try {
      setter(await request());
      setLoadErrors((previous) => ({ ...previous, [key]: "" }));
    } catch (error) {
      console.error(`Unable to load ${key}:`, error);
      setLoadErrors((previous) => ({
        ...previous,
        [key]:
          error.response?.data?.detail ||
          `Unable to load ${key}. Please try again.`,
      }));
    } finally {
      setLoading((previous) => ({ ...previous, [key]: false }));
    }
  }, []);

  useEffect(() => {
    loadCollection("tasks", getTasks, setTasks);
    loadCollection("spaces", getSpaces, setSpaces);
    loadCollection("profile", getUserProfile, setProfile);
  }, [loadCollection]);

  const saveTask = async (id, payload) => {
    const task = id === undefined
      ? await requestCreateTask(payload)
      : await requestUpdateTask(id, payload);

    setTasks((previous) =>
      id === undefined
        ? [task, ...previous.filter(Boolean)]
        : previous.map((item) => (item.id === id ? task : item)),
    );
    return task;
  };

  const removeTask = async (id) => {
    await requestDeleteTask(id);
    setTasks((previous) => previous.filter((task) => task?.id !== id));
  };

  const setTaskStatus = async (task, status) => {
    const updatedTask = await requestUpdateTask(task.id, { status });
    setTasks((previous) =>
      previous.map((item) => (item.id === task.id ? updatedTask : item)),
    );
    return updatedTask;
  };

  const saveSpace = async (id, formData) => {
    const space = id === undefined
      ? await requestCreateSpace(formData)
      : await requestUpdateSpace(id, formData);

    setSpaces((previous) =>
      id === undefined
        ? [space, ...previous]
        : previous.map((item) => (item.id === id ? space : item)),
    );
    return space;
  };

  const removeSpace = async (id) => {
    await requestDeleteSpace(id);
    setSpaces((previous) => previous.filter((space) => space.id !== id));
    setTasks((previous) =>
      previous.filter(
        (task) => !task?.space || Number(task.space) !== Number(id),
      ),
    );
  };

  const saveProfile = async (formData) => {
    const updatedProfile = await updateUserProfile(formData);
    setProfile(updatedProfile);
    return updatedProfile;
  };

  const value = {
    tasks,
    spaces,
    profile,
    loading,
    loadErrors,
    saveTask,
    removeTask,
    setTaskStatus,
    saveSpace,
    removeSpace,
    saveProfile,
  };

  return (
    <TaskFlowContext.Provider value={value}>
      {children}
    </TaskFlowContext.Provider>
  );
}
