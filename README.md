# TaskFlow — Smart Task & Todo Management App

A modern, responsive React + TypeScript task management and Todo application featuring user authentication, priority and due-date smart sorting, status filtering, category organization, and local persistence.

---

## 🌟 Key Features

1. **Authentication System**
   - **Register & Sign In**: Full account registration with validation and encrypted-simulation persistence in `localStorage`.
   - **Multi-user isolation**: Each user sees strictly their own task database.
   - **One-Click Demo Account**: Instantly explore with pre-populated realistic tasks across different priorities and due dates.
   - **Persistent Sessions**: Stay logged in across page reloads.

2. **Smart Priority & Due-Date Sorting**
   - **⚡ Smart Default**: Prioritizes by urgency — **High Priority** tasks due earliest appear at the top.
   - **Flexible Sort Options**:
     - Soonest Due Date / Latest Due Date
     - Priority (High to Low / Low to High)
     - Recently Created
     - Alphabetical (A-Z)

3. **Task Lifecycle Management (CRUD)**
   - **Add Tasks**: Set title, description, priority (`High`, `Medium`, `Low`), due date & time, and category tags.
   - **Modify Tasks**: Update any task details on the fly via the edit modal.
   - **Quick Toggle**: Check off tasks with instant visual feedback and completion timestamp.
   - **Delete Tasks**: Safe removal with a confirmation modal dialog.

4. **Dashboard & Analytics**
   - **KPI Cards**: Real-time counts for Total, Pending, Completed (with % rate), and Overdue tasks.
   - **Interactive Filters**: Clicking an overdue or completed card instantly filters the board.
   - **Visual Progress Bar**: Real-time progress toward task completion.
   - **Dynamic Search & Filters**: Live search across title, description, and categories.

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

### 2. Build for Production
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm run preview
```
Open your browser to `http://localhost:4173`.

---

## 📁 Project Structure

```
task-flow-app/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthPage.tsx            # Login, registration & demo access
│   │   └── dashboard/
│   │       ├── Header.tsx              # Navbar with user badge and logout
│   │       ├── StatsOverview.tsx       # KPI cards & progress bar
│   │       ├── TaskToolbar.tsx         # Search, status pills, priority & sort
│   │       ├── TaskCard.tsx            # Task item card with priority & due badges
│   │       ├── TaskList.tsx            # List container & empty states
│   │       ├── TaskModal.tsx           # Modal for creating & editing tasks
│   │       ├── DeleteConfirmModal.tsx  # Deletion confirmation dialog
│   │       └── Dashboard.tsx           # Complete dashboard view
│   ├── context/
│   │   ├── AuthContext.tsx             # Auth state & user accounts
│   │   └── TaskContext.tsx             # Tasks state, CRUD, filters & sorting
│   ├── types/
│   │   └── index.ts                    # TypeScript types (Task, Priority, etc.)
│   ├── utils/
│   │   └── dateUtils.ts                # Due date badges & relative formatting
│   ├── App.tsx                         # App view router
│   ├── main.tsx                        # React DOM mounting
│   └── index.css                       # Tailwind CSS directives
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
