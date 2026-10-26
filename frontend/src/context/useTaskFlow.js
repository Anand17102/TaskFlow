import { useContext } from "react";
import { TaskFlowContext } from "./taskFlowContextValue";

export function useTaskFlow() {
  const context = useContext(TaskFlowContext);
  if (!context) {
    throw new Error("useTaskFlow must be used within TaskFlowProvider");
  }
  return context;
}
