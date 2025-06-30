import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { useAppStore, Task } from '@/store/main';
import { z } from 'zod';
import { createTaskInputSchema } from '@/DB/zodschemas'; // Assuming zodschemas path is correct

// Define props interface for TaskItem, if it were a separate component.
// Since we are rendering everything in one big block, these are internal structure definitions.
interface TaskItemProps {
  task: Task;
  on_toggle_complete: (id: string) => void;
  on_delete: (id: string) => void;
}

const UV_MainTaskView: React.FC = () => {
  // Global state access via Zustand store
  const {
    tasks,
    active_tasks_count,
    add_new_task,
    toggle_task_completion,
    delete_task_by_id,
  } = useAppStore(state => ({
    tasks: state.tasks,
    active_tasks_count: state.active_tasks_count,
    add_new_task: state.add_new_task,
    toggle_task_completion: state.toggle_task_completion,
    delete_task_by_id: state.delete_task_by_id,
  }));

  // Local state for the new task input field
  const [new_task_input_value, set_new_task_input_value] = useState<string>('');

  // Filter tasks into active and completed for rendering
  const active_tasks = tasks.filter(task => !task.is_completed);
  const completed_tasks = tasks.filter(task => task.is_completed);

  // Handler for adding a new task
  const handle_add_task = () => {
    try {
      const trimmed_value = new_task_input_value.trim();
      // Validate with Zod schema for input content
      createTaskInputSchema.shape.text_content.parse(trimmed_value);

      add_new_task(trimmed_value); // Call Zustand store action
      set_new_task_input_value(''); // Clear input field upon success
    } catch (e) {
      if (e instanceof z.ZodError) {
        // FRD-FEAT-2.4: If validation fails (e.g., empty string), do not clear input
        // For this simple app, no explicit UI error message is required;
        // simply preventing the addition and not clearing the input is sufficient feedback.
        console.warn("Validation failed for new task input:", e.errors[0].message);
      } else {
        console.error("An unexpected error occurred:", e);
      }
    }
  };

  // Handler for Enter key press in the input field
  const handle_key_down = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handle_add_task();
    }
  };

  // Handler for input field change
  const handle_input_change = (event: ChangeEvent<HTMLInputElement>) => {
    set_new_task_input_value(event.target.value);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
        {/* Task Input Section */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            {active_tasks_count > 0
              ? `You have ${active_tasks_count} tasks to do`
              : "You have no tasks! Start by adding one."}
          </h2>
          <div className="flex gap-2">
            <input
              id="input_TaskEntry"
              type="text"
              placeholder="Add a new task..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              value={new_task_input_value}
              onChange={handle_input_change}
              onKeyDown={handle_key_down}
              aria-label="New task input"
            />
            <button
              id="btn_AddTask"
              onClick={handle_add_task}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              aria-label="Add task"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Task List Container (FRD-UI-1.4) */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4" id="container_TaskList">
          {(active_tasks.length === 0 && completed_tasks.length === 0) ? (
            // Empty State Message (FRD-FEAT-3.6)
            <p className="text-center text-gray-500 mt-4 italic" id="txt_EmptyStateMessage">
              You have no tasks yet! Start by adding one above.
            </p>
          ) : (
            <>
              {/* Active Tasks Section (FRD-FEAT-3.1) */}
              {active_tasks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-2">Active Tasks</h3>
                  <ul className="space-y-3">
                    {active_tasks.map(task => (
                      <li key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                        <div className="flex items-center flex-grow min-w-0">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={false}
                            onChange={() => toggle_task_completion(task.id)}
                            id={`btn_ToggleComplete_${task.id}`}
                            aria-label={`Mark "${task.text_content}" as complete`}
                          />
                          <span className="ml-3 text-gray-800 break-words flex-grow min-w-0 font-medium">
                            {task.text_content}
                          </span>
                        </div>
                        <button
                          onClick={() => delete_task_by_id(task.id)}
                          className="ml-4 p-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full transition-colors duration-200"
                          id={`btn_DeleteTask_${task.id}`}
                          aria-label={`Delete "${task.text_content}"`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Completed Tasks Section (FRD-FEAT-3.1) */}
              {completed_tasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-2">Completed Tasks</h3>
                  <ul className="space-y-3">
                    {completed_tasks.map(task => (
                      <li key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                        <div className="flex items-center flex-grow min-w-0">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={true}
                            onChange={() => toggle_task_completion(task.id)}
                            id={`btn_ToggleComplete_${task.id}`}
                            aria-label={`Mark "${task.text_content}" as incomplete`}
                          />
                          <span className="ml-3 text-gray-500 line-through break-words flex-grow min-w-0 italic">
                            {task.text_content}
                          </span>
                        </div>
                        <button
                          onClick={() => delete_task_by_id(task.id)}
                          className="ml-4 p-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full transition-colors duration-200"
                          id={`btn_DeleteTask_${task.id}`}
                          aria-label={`Delete "${task.text_content}"`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_MainTaskView;