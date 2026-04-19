# 🪙 CoinQuest

**CoinQuest** is a gamified financial literacy platform designed to teach children about saving, spending, and earning through a fun, interactive banking simulation.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js), CoinQuest provides a safe environment for kids to manage virtual money, complete missions set by parents, and learn financial concepts through engaging modules.

---

## 🚀 Features

### For Kids (The "CoinQuest" Experience)
- **Gamified Dashboard**: Track balance, points, and current level with a vibrant, intuitive UI.
- **Virtual Wallet**: Handle deposits, withdrawals, and watch savings grow with interest.
- **Missions**: Complete tasks assigned by parents to earn points and level up.
- **Learning Modules**: Educational content on banking basics, saving habits, and more with interactive quizzes.
- **Achievements**: Earn unique badges for reaching financial milestones.

### For Parents (The "Control Center")
- **Child Analytics**: Monitor child's progress, spending habits, and learning milestones.
- **Mission Center**: Create and assign custom chores or goals for children to complete.
- **Financial Control**: Review transactions and set rewards for good financial behavior.

### For Global Admins (The "System Watcher")
- **Global Monitoring**: Full visibility into all users across the entire platform.
- **User Connectivity**: Track "Last Seen" status and current online activity.
- **System-wide Analytics**: Overview of total platform balance, active users, and global mission progress.
- **Dynamic Content Management**: Create, edit, and delete learning modules and quizzes in real-time.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Framer Motion, React Router, Axios, Recharts, React Icons (Fi).
- **Backend**: Node.js, Express 5, JWT Authentication, Bcryptjs.
- **Database**: MongoDB (Mongoose ORM).
- **Styling**: Modern CSS with CSS Variables and Glassmorphism.

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a remote Atlas URI)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see [Environment Variables](#environment-variables)).
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Environment Variables

### Backend (`/backend/.env`)
- `PORT`: Port for the backend server (default: 5000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT signing.
- `ADMIN_SECRET`: Secret key required to register as a "Super Admin" (default: `coinquest_admin_2024`).

---

## 📂 Project Structure

```text
CoinQuest-MERN/
├── backend/
│   ├── Controllers/   # Business logic
│   ├── Models/        # Mongoose schemas
│   ├── Routes/        # API endpoints
│   ├── Middleware/    # Auth & validation
│   └── seed.js        # Initial data seed
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route-level views
│   │   ├── context/    # Global state (Auth)
│   │   └── services/   # API communication
└── README.md          # Project documentation
```

