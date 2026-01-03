-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Notes table for shared notes between users
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_notes_created_by ON notes(created_by);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_pinned ON notes(is_pinned, created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
-- Allow users to read all notes
CREATE POLICY "Users can view all notes"
    ON notes FOR SELECT
    USING (true);

-- Allow users to create notes
CREATE POLICY "Users can create notes"
    ON notes FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own notes
CREATE POLICY "Users can update their own notes"
    ON notes FOR UPDATE
    USING (created_by = auth.uid());

-- Allow users to delete their own notes
CREATE POLICY "Users can delete their own notes"
    ON notes FOR DELETE
    USING (created_by = auth.uid());

-- Add comment
COMMENT ON TABLE notes IS 'Shared notes between users';
COMMENT ON COLUMN notes.is_pinned IS 'Whether the note is pinned to the top';
