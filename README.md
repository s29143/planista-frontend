# Planista – Frontend

Frontend application for the **Planista** system – a web-based platform for managing orders, processes, and related business entities.

The UI is built with **React** and communicates with the backend via a REST API.

---

## Table of Contents

- [Planista – Frontend](#planista--frontend)
  - [Table of Contents](#table-of-contents)
  - [Technology Stack](#technology-stack)
  - [Architecture](#architecture)
    - [Typical data flow:](#typical-data-flow)
    - [Validation:](#validation)
    - [Requirements](#requirements)
    - [Configuration](#configuration)
  - [Build](#build)
  - [Internationalization (i18n)](#internationalization-i18n)

---

## Technology Stack

- **React** (see `package.json` for exact version)
- **TypeScript**
- **Vite** (dev server + build)
- **Mantine** (UI components)
- **zustand** (state management)
- **react-router-dom** (routing)
- **axios** (HTTP client)
- **zod** (schema validation)
- **i18next** (internationalization)
- **lucide-react** (icons)

---

## Architecture

The frontend follows a **feature-based structure**:

- each domain (e.g. orders, processes, companies) contains its own UI, model/types, and API calls
- shared components and utilities live in a common `shared/` area

#### Typical data flow:

```text
UI (pages/components) → store (zustand) → API (axios) → backend
```

#### Validation:

- Form validation and request payload validation is handled with zod

- Backend errors are displayed to the user via UI notifications

#### Requirements

Node.js (LTS recommended)

npm (or pnpm/yarn if your project uses it)

#### Configuration

Create a .env file in the repository root (or copy from .env.example if present):

```env
VITE_API_URL=http://localhost:8080
VITE_API_URL should point to the backend base URL.
```

Running the Application
Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:5173
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Internationalization (i18n)

Translations are handled by i18next.

Translation files are stored in the project `public/locales/**/**.json`

UI text should be added via t("key") instead of hardcoding strings

Related Repositories:
👉 [Planista Backend](https://github.com/s29143/planista-backend)
