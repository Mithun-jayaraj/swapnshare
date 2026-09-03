# 🌿 SwapNShare

A sustainable, community-driven marketplace built with the **MERN** stack. SwapNShare empowers local neighborhoods to reduce waste, list surplus items, and seamlessly coordinate peer-to-peer swaps—all packaged in a stunning, modern **Glassmorphism** interface.

---

## ⚡ Tech Stack & Badges

[![React](https://img.shields.io/badge/Frontend-React%2018%20(Vite)-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20(Express)-green?style=for-the-badge&logo=node.js&logoColor=339933)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-brightgreen?style=for-the-badge&logo=mongodb&logoColor=47A248)](https://www.mongodb.com/)
[![JSON Web Tokens](https://img.shields.io/badge/Security-JWT%20%26%20bcrypt-orange?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Vanilla CSS](https://img.shields.io/badge/Styling-Glassmorphism%20CSS-blueviolet?style=for-the-badge&logo=css3&logoColor=white)](#styling)

---

## ✨ Key Features

*   **🎨 Premium Glassmorphism UI & Dark Mode**: A gorgeous, state-of-the-art responsive interface featuring frosted glass cards, dynamic realistic category imagery, and a seamless toggle for an immersive **Dark Theme**.
*   **👤 Comprehensive Profile Management**: Users can manage their personal details (Name, Email, Mobile Number, City Location) and securely change their passwords through an interactive Profile Modal.
*   **🔒 Secure Authentication**: Sign up and login workflows powered by salted and hashed passwords using `bcryptjs`, generating cryptographically signed `JWT` tokens.
*   **🛒 Neighborhood Marketplace**: A real-time dashboard displaying available goods. Items automatically display realistic, context-aware thumbnails based on their category (e.g., Electronics, Groceries, Appliances, Furniture).
*   **🤝 Interactive Swap Workflow**:
    *   Initiate peer-to-peer swap requests.
    *   Built-in logic preventing duplicate requests or requesting your own item.
    *   Dedicated dashboard for managing incoming and outgoing requests (Accept/Reject options).

---

## 🏛️ System Architecture

The project leverages a decoupled client-server architecture with state management and authentication hooks. Below is the workflow demonstrating a typical request cycle:

```mermaid
sequenceDiagram
    autonumber
    actor User as Neighbor (React SPA)
    participant Interceptor as Axios Interceptor
    participant Guard as JWT Auth Middleware
    participant Controller as Express Controller
    participant DB as MongoDB Atlas

    %% Auth Flow Example
    User->>Controller: POST /api/auth/login { email, password }
    Controller->>DB: Queries User by Email
    DB-->>Controller: Returns hashed credentials
    Controller->>Controller: Verifies bcrypt hash & signs JWT
    Controller-->>User: Returns user profile & JWT token
    Note over User: JWT token saved securely in localStorage

    %% Protected Action Example
    User->>Interceptor: Request Swap for Item X
    Note over Interceptor: Appends Bearer token to headers
    Interceptor->>Guard: POST /api/swap { itemId }
    alt Token is invalid/expired
        Guard-->>User: 401 Unauthorized Response
    else Token is valid
        Guard->>DB: FindUserById(decoded.id) & attach to req.user
        Guard->>Controller: next() execution
        Controller->>DB: Check duplicates, Create SwapRequest Document
        DB-->>Controller: Document created & saved
        Controller-->>User: 201 Created status + JSON response
    end
```

---

## 🗃️ Database Schema & Relationships

### 1. `User` Schema
Represents the application’s registered users.

| Field | Type | Rules / Validations | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated | Primary Key |
| `name` | String | Required (trimmed) | User's full name |
| `email` | String | Required, Unique | Unique login email |
| `mobileNumber` | String | Optional | User's contact number |
| `location.city`| String | Optional | User's city for neighborhood matching |
| `password` | String | Required, Min length: 6 | Hashed password credential |

### 2. `Item` Schema
Represents items listed by users for exchange.

| Field | Type | Rules / Validations | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Auto-generated | Primary Key |
| `title` | String | Required (trimmed) | Item name / title |
| `description`| String | Required (trimmed) | Details, expiry status, or conditions |
| `owner` | ObjectId | Required, `ref: 'User'` | Foreign Key referring to the creator |

### 3. `SwapRequest` Schema
Represents exchange transactions between two neighbors.

| Field | Type | Rules / Validations | Description |
| :--- | :--- | :--- | :--- |
| `fromUser` | ObjectId | Required, `ref: 'User'` | Neighbor proposing the swap |
| `toUser` | ObjectId | Required, `ref: 'User'` | Neighbor who owns the listing |
| `itemId` | ObjectId | Required, `ref: 'Item'` | Listing being requested |
| `status` | String | Enum: `['pending', 'accepted', 'rejected']` | Request status |

---

## 🚀 Local Development Setup

### Prerequisites
- Install [Node.js](https://nodejs.org) (v18+).
- Have a running [MongoDB Atlas Database](https://mongodb.com/atlas) or a local MongoDB server.

### Step 1 — Configure Environment Settings
Inside `server/`, create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.xxxx.mongodb.net/swapnshare?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

### Step 2 — Run Backend Server
```bash
cd server
npm install
npm run dev
```

### Step 3 — Run React Frontend
Open a **new terminal window**:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Design Patterns & Security Principles

*   **Separation of Concerns (MVC Structure)**: Controllers handle application logic, models validate data constraints, and routes define exposure points.
*   **Axios HTTP Interceptors**: Frontend calls use custom Axios instances that intercept outgoing queries, automatically inject JWT bearer tokens from client local storage.
*   **Middleware-Driven Route Protection**: Route access control is delegated to a decoupled `authMiddleware`.
*   **Input Validation & Security Guardrails**: Mongoose schemas reject malformed strings. Passwords are encrypted utilizing **bcryptjs**.

---

## 📄 License & Contact

Distributed under the MIT License. Developed with 💚 for sustainable neighborhood sharing.
