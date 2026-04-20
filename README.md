# AI Todo Manager — Frontend

An AI-powered task management app that uses **Google Gemini AI** to intelligently generate structured todos from natural language input. Organize tasks into projects, set deadlines, and track completion — all with a clean, responsive UI.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764abc?logo=redux)

## Features

- **AI-Powered Todo Generation** — Describe your tasks in plain English and Gemini AI breaks them into structured, categorized, prioritized todos
- **Smart Prompt Handling** — Detects non-actionable input and prompts the user to try again
- **Project Collections** — Group todos into projects for better organization
- **Regenerate** — Unhappy with AI output? Regenerate any section using the original prompt stored per-todo
- **Done/Undone Toggle** — Mark tasks as complete with visual feedback (strikethrough, color change)
- **Inline Edit** — Edit todo titles directly without leaving the page
- **Deadline Grouping** — Todos are grouped and sorted by deadline date
- **Collapsible Input** — Input card collapses after generation to keep focus on tasks
- **Fully Responsive** — Mobile-first design with a slide-in sidebar drawer on small screens
- **Loading & Error States** — Visual feedback for all async operations (delete, generate, API errors)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 6 (SWC) |
| State Management | Redux Toolkit + RTK Query |
| Styling | Tailwind CSS 4 |
| AI | Google Gemini 2.5 Flash |
| Notifications | React Hot Toast |
| Icons | React Icons |

## Project Structure

```
src/
├── App.jsx                  # Root layout (sidebar + main + mobile toggle)
├── main.jsx                 # Redux provider & React root
├── index.css                # Global styles & custom scrollbar
├── app/
│   └── store.js             # Redux store configuration
├── components/
│   ├── CollectionBar.jsx    # Sidebar with project list
│   ├── TodoWindow.jsx       # Main view (AI input + todo groups)
│   ├── collectionComponents/
│   │   ├── PreviousCollection.jsx  # Single project item in sidebar
│   │   └── PreviousComponents.jsx  # Project list + create form
│   └── TodoComponents/
│       └── Todo.jsx         # Individual todo item (edit, delete, toggle)
├── featurs/
│   ├── collectionSlice.js   # Collection state slice
│   └── todoSlice.js         # Current todo selection slice
├── services/
│   ├── collectionApi.js     # RTK Query — collection endpoints
│   └── todoApi.js           # RTK Query — todo endpoints
└── utils/
    ├── clickOutside.js      # Hook for click-outside detection
    └── gemini.js            # Google Gemini AI integration
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://ai.google.dev/)
- The backend server running (see [AI-TODO-MANAGER-SERVER](../AI-TODO-MANAGER-SERVER/))

### Installation

```bash
cd AI-TODO-MANAGER
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SERVER_URL=http://localhost:3000/api/v1
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## API Endpoints (consumed)

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/todo/get-todo` | Fetch todos for a collection |
| `POST` | `/todo/create-todo` | Create todos (batch) |
| `DELETE` | `/todo/delete-todo` | Delete a todo |
| `PUT` | `/todo/update-todo` | Update todo title |
| `PATCH` | `/todo/toggle-done` | Toggle done status |

### Collections

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/collection/get-all-collection` | Fetch all projects |
| `POST` | `/collection/create-collection` | Create a project |
| `DELETE` | `/collection/delete-collection` | Delete a project |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
