# Project-based task management & security policies exercise

## Objective

You will implement a **project-based task management system** in Supabase using **Row Level Security (RLS)** to control access based on user roles.

## Instructions

### 1. Database setup

Create the necessary tables:

```sql
-- Should already be created from part 1
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL
);

CREATE TABLE project_members (
    user_id UUID REFERENCES profiles(id),
    project_id UUID REFERENCES projects(id),
    role TEXT CHECK (role IN ('admin', 'manager', 'contributor', 'viewer')),
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    assigned_to UUID REFERENCES profiles(id),
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('todo', 'in progress', 'done'))
);
```

### 2. Row Level Security (RLS)

Enable RLS on tables:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
```

#### Policies:

- **Admins have full access to tasks in their projects**

```sql
CREATE POLICY "Admins can manage all tasks"
ON tasks
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM project_members
        WHERE project_members.user_id = auth.uid()
        AND project_members.project_id = tasks.project_id
        AND project_members.role = 'admin'
    )
);
```

- **Project managers can create and assign tasks**

```sql
CREATE POLICY "Managers can create and assign tasks"
ON tasks
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM project_members
        WHERE project_members.user_id = auth.uid()
        AND project_members.project_id = tasks.project_id
        AND project_members.role IN ('admin', 'manager')
    )
);
```

- **Contributors can update their assigned tasks**

```sql
CREATE POLICY "Contributors can update own tasks"
ON tasks
FOR UPDATE
USING (
    assigned_to = auth.uid()
);
```

- **Viewers can only read tasks in their projects**

```sql
CREATE POLICY "Viewers can read tasks"
ON tasks
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM project_members
        WHERE project_members.user_id = auth.uid()
        AND project_members.project_id = tasks.project_id
    )
);
```

### 3. Testing

Insert sample data:

```sql

INSERT INTO projects (id, name) VALUES
    ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Project A');

INSERT INTO project_members (user_id, project_id, role) VALUES
-- replace those user_id values with actual user ids
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'manager'),
    ('33333333-3333-3333-3333-333333333333', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'contributor'),
    ('44444444-4444-4444-4444-444444444444', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'viewer');

INSERT INTO tasks (id, project_id, assigned_to, description, status) VALUES
    ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Fix bug #101', 'todo'),
    ('ccccccc1-cccc-cccc-cccc-cccccccccccc', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Fix bug #102', 'pending');
```

Verify access by running queries as different users.

### 4. Optional Extension (optional)

- Implement a frontend interface to interact with the database.

### 5. User Profile Security (already done in first lab but if not here is a correction)

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

#### **Read (SELECT) - Users can view their own profile**

```sql
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);
```

#### **Insert - Users can create their own profile**

```sql
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
```

#### **Update - Users can update their own profile**

```sql
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);
```

#### **Delete (Optional) - Allow users to delete their own profile**

```sql
CREATE POLICY "Users can delete their own profile"
ON profiles
FOR DELETE
USING (auth.uid() = id);
```

## Expected outcome

- A properly secured database where users can only perform actions permitted by their role within their assigned projects.

---

Document your approach and any challenges encountered.
