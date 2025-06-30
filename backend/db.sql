CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(255) PRIMARY KEY NOT NULL,
    text_content TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at BIGINT NOT NULL,
    completed_at BIGINT,
    last_interacted_at BIGINT NOT NULL
);

INSERT INTO tasks (id, text_content, is_completed, created_at, completed_at, last_interacted_at) VALUES
('1678901234567-0', 'Buy groceries for the week, including milk, eggs, bread, and fruits.', FALSE, 1678901234567, NULL, 1678901234567),
('1678901250000-1', 'Call the bank to inquire about the new credit card offer and update personal details.', TRUE, 1678901240000, 1678901250000, 1678901250000),
('1678901260000-2', 'Send email to John regarding the project deadline extension and team meeting schedule.', FALSE, 1678901260000, NULL, 1678901260000),
('1678901270000-3', 'Finish the quarterly report analysis and prepare the presentation slides for the board meeting.', FALSE, 1678901270000, NULL, 1678901270000),
('1678901280000-4', 'Go for a 30-minute run in the park to clear my head and get some exercise.', TRUE, 1678901265000, 1678901280000, 1678901280000),
('1678901290000-5', 'Read two chapters of "The Art of War" as part of my personal development goal.', FALSE, 1678901290000, NULL, 1678901290000),
('1678901300000-6', 'Schedule dentist appointment for a routine check-up and cleaning next month.', FALSE, 1678901300000, NULL, 1678901300000),
('1678901310000-7', 'Water the plants and re-pot the larger ones that are outgrowing their current containers.', TRUE, 1678901285000, 1678901310000, 1678901310000),
('1678901320000-8', 'Plan weekend getaway with Sarah, looking into options for a beach trip or mountain hike.', FALSE, 1678901320000, NULL, 1678901320000),
('1678901330000-9', 'Review and pay utility bills before the due date to avoid late fees.', FALSE, 1678901330000, NULL, 1678901330000),
('1678901340000-10', 'Organize digital photos from the last vacation and upload them to cloud storage.', TRUE, 1678901275000, 1678901340000, 1678901340000),
('1678901350000-11', 'Research new frameworks for frontend development: check out SolidJS and Qwik.', FALSE, 1678901350000, NULL, 1678901350000),
('1678901360000-12', 'Cook a new recipe from the cookbook – perhaps something Italian or Mexican.', FALSE, 1678901360000, NULL, 1678901360000),
('1678901370000-13', 'Update my personal website''s "About Me" section with recent achievements.', TRUE, 1678901295000, 1678901370000, 1678901370000);