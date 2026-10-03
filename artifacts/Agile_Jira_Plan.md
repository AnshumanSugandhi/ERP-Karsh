# Agile Project Plan & Jira Configuration

This document outlines the Agile project management strategy to deliver the ERP system from scratch to deployment within the **8 to 10-week** timeline stipulated in the commercial proposal.

## 1. Jira Project Setup
To effectively manage this project, set up a **Jira Software** project using the **Scrum** framework.

### Recommended Configuration
* **Project Type**: Software Development (Scrum)
* **Issue Types**:
  * `Epic`: High-level modules (e.g., Inventory Management).
  * `Story`: User requirements within an Epic (e.g., As a warehouse manager, I want to track GRN).
  * `Task`: Technical tasks (e.g., Setup PostgreSQL database).
  * `Sub-task`: Smaller steps within a story/task.
  * `Bug`: Defects found during testing/UAT.
* **Workflow (Board Columns)**:
  * `To Do` -> `In Progress` -> `Code Review` -> `QA / Testing` -> `UAT (Client Demo)` -> `Done`

---

## 2. Epics List
Create the following Epics in your Jira Backlog:
1. `[EPC-01]` Architecture & Foundation Setup
2. `[EPC-02]` Inventory & Warehouse Management
3. `[EPC-03]` Advanced WMS & Digital Mapping
4. `[EPC-04]` Vendor Management & Purchase Orders (PO)
5. `[EPC-05]` Manufacturing & BOM
6. `[EPC-06]` Product Costing Engine
7. `[EPC-07]` GST & Tax Compliance
8. `[EPC-08]` Marketplace Reconciliation Engine
9. `[EPC-09]` Returns & Refunds Management
10. `[EPC-10]` Marketing Analytics Integrations
11. `[EPC-11]` Founder Dashboard & KPIs (CM1/CM2)

---

## 3. Team Allocation & Workflow
Given the team size (**1 Frontend Developer, 2 Backend Developers**), the Backend will naturally outpace the Frontend. To prevent the FE from becoming a bottleneck, we will adopt an **API-First Development** approach.

*   **Backend Dev 1 (Lead)**: Database Architecture, Core Business Logic (Costing, CM1/CM2 Engines), and Tax Compliance.
*   **Backend Dev 2**: User Auth, CRUD APIs (Inventory, Vendors), Third-party integrations (Marketplaces, Ad Platforms), and background workers (Celery).
*   **Frontend Dev (Solo)**: UI/UX Component Library (Tailwind/Shadcn), State Management, API integration, and Dashboard views.

*Workflow Rule*: Backend developers MUST provide Swagger/Postman API documentation with mock responses *before* completing their Jira tickets. This allows the Frontend Developer to build UIs against the mocks without waiting for the final backend code.

---

## 4. Sprint Timeline (Parallel Tracks)
We will operate on **5 Sprints**, each lasting **2 Weeks**.

| Sprint & Timeline | Backend Focus (2 Devs) | Frontend Focus (1 Dev) | Milestone |
| :--- | :--- | :--- | :--- |
| **Sprint 1**<br/>(Weeks 1-2) | - DB Schema & Auth Setup<br>- API endpoints for Inventory & POs | - Next.js/Tailwind Boilerplate setup<br>- UI Component Library (Buttons, Tables, Modals)<br>- Mocking Inventory UI | Architecture Sign-off |
| **Sprint 2**<br/>(Weeks 3-4) | - Advanced WMS Mapping APIs<br>- Bin-level Stock Tracking | - WMS Mapping UI (Aisles/Racks)<br>- Interactive Warehouse Grid | Demo 1 (Core Ops) |
| **Sprint 3**<br/>(Weeks 5-6) | - Vendor & PO APIs<br>- Manufacturing & BOM Logic | - Purchase Order Dashboard<br>- BOM Tree Views | Demo 2 (Procurement & BOM) |
| **Sprint 4**<br/>(Weeks 7-8) | - Marketplace Reconciliation Engine<br>- Marketing API Integrations (Ads) | - Reconciliation Dispute UI<br>- Returns & Refunds Management UI | Demo 3 (Analytics) |
| **Sprint 5**<br/>(Weeks 9-10) | - CM1/CM2 Profitability Engine APIs<br>- End-to-end bug fixing | - Founder Dashboard (Charts/Graphs)<br>- Live Operational KPIs UI<br>- UAT & Deployment | Final Go-Live |

---

## 5. Agile Ceremonies & Best Practices

1. **Sprint Planning (Start of Sprint)**
   * Move stories from the Backlog into the active Sprint.
   * Assign story points (effort estimation) to tasks.
2. **Daily Stand-ups (15 mins)**
   * What did I do yesterday? What will I do today? Are there any blockers?
3. **Weekly Client Demos (End of Week 4, 6, 8)**
   * Demonstrate working software to the client (Rishikesh Jha) to ensure alignment and gather early feedback.
4. **Sprint Retrospective (End of Sprint)**
   * Internal team discussion: What went well? What can be improved for the next sprint?

## 5. Development Workflow (Git Flow)
To tie Jira into the development cycle:
1. Developers create a branch using the Jira ticket ID (e.g., `feature/EPC-02-inventory-tracking`).
2. Commit messages should include the ticket number for automatic linking in Jira (e.g., `git commit -m "EPC-02: Added GRN tracking logic"`).
3. Pull Requests (PRs) must be reviewed before merging into the `develop` or `main` branch.
4. CI/CD pipelines automatically run tests on PRs and deploy to a Staging server for QA.


