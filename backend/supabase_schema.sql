-- Supabase schema for symptom checker interactions
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS interactions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  category TEXT,
  age TEXT,
  symptoms TEXT[],
  duration TEXT,
  risk_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_session_id ON interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_category ON interactions(category);
CREATE INDEX IF NOT EXISTS idx_risk_level ON interactions(risk_level);

-- Add comments for documentation
COMMENT ON TABLE interactions IS 'Anonymized symptom checking interactions';
COMMENT ON COLUMN interactions.session_id IS 'Unique session identifier';
COMMENT ON COLUMN interactions.category IS 'Symptom category: general_symptom, urgent_symptom, mental_wellbeing_symptom';
COMMENT ON COLUMN interactions.age IS 'User age (optional, may be null)';
COMMENT ON COLUMN interactions.symptoms IS 'Array of reported symptoms';
COMMENT ON COLUMN interactions.duration IS 'Duration of symptoms';
COMMENT ON COLUMN interactions.risk_level IS 'Assessed risk level: low, moderate, high';
