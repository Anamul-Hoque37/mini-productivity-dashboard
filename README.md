# 🧠 Mini Productivity Dashboard

A web-based productivity tool where users can manage daily tasks, set goals, and stay motivated with quotes — built with **React.js**, **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

- ✅ User Registration & Login (JWT Auth)
- ✅ Daily Task Management (Add, Edit, Delete, Mark Complete)
- ✅ Weekly/Monthly Goals Section
- ✅ Motivational Quotes (via API)
- ✅ Light/Dark Mode Toggle 🌙☀️
- ✅ Drag-and-Drop Task Reordering (Bonus)

---

## 🧰 Tech Stack

| Frontend        | Backend          | Database       |
|----------------|------------------|----------------|
| React.js        | Node.js + Express | MongoDB + Mongoose |
| Tailwind CSS   | JWT Auth         | MongoDB Atlas |
| React DnD      | bcrypt.js        |                |
| React Router   | cors, dotenv     |                |

---


## ⚙️ Setup Instructions Backend

### 1. 🧬 Clone the Repository

```bash
git clone https://github.com/yourusername/mini-productivity-dashboard.git
cd mini-productivity-dashboard

### 2. 🔧 Backend Setup

cd server
npm install

### 3. 🔐 Create a .env file inside the /server folder:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db
JWT_SECRET=your_jwt_secret

### 4. ▶️ Start the backend server:
nodemon index.js

---

## ⚙️ Setup Instructions Frontend

### 1. 🧬 Clone the Repository

```bash
git clone https://github.com/yourusername/mini-productivity-dashboard.git
cd mini-productivity-dashboard

### 🎨 Frontend Setup

npm install

### ▶️ Start the frontend:

npm run dev

## 🌐 Live Demo
### ✨ Coming Soon!
Frontend (Vercel) → [your-link.vercel.app]
Backend (Render) → [https://mini-productivity-dashboard-server.onrender.com]