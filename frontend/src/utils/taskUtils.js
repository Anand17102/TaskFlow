export function getSpaceStats(tasks, spaceId) {
  const spaceTasks = tasks.filter(
    (task) => Number(task?.space) === Number(spaceId),
  );
  const completed = spaceTasks.filter(
    (task) => task.status === "completed",
  ).length;
  const total = spaceTasks.length;

  return {
    total,
    completed,
    remaining: total - completed,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getTaskSummary(tasks) {
  const validTasks = tasks.filter(Boolean);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    total: validTasks.length,
    pending: validTasks.filter((task) => task.status === "pending").length,
    inProgress: validTasks.filter((task) => task.status === "in_progress").length,
    completed: validTasks.filter((task) => task.status === "completed").length,
    overdue: validTasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.due_date &&
        new Date(`${task.due_date}T00:00:00`) < today,
    ).length,
  };
}

export function getTaskDueState(task) {
  if (!task.due_date) return "";
  if (task.status === "completed") return "completed";

  const dueDate = new Date(`${task.due_date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dueDate < today) return "overdue";
  const dueSoon = new Date(today);
  dueSoon.setDate(dueSoon.getDate() + 3);
  return dueDate <= dueSoon ? "due-soon" : "";
}

export function filterAndSortTasks(tasks, filters) {
  const search = filters.search.trim().toLowerCase();
  const filtered = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      (task.description || "").toLowerCase().includes(search);
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;
    const matchesSpace =
      filters.space === null
        ? true
        : filters.space === "none"
          ? !task.space
          : Number(task.space) === Number(filters.space);

    return matchesSearch && matchesStatus && matchesPriority && matchesSpace;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "due_date") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (filters.sort === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (filters.sort === "title") return a.title.localeCompare(b.title);
    return b.id - a.id;
  });
}
