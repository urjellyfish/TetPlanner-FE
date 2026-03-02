/**
 * TaskProvider.jsx — provides task state and operations via TaskContext.
 *
 * Delegates all state and API logic to the useTask hook.
 * No duplicate state is stored here.
 */
import TaskContext from "./TaskContext";
import { useTask } from "../hooks/useTask";

export default function TaskProvider({ children }) {
  const taskHook = useTask();

  return (
    <TaskContext.Provider value={taskHook}>
      {children}
    </TaskContext.Provider>
  );
}

