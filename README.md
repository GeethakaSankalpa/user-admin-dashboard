# 👨‍💼 User-Admin Dashboard

A full-stack **User-Admin Dashboard** built with **Next.js** and **MongoDB Atlas**, featuring secure authentication, role-based authorization, and complete CRUD operations for managing users and admins.

---

## 🚀 Introduction

This project is a modern web dashboard that allows administrators to manage users and perform CRUD operations. It includes secure login functionality and role-based access control to ensure that only authorized users can access specific features.

---

## ✨ Features

- 🔐 **Authentication**: Secure login system using JWT or session-based authentication.
- 🛡️ **Authorization**: Role-based access control for Admin and User views.
- 📄 **CRUD Operations**: Create, Read, Update, and Delete users and admin data.
- 📊 **Admin Dashboard**: View and manage all users with admin privileges.
- 👤 **User Page**: Personalized user interface with limited access.
- 🌐 **MongoDB Atlas**: Cloud-hosted database for scalable and secure data storage.

---

## 📸 Screenshots

### 🔐 Login Page
!login

### 👨‍💼 Admin Dashboard
!admin-dashboard

### 👥 User Page
!user-page

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth
- **Styling**: Tailwind CSS

---

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

2. **Install dependencies**:
   ```bash
   npm install

3. **Create a .env.local file in the root directory and add your environment variables:**:
   ```bash   
    MONGODB_URI=your-mongodb-atlas-uri
    NEXTAUTH_SECRET=your-secret-key


4. **Run the development server:**:
   ```bash
   npm run dev