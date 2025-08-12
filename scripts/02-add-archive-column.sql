-- Add archived column to tasks table
ALTER TABLE tasks ADD COLUMN archived BOOLEAN DEFAULT FALSE;

-- Create index for better performance when filtering archived tasks
CREATE INDEX idx_tasks_archived ON tasks(archived);
