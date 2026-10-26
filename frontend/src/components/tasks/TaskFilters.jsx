import "./TaskFilters.css";

export function TaskFilters({ spaces, filters, onChange, onClear }) {
  const activeFilterCount = [
    filters.search.trim() !== "",
    filters.status !== "all",
    filters.priority !== "all",
    filters.space !== null,
    filters.sort !== "newest",
  ].filter(Boolean).length;

  return (
    <section className="panel task-filters" aria-labelledby="filter-heading">
      <div className="section-heading task-filters-heading">
        <div>
          <span className="filter-heading-icon" aria-hidden="true">⌕</span>
          <h2 id="filter-heading">Find your tasks</h2>
          <p>Search and refine your task list.</p>
        </div>
        {activeFilterCount > 0 && (
          <span className="active-filter-count" aria-live="polite">
            {activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}
          </span>
        )}
      </div>
      <div className="filter-grid">
        <label className="filter-search">
          <span>Search</span>
          <input
            type="search"
            placeholder="Title or description"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
          />
        </label>
        <label>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select
            value={filters.priority}
            onChange={(event) => onChange("priority", event.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          <span>Space</span>
          <select
            value={filters.space ?? "all"}
            onChange={(event) => {
              const { value } = event.target;
              onChange("space", value === "all" ? null : value === "none" ? "none" : Number(value));
            }}
          >
            <option value="all">All spaces</option>
            <option value="none">No space</option>
            {spaces.map((space) => (
              <option key={space.id} value={space.id}>{space.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select
            value={filters.sort}
            onChange={(event) => onChange("sort", event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="due_date">Due date</option>
            <option value="priority">Priority</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
        <button
          className="button button-quiet clear-filters"
          type="button"
          onClick={onClear}
        >
          <span aria-hidden="true">↺</span>
          Clear filters
        </button>
      </div>
    </section>
  );
}
