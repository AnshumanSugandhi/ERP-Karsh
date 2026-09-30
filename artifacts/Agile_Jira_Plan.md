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
3. `[EPC-03]` Vendor Management & Purchase Orders (PO)
4. `[EPC-04]` Manufacturing & BOM
5. `[EPC-05]` Product Costing Engine
6. `[EPC-06]` GST & Tax Compliance
7. `[EPC-07]` Marketplace Reconciliation Engine
8. `[EPC-08]` Returns & Refunds Management
9. `[EPC-09]` Marketing Analytics Integrations
10. `[EPC-10]` Founder Dashboard & KPIs (CM1/CM2)

---

## 3. Sprint Timeline (8 - 10 Weeks)
We will operate on **5 Sprints**, each lasting **2 Weeks**.

| Sprint & Timeline | Focus Area (Epics) | Key Deliverables & Ceremonies |
| :--- | :--- | :--- |
| **Sprint 1**<br/>(Weeks 1 - 2) | `[EPC-01]` Architecture & Setup | - Requirements Gathering & Tech Stack Finalization<br>- DB Schema Design & API Architecture<br>- UI/UX Wireframes<br>**Milestone**: Architecture Sign-off |
| **Sprint 2**<br/>(Weeks 3 - 4) | `[EPC-02]` Inventory<br>`[EPC-03]` Vendors/POs<br>`[EPC-04]` Mfg & BOM | - Core Inventory CRUD operations<br>- PO Workflow and Vendor Portal<br>- Multi-level BOM config<br>**Milestone**: Demo 1 (Core Operations) |
| **Sprint 3**<br/>(Weeks 5 - 6) | `[EPC-05]` Product Costing<br>`[EPC-06]` GST & Tax<br>`[EPC-07]` Recon Setup | - Landed Cost & FIFO/Batch costing logic<br>- B2B/B2C GST Invoicing generation<br>- Foundation for multi-channel data sync<br>**Milestone**: Demo 2 (Costing & Tax) |
| **Sprint 4**<br/>(Weeks 7 - 8) | `[EPC-07]` Marketplace Recon<br>`[EPC-08]` Returns<br>`[EPC-09]` Marketing | - Payment & Fee Audit engine<br>- Return to Origin (RTO) tracking<br>- Meta/Google/Amazon Ad spend API integration<br>**Milestone**: Demo 3 (Analytics & Sync) |
| **Sprint 5**<br/>(Weeks 9 - 10) | `[EPC-10]` Founder Dashboard<br>Testing, UAT, Deployment | - Executive Cockpit UI<br>- CM1/CM2 calculation pipelines<br>- End-to-end System Testing & Bug Fixing<br>- Production Deployment<br>**Milestone**: Final Acceptance & Go-Live |

---

## 4. Agile Ceremonies & Best Practices

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
