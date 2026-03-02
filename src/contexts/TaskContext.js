/**
 * TaskContext.js — creates and exports the Task context.
 *
 * This file only creates the context.
 * All state and logic live in TaskProvider.jsx.
 */
import { createContext } from "react";

const TaskContext = createContext(null);

export default TaskContext;
