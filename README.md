# Team BuzzWare
<p align="center">
  <img src="docs/BuzzWareLogo.png" alt="BuzzWare Logo" width="300">
</p>

# csc-190-191-systemy
CSUS Senior Project by:

Thomas Kone -

Xavier Umeda -

Tuan Ton - tonthattuanst@gmail.com

Rachel Shindelus - rachelfshindelus@gmail.com

Shing Trinh -

Isaac Sclafani -

Serjeoh Nakata - serjeoh.nakata@gmail.com

# Introduction
BuzzWare is a full-stack business management platform built as a senior project for Sacramento State's CSC 190/191 capstone course. The application serves as an all-in-one CRM and operations hub, enabling businesses to manage clients, vendors, projects, leads, and invoices from a single dashboard. It features built-in analytics, activity tracking, automated reminders, email notifications, Gantt chart scheduling, audit logging, and automated lead scoring and recommendations — giving teams real-time visibility into their business relationships and workflows. BuzzWare was created to solve the problem of small businesses relying on disconnected tools for tracking leads, managing projects, and following up with clients. By consolidating these functions into one platform, BuzzWare reduces operational overhead and helps teams stay organized, responsive, and data-driven.

# Branching/Merging Strategy
The `main` branch is the parent branch, the most current version of the application resides here.

Branches should be created by a developer when they are assigned a specific ticket in Jira.

Branch name should be named `sys-#/description-of-card` and spun off of branch `main`.

When acceptance criteria of the card has been met and is ready for review, developer must open a Pull Request, targeting `main`.
The pull request must then be reviewed and approved by another developer if everything checks out. PR reviewer can also leave feedback or criticism as they wish.

This process ensures that developers can get more comfortable with all parts of the codebase as well and as operating as a basic QA proccess.

# Instructions to Run Project Locally
This repository contains both the frontend and backend source code for the project.

## Prerequisites
Ensure you have the following installed before running the project:
- **Node.js** v20.0.0 or newer
- **npm** v10.0.0 or newer

Download from https://nodejs.org if needed. Verify with:
```bash
node -v   # should show v20.x.x or newer
npm -v    # should show 10.x.x or newer
```

> **Note:** `npm install` will fail if your versions are too old — this is enforced via the `engines` field in `package.json`.


## To run the project
Clone the repository:
- git clone https://github.com/kone24/csc-190-191-systemy.git

Navigate to the root folder:
- cd csc-190-191-systemy

Install the backend and frontend dependencies
- npm run install:all	


## FRONTEND
Navigate to the frontend directory:
- cd frontend

Copy the env template and fill in your values:
- cp .env.example .env

Start the frontend dev server:
- npm run dev

View in browser:
- http://localhost:3000/

## BACKEND
Navigate to the backend directory:
- cd backend

Copy the env template and fill in your values:
- cp .env.example .env

Required env variables (see `.env.example` for the full list):
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` — Supabase project credentials
- `CONTACT_FORM_SECRET` — shared secret for external contact form submissions

Start the backend:
- npm run start OR npm run start:dev
- Runs at http://localhost:3001/

# Testing

## Backend Tests
Navigate to the backend directory:
- cd backend

Run unit tests:
```bash
npm run test
```

Run unit tests in watch mode:
```bash
npm run test:watch
```

Run end-to-end tests:
```bash
npm run test:e2e
```

Run tests with coverage report:
```bash
npm run test:cov
```

## Frontend Tests
Navigate to the frontend directory:
- cd frontend

Run unit/component tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

> **Note:** Backend tests use Jest and require a valid `.env` file. E2E tests spin up a full NestJS application instance. Frontend tests use Jest with React Testing Library.

# External Contact Form Integration
The CRM accepts contact form submissions from external client websites via `POST /clients/contact`, authenticated with a shared secret (`X-Api-Secret` header).

Currently integrated with:
- **lightfold.tv** (Squarespace) — Google Apps Script bridges form submissions from a Google Sheet to the CRM. See [`docs/squarespace-apps-script.js`](docs/squarespace-apps-script.js).
- **headword.co** (WordPress / Gravity Forms) — PHP snippet via WPCode plugin sends form data directly to the CRM. See [`docs/headword-gravity-forms-setup.md`](docs/headword-gravity-forms-setup.md).

# Synopsis of Our Project
Headword CRM is a full-stack client management platform with its purpose being to provide workers ease and efficiency in working with 
their clients. Providing a beautiful and functional dashboard page, including necessary and greatly beneficial analytics to efficiently 
track clients, interactions, deliverables, tagging, tasks, and internal workflow. 

# Testing Documents
<p>
  <a href="docs/Testing for Sprint2_Authentication and Verification_CSC190.pdf">
    📄 Sprint 02 – Auth & Verification Testing
  </a>
</p>

<p>
  <a href="docs/Testing For Sprint03- Search Bar and Filtered Search Results.pdf">
    📄 Sprint 03 – Search Bar & Filter Testing
  </a>
</p>

<p>
  <a href="docs/Sys-112-114-115-116 Testing.pdf">
    📄 Sprint 05 –  Logging In Testing
  </a>
</p>

<p>
  <a href="docs/Sprint05_sys-20-80-81-81_Testing.pdf">
    📄 Sprint 05 - Client Profile Description Testing
  </a>
</p>

<p>
  <a href="docs/Sys-28 Send Notification Testing.pdf">
    📄 Sprint 06 - Send Notifications Testing
  </a>
</p>

<p>
  <a href="docs/SYS-27_Schedule-Reminder_TESTING.pdf">
    📄 Sprint 07 - Scheduling a Reminder Testing
  </a>
</p>

<p>
  <a href="docs/SYS-57_Restrict-to-Company-Domain.pdf">
    📄 Sprint 07 - Restricting Access to Company Domain Testing
  </a>
</p>

<p>
  <a href="docs/_SYS-60_Find-User-Record_TESTING.pdf">
    📄 Sprint 07 - Find a User Record Testing
  </a>
</p>

<p>
  <a href="docs/SYS-142-Contacts-Backend_TESTING.pdf">
    📄 Sprint 07 - Backend for Contacts Testing
  </a>
</p>

<p>
  <a href="docs/SYS-27_Schedule-Reminder-Frontend_TESTING.pdf">
    📄 Sprint 08 - Scheduling a Reminder Testing
  </a>
</p>

<p>
  <a href="docs/TESTING_SYS-168_Sync-Company-Emails.pdf">
    📄 Sprint 09 - Enabling Email Notifications Testing
  </a>
</p>

<p>
  <a href="docs/System-Test-Report_BuzzWare.pdf">
    📄 SYSTEM TEST REPORT - Whole System Testing 
  </a>
</p>


# Product Screenshots
<p align="center">
  <img src="docs/LoginPicNew.png" alt="Login Page" width="300">
  <br />
  Google Sign-On for Headword! Members
  <br />
</p>

<p align="center">
  <img src="docs/DashPicNew.png" alt="Dashboard" width="500">
  <br />
  Dashboard overview for tracking contacts, projects, tasks, invoices, and more.
  <br />
</p>

<p align="center">
  <img src="docs/LeadScoring.png" alt="Lead Scoring Panel" width="500">
  <br />
  Lead scoring dashboard panel listing the current five highest scoring leads (contacts).
  <br />
</p>
