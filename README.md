# 📝 Task Management Frontend

A dynamic and responsive **Task Management Application** built with **Next.js**, providing users with intuitive interfaces for task creation, assignment, and real-time updates.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Available Pages](#available-pages)
- [Real-Time Notifications](#real-time-notifications)
- [Contributing](#contributing)
- [License](#license)

---

## ✅ Features

- **Landing Page (/)**: Welcoming interface introducing the application.
- **Authentication**: Secure login and registration forms for user access.
- **Dashboard**: Comprehensive view of tasks created by or assigned to the authenticated user.
- **Task Management**: Authenticated users can create, edit, and delete tasks.
- **Real-Time Updates**: Immediate task updates with notification sounds and toast messages upon changes.

---

## 🛠 Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Real-Time Communication**: Socket.IO
- **Notifications**: React-Toastify

---

## 🔧 Installation & Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ubaid-Q/ES-Task-Frontend.git
   cd ES-Task-Frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:

   - Rename \`.env.example\` to \`.env\`:

     ```bash
     cp .env.example ..env
     ```

   - Update the \`.env\` file with appropriate values:

     ```env
     NEXT_PUBLIC_API_URL=http://localhost:4000
     NEXT_PUBLIC_SOCKET_URL=ws://localhost:4000
     ```

---

## 🚀 Running the Application

Start the development server:

```bash
npm run dev
```

Access the application at \`http://localhost:3000\`.

---

## 🌐 Available Pages

- **Landing Page (\`/\`)**: Introduction to the application.
- **Authentication**:
  - \`GET /login\`: User login form.
  - \`GET /register\`: User registration form.
- **Dashboard (\`/dashboard\`)**: Displays tasks created by or assigned to the authenticated user.

---

## 🔔 Real-Time Notifications

The application utilizes Socket.IO for real-time task updates:

- **Notifications**: Upon task updates, a notification sound plays, and a toast message appears.
- **Immediate Task Updates**: Task list reflects changes instantly without requiring a page refresh.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements.

---

## 📄 License

This project is licensed under the MIT License.
