<p align="center">
  <a href="https://nextjs.org/" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" width="220" alt="Next.js Logo" />
  </a>
</p>

<h1 align="center">Inventory Management System</h1>

<p align="center">
  A modern, responsive, and scalable <strong>Inventory Management System</strong><br />
  built with <strong>Next.js 16</strong>, <strong>React 19</strong>, and <strong>Tailwind CSS 4</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-v16-000000?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-v5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/NextAuth-v4-7C3AED" alt="NextAuth" />
  <img src="https://img.shields.io/badge/License-UNLICENSED-red.svg" alt="License" />
</p>

---

# 📋 Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js 22.x or later**
- **npm 10.x or later**
- **Git**

---

# 📦 Installation

Clone the repository and install dependencies.

```bash
git clone <repository_url>
cd <project_directory>
npm install
```

---

# ⚙️ Environment Configuration

Rename the provided `.env.example` file to `.env`.

### Linux / macOS

```bash
cp .env.example .env
```

### Windows (Command Prompt)

```cmd
copy .env.example .env
```

Or simply rename the file manually:

```text
.env.example → .env
```

Update the `.env` file with your environment-specific configuration.

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

NEXTAUTH_SESSION_MAX_AGE=604800
NEXTAUTH_JWT_MAX_AGE=604800

API_URL=http://localhost:6000
NEXT_PUBLIC_API_URL=http://localhost:6000
```

> **Note:** Replace the placeholder values with your own configuration before running the application.

---

# ▶️ Running the Application

## Development

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

## Production

Build the application.

```bash
npm run build
```

Start the production server.

```bash
npm run start
```

---

# 📁 Project Structure

```text
.
├── app/
│   ├── (auth)/
│   ├── admin/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── common/
│   ├── forms/
│   ├── layouts/
│   ├── providers/
│   ├── tables/
│   └── ui/
├── constants/
├── hooks/
├── lib/
├── providers/
├── schemas/
├── services/
├── store/
├── types/
├── utils/
├── public/
├── middleware.ts
├── .env.example
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

# 🚀 Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- NextAuth.js
- React Hook Form
- Zod
- TanStack React Table
- DnD Kit
- Recharts
- Lucide React
- Shadcn/UI

---

# 📜 Available Scripts

Start the development server.

```bash
npm run dev
```

Build the application.

```bash
npm run build
```

Start the production server.

```bash
npm run start
```

Run ESLint.

```bash
npm run lint
```

---

# 🌐 Backend API

This frontend communicates with the **Inventory Management System API**.

Configure the backend URL using:

```env
API_URL=http://localhost:6000
NEXT_PUBLIC_API_URL=http://localhost:6000
```

Make sure the backend server is running before starting the frontend.

---

# 📄 License

This project is licensed under the **UNLICENSED** license.
