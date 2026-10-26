import assert from "node:assert/strict";
import { test } from "node:test";

import {
  filterAndSortTasks,
  getSpaceStats,
  getTaskDueState,
  getTaskSummary,
} from "./taskUtils.js";

test("getSpaceStats counts matching and completed tasks", () => {
  const stats = getSpaceStats(
    [
      { space: 4, status: "completed" },
      { space: "4", status: "pending" },
      { space: 5, status: "completed" },
      null,
    ],
    "4",
  );

  assert.deepEqual(stats, {
    total: 2,
    completed: 1,
    remaining: 1,
    progress: 50,
  });
});

test("getSpaceStats returns zero progress for an empty space", () => {
  assert.deepEqual(getSpaceStats([], 4), {
    total: 0,
    completed: 0,
    remaining: 0,
    progress: 0,
  });
});

test("getTaskSummary counts statuses and excludes completed overdue tasks", () => {
  const summary = getTaskSummary([
    { status: "pending", due_date: "2000-01-01" },
    { status: "in_progress" },
    { status: "completed", due_date: "2000-01-01" },
    null,
  ]);

  assert.deepEqual(summary, {
    total: 3,
    pending: 1,
    inProgress: 1,
    completed: 1,
    overdue: 1,
  });
});

test("getTaskDueState handles missing, completed, and overdue dates", () => {
  assert.equal(getTaskDueState({ status: "pending" }), "");
  assert.equal(
    getTaskDueState({ status: "completed", due_date: "2000-01-01" }),
    "completed",
  );
  assert.equal(
    getTaskDueState({ status: "pending", due_date: "2000-01-01" }),
    "overdue",
  );
});

test("filterAndSortTasks filters by text, status, priority, and space", () => {
  const tasks = [
    {
      id: 1,
      title: "Write report",
      description: "Quarterly",
      status: "pending",
      priority: "high",
      space: 2,
    },
    {
      id: 2,
      title: "Review report",
      description: "Annual",
      status: "completed",
      priority: "high",
      space: null,
    },
    {
      id: 3,
      title: "Plan launch",
      description: "",
      status: "pending",
      priority: "low",
      space: 2,
    },
  ];
  const filters = {
    search: " report ",
    status: "pending",
    priority: "high",
    space: "2",
    sort: "title",
  };

  assert.deepEqual(
    filterAndSortTasks(tasks, filters).map((task) => task.id),
    [1],
  );
});

test("filterAndSortTasks sorts by priority and puts undated tasks last", () => {
  const tasks = [
    { id: 1, title: "Low", priority: "low", due_date: "2025-01-01" },
    { id: 2, title: "High", priority: "high", due_date: null },
    { id: 3, title: "Medium", priority: "medium", due_date: "2024-01-01" },
  ];

  assert.deepEqual(
    filterAndSortTasks(tasks, {
      search: "",
      status: "all",
      priority: "all",
      space: null,
      sort: "priority",
    }).map((task) => task.id),
    [2, 3, 1],
  );
  assert.deepEqual(
    filterAndSortTasks(tasks, {
      search: "",
      status: "all",
      priority: "all",
      space: null,
      sort: "due_date",
    }).map((task) => task.id),
    [3, 1, 2],
  );
});
