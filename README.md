# HR Nexus - Advanced HR & Recruitment Platform

A scalable, secure, and user-friendly HR / Recruiter Dashboard built with React 19.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Support for HR Admin, Recruiter, Hiring Manager, and Employees.
- **Recruitment ATS**: Kanban-style applicant tracking system.
- **HR Operations**: Employee management and analytics.
- **Interactive Dashboard**: Real-time charts and KPIs using Recharts.
- **Premium UI**: Modern dark-themed glassmorphism design.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router Dom v6
- **Styling**: Vanilla CSS (CSS Modules) with CSS Variables
- **Icons**: Lucide React
- **Charts**: Recharts

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components
├── context/      # specific contexts (Auth, Theme)
├── layouts/      # Page layouts (MainLayout, AuthLayout)
├── mock/         # Mock data for development
├── pages/        # Application pages (Dashboard, Recruitment, etc.)
└── App.jsx       # Main application entry
```

## 🚦 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Login Credentials (Mock)**
    - Select a role on the login screen to simulate different user experiences.
