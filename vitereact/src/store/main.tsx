import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the interface for a single Task object
export interface Task {
  id: string; // Unique identifier for the task, e.g., uuid or timestamp-based
  text_content: string; // The actual task description
  is_completed: boolean; // True if the task is completed, false otherwise
  created_at: number; // Timestamp (milliseconds since epoch) when the task was created
  completed_at: number | null; // Timestamp when the task was completed, null if not completed
  last_interacted_at: number; // Timestamp of the last interaction (created, completed, un-completed)
}

// Define the interface for the entire store state and actions
export interface AppStoreState {
  tasks: Task[];
  active_tasks_count: number;
  add_new_task: (text_content: string) => void;
  toggle_task_completion: (task_id: string) => void;
  delete_task_by_id: (task_id: string) => void;
}

// Helper function to sort tasks according to PRD requirements
// Active tasks first, then completed. Within each, newest (last_interacted_at) first.
const sort_tasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // 1. Prioritize active tasks over completed tasks
    if (a.is_completed === b.is_completed) {
      // If both are same status, sort by last_interacted_at (newest first)
      return b.last_interacted_at - a.last_interacted_at;
    } else {
      // Active tasks (false) come before completed tasks (true)
      return a.is_completed ? 1 : -1;
    }
  });
};

// Create the Zustand store
export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      active_tasks_count: 0,

      // Action to add a new task
      add_new_task: (text_content: string) => {
        const trimmed_text = text_content.trim();
        if (!trimmed_text) {
          console.warn("Attempted to add an empty task.");
          return; // Do not add empty tasks
        }

        const current_timestamp = Date.now();
        const new_task: Task = {
          id: `${current_timestamp}-${Math.random().toString(36).substring(2, 9)}`, // Simple unique ID
          text_content: trimmed_text,
          is_completed: false,
          created_at: current_timestamp,
          completed_at: null,
          last_interacted_at: current_timestamp,
        };

        set((state) => {
          const updated_tasks = sort_tasks([new_task, ...state.tasks]); // Prepend and sort
          return {
            tasks: updated_tasks,
            active_tasks_count: updated_tasks.filter((task) => !task.is_completed).length,
          };
        });
      },

      // Action to toggle task completion status
      toggle_task_completion: (task_id: string) => {
        set((state) => {
          const current_timestamp = Date.now();
          const updated_tasks = state.tasks.map((task) => {
            if (task.id === task_id) {
              const new_is_completed = !task.is_completed;
              return {
                ...task,
                is_completed: new_is_completed,
                completed_at: new_is_completed ? current_timestamp : null,
                last_interacted_at: current_timestamp, // Update last interaction on toggle
              };
            }
            return task;
          });

          return {
            tasks: sort_tasks(updated_tasks), // Sort updated list
            active_tasks_count: updated_tasks.filter((task) => !task.is_completed).length,
          };
        });
      },

      // Action to delete a task
      delete_task_by_id: (task_id: string) => {
        set((state) => {
          const updated_tasks = state.tasks.filter((task) => task.id !== task_id);
          return {
            tasks: sort_tasks(updated_tasks), // Sort remaining tasks
            active_tasks_count: updated_tasks.filter((task) => !task.is_completed).length,
          };
        });
      },
    }),
    {
      name: 'simple_task_data', // unique name for localStorage key
      getStorage: () => localStorage, // Use localStorage
      // Optional: Migrate state if schema changes. Not needed for this MVP.
      // version: 0,
      // migrate: (persistedState, version) => { /* ... */ return persistedState as AppStoreState; },
      
      // Override 'onRehydrateStorage' to sort tasks after they are loaded from storage
      // and calculate initial active_tasks_count
      onRehydrateStorage: (state) => {
        if (state) {
          state.tasks = sort_tasks(state.tasks);
          state.active_tasks_count = state.tasks.filter((task) => !task.is_completed).length;
        }
      },
      // You can also add more complex serialization/deserialization if needed
      // serialize: (state) => JSON.stringify(state),
      // deserialize: (str) => JSON.parse(str),
    }
  )
);