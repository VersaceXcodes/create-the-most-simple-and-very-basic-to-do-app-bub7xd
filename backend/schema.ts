import { z } from 'zod';

// --- Task Schemas ---

// Main entity schema for tasks
export const taskSchema = z.object({
  id: z.string(), // VARCHAR(255) PRIMARY KEY NOT NULL
  text_content: z.string(), // TEXT NOT NULL
  is_completed: z.boolean(), // BOOLEAN NOT NULL DEFAULT FALSE
  created_at: z.number(), // BIGINT NOT NULL (Unix timestamp)
  completed_at: z.number().nullable(), // BIGINT (Unix timestamp)
  last_interacted_at: z.number(), // BIGINT NOT NULL (Unix timestamp)
});

// Input schema for creating a new task
export const createTaskInputSchema = z.object({
  // id is auto-generated
  text_content: z.string().min(1, "Task content cannot be empty").max(1000, "Task content is too long"),
  is_completed: z.boolean().default(false).optional(), // Can be provided, defaults to false
  // created_at is auto-generated
  // completed_at is only set on completion
});

// Input schema for updating an existing task
export const updateTaskInputSchema = z.object({
  id: z.string(), // The ID of the task to update
  text_content: z.string().min(1, "Task content cannot be empty").max(1000, "Task content is too long").optional(),
  is_completed: z.boolean().optional(),
  // created_at cannot be updated
  // completed_at can be set to a timestamp or null
  // To handle setting/unsetting, we provide explicit nullable() and optional()
  completed_at: z.number().nullable().optional(),
  last_interacted_at: z.number().optional(),
}).refine(data => Object.keys(data).length > 1, {
  message: "At least one field (text_content, is_completed, completed_at, last_interacted_at) must be provided for update.",
  path: ["body"], // General error for the request body
});


// Query schema for searching/filtering tasks
export const searchTasksInputSchema = z.object({
  query: z.string().optional(), // General search query (e.g., text_content)
  is_completed: z.boolean().optional(), // Filter by completion status
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  sort_by: z.enum(['created_at', 'last_interacted_at', 'text_content', 'is_completed']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Response schema for a single task (often identical to entity schema)
export const taskResponseSchema = taskSchema;

// Response schema for a list of tasks
export const tasksListResponseSchema = z.object({
  data: z.array(taskResponseSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total_items: z.number().int().nonnegative(),
  total_pages: z.number().int().nonnegative(),
});

// Inferred Types
export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export type SearchTasksInput = z.infer<typeof searchTasksInputSchema>;
export type TaskResponse = z.infer<typeof taskResponseSchema>;
export type TasksListResponse = z.infer<typeof tasksListResponseSchema>;