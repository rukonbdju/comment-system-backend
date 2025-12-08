# 🚀 Real-Time Comment & Reaction API

This is a robust, production-ready backend API built with **Express, TypeScript, and Mongoose**. It follows the **Repository, Service, Controller (RSC) pattern** to ensure separation of concerns, high testability, and scalability.

It includes a real-time reaction system using **Socket.IO** for instantaneous count updates.

## ✨ Features

* **Layered Architecture:** Clear separation between Controllers (HTTP), Services (Business Logic), and Repositories (Data Access).
* **Modular Design:** Dedicated modules for Authentication, Comments, and Reactions.
* **Real-Time Reactions:** Uses **Socket.IO** for broadcasting `likeCount` and `dislikeCount` updates to all viewing clients.
* **Data Integrity:** Implements **cascading deletion** to clean up associated reactions when a Comment is deleted.
* **Type Safety:** Built entirely with **TypeScript** for strong type checking and fewer runtime errors.
* **Centralized Error Handling:** Uses global middleware to map domain-specific errors (e.g., `NotFoundError`, `ConflictError`) to appropriate HTTP status codes.

## 📦 Prerequisites

* Node.js (LTS version recommended)
* npm or yarn
* MongoDB instance (Local or Atlas)

## ⚙️ Project Setup

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-link>
cd <repo-name>
npm install
npm run dev