---
duration: home or 2-3h
---

# Project-based Task Management & Security Policies in PostgreSQL

You will implement a **project-based task management system** in Supabase using **Row Level Security (RLS)** to control access based on user roles.

## Objectives

- Understand RLS policies in PostgreSQL
- Work without detailed instructions
- Share the code repository
- Share a description of your approach and the challenges encountered.

## Tasks

1. Part 1. Database setup (medium level)
2. Part 2. Row Level Security (medium level)
3. Part 3. Testing (medium level)
4. Part 4. Optional extension (hard level)

## Part 1. Database setup (medium level)

- Create the necessary tables to store:
  - **Users**
  - **Projects**
  - **Project members** (linking users to projects with roles)
  - **Tasks**, which belong to projects
- Ensure tasks are linked to a project and assigned to users.

## Part 2. Row Level Security (medium level)

- Enable RLS on the `projects`, `tasks`, and `project_members` tables.
- Implement access control policies to enforce the following rules:
  - **Admins** have full access to all tasks within their projects.
  - **Project Managers** can create and assign tasks within their projects.
  - **Contributors** can manage their own tasks.
  - **Viewers** can only read tasks within their assigned projects.

## Part 3. Testing (medium level)

- Insert sample data for users, projects, tasks, and project memberships.
- Execute queries to verify access control works correctly.

## Part 5. Optional extension (hard level)

- Implement a frontend interface to interact with the database.

## Expected outcome

- A properly secured database where users can only perform actions permitted by their role within their assigned projects.
