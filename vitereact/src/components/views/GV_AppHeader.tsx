import React from 'react';
import { useAppStore } from '@/store/main';

/**
 * GV_AppHeader Component
 *
 * This component displays the application's header, including its title "SimpleTask"
 * and a real-time count of active (incomplete) tasks. It fetches the active task
 * count directly from the global Zustand store, ensuring it's always up-to-date.
 *
 * It is a purely presentational component with no internal state or actions.
 *
 * @returns {JSX.Element} The rendered application header.
 */
const GV_AppHeader: React.FC = () => {
    // Access the active_tasks_count from the Zustand global store
    // This hook will cause the component to re-render whenever active_tasks_count changes
    const active_tasks_count = useAppStore(state => state.active_tasks_count);

    return (
        <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 shadow-md z-10 flex flex-col sm:flex-row justify-between items-center">
            {/* Application Title */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">SimpleTask</h1>

            {/* Active Task Count Display */}
            {/* The count updates automatically as the underlying state changes */}
            <div className="text-lg sm:text-xl font-medium">
                {active_tasks_count === 0 ? (
                    <span>No active tasks!</span>
                ) : (
                    <span>You have <span className="font-bold">{active_tasks_count}</span> {active_tasks_count === 1 ? 'task' : 'tasks'} to do</span>
                )}
            </div>
        </header>
    );
};

export default GV_AppHeader;