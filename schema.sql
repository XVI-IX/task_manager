-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL UNIQUE, -- store securely hashed password
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL
  user_id INTEGER REFERENCES users(user_id)
);

-- Create Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  task_id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE,
  priority INTEGER DEFAULT 1,
  user_id INTEGER REFERENCES users(user_id),
  category_id INTEGER REFERENCES categories(category_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validation Function.
CREATE OR REPLACE FUNCTION validate_future_date(date_to_check DATE) RETURNS BOOLEAN AS $$
BEGIN
  RETURN date_to_check >= CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE tasks
ADD CONSTRAINT check_future_date
CHECK (validate_future_date(due_date));