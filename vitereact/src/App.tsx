// App.tsx
import React from 'react';
import {
  BrowserRouter as Router, // Use BrowserRouter for client-side routing
  Route,
  Routes,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider

// Import global and unique views as specified
import GV_AppHeader from '@/components/views/GV_AppHeader.tsx';
import UV_MainTaskView from '@/components/views/UV_MainTaskView.tsx';

// Create a client for React Query
const queryClient = new QueryClient();

// Define the root App component as a Functional Component
const App: React.FC = () => {
  return (
    // Wrap the entire application with QueryClientProvider to enable React Query
    <QueryClientProvider client={queryClient}>
      {/* Use Router for routing functionality */}
      <Router>
        {/* Render the Global Application Header, which is always visible at the top */}
        <GV_AppHeader />

        {/* Define the application's routes */}
        <Routes>
          {/*
            The main and only unique view of the application.
            It is accessible at the root path ("/").
            No authentication restrictions apply to this view as per analysis.
          */}
          <Route path="/" element={<UV_MainTaskView />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;