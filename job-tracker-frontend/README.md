# Job Tracker — Frontend

React + Vite single-page application for tracking job applications with role-based access.

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router v7
- **HTTP**: Axios (with JWT interceptors)
- **Styling**: Custom CSS (responsive, mobile-first)

## Features

- **Authentication**: Register / Login with JWT
- **Role-based UI**: Admin sees all users + admin panel; regular users see only their own jobs
- **Job Management**: Full CRUD — add, edit, delete, filter by status/company
- **Dashboard**: Stats overview with application counts by status
- **Profile**: Update name and password
- **Responsive**: Works on mobile, tablet, and desktop

## Job Statuses

| Status | Description |
|--------|-------------|
| Wishlist | Saved for later |
| Applied | Application submitted |
| Phone Screen | Initial call scheduled |
| Interview | Interview stage |
| Offer | Offer received |
| Accepted | Offer accepted |
| Rejected | Application rejected |
| Withdrawn | You withdrew |

## Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit VITE_API_URL to point to your backend

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

## Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder can be deployed to:
- **AWS S3 + CloudFront** (recommended)
- **Netlify** / **Vercel** (drag and drop `dist/`)
- Any static file host

## Project Structure

```
src/
├── api/           # Axios API clients (auth, jobs, users)
├── components/    # Reusable UI components (Navbar, JobCard, etc.)
├── context/       # React Context (AuthContext with JWT management)
├── pages/         # Route-level page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Jobs.jsx
│   ├── JobForm.jsx
│   ├── Profile.jsx
│   └── AdminPanel.jsx
├── App.jsx        # Router setup + layout
├── App.css        # Full design system
└── main.jsx       # Entry point
```

## Auth Flow

1. User submits login form → POST `/api/auth/login`
2. Server returns `{ accessToken, user }`
3. Token stored in `localStorage`
4. Axios interceptor attaches `Authorization: Bearer <token>` to every request
5. On 401 response, token is cleared and user is redirected to `/login`
