import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL client setup boilerplate
// Note: As per BRD, tasks are stored in LocalStorage, so this PG setup
// is present as per the prompt's boilerplate requirements but will NOT
// be used for task operations in this MVP.
import pkg from 'pg';
const { Pool } = pkg;
const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432 } = process.env;

const pool = new Pool(
  DATABASE_URL
    ? {
        connectionString: DATABASE_URL,
        ssl: { require: true }
      }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { require: true }, // Ensure SSL is enabled for external connections
      }
);

/**
 * Middleware: CORS Configuration
 * Enables Cross-Origin Resource Sharing for all origins.
 * This is necessary for frontend applications hosted on different domains/ports
 * to communicate with the backend.
 */
app.use(cors());

/**
 * Middleware: JSON Body Parser
 * Parses incoming requests with JSON payloads.
 * This is standard for REST APIs, though in this specific MVP,
 * no task-related API endpoints will be used.
 */
app.use(express.json());

/**
 * Middleware: URL-encoded Body Parser
 * Parses incoming requests with URL-encoded payloads.
 * This is included for completeness, similar to JSON parsing.
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware: Morgan for Request Logging
 * Logs HTTP requests to the console. Provides detailed information
 * about incoming requests, which is useful for development and debugging.
 */
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    `Headers: ${JSON.stringify(req.headers)}`,
    `Params: ${JSON.stringify(req.params)}`,
    `Query: ${JSON.stringify(req.query)}`,
    `Body: ${JSON.stringify(req.body)}`
  ].join(' ');
}));

/**
 * Route: Root Path and Health Check
 * A simple GET endpoint for the root path to indicate the server is running.
 * Also serves as a basic health check.
 */
app.get('/', (req, res) => {
  res.status(200).send('SimpleTask Backend (Static File Server) is running. Data persistence is client-side (LocalStorage).');
});

/**
 * Static File Serving
 * Serves static frontend files from the 'public' directory.
 * This is the primary function of this server for the SimpleTask MVP,
 * making the HTML, CSS, JavaScript, and other assets available to clients.
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * SPA Catch-All Route
 * Handles single-page application routing. For any route not explicitly
 * handled by other middleware or static files, it serves the 'index.html'
 * file. This allows the frontend routing library to take over.
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`SimpleTask server running on http://localhost:${PORT}`);
  console.log('Note: Task data persistence is client-side (LocalStorage) for this MVP.');
});

// Zod schemas are for frontend validation purposes, not directly used in this backend MVP
// but are imported to satisfy the prompt's requirement for clarity.
// The schemas describe the expected structure once tasks are serialized to LocalStorage.
import {
  taskSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
  searchTasksInputSchema,
  taskResponseSchema,
  tasksListResponseSchema
} from './schema.ts';

// Example of how to use Zod (not actively used in this task-related server endpoints as per BRD)
// function validateInput(schema, data) {
//   try {
//     schema.parse(data);
//     return true;
//   } catch (error) {
//     console.error("Validation error:", error.errors);
//     return false;
//   }
// }

// Keeping the PG pool connection for potential future use or other non-task related features.
// It's important to properly close the pool when the application shuts down
process.on('SIGINT', async () => {
  console.log('Closing PostgreSQL pool...');
  await pool.end();
  console.log('PostgreSQL pool closed. Server shutting down.');
  process.exit(0);
});
