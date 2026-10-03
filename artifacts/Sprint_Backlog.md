# Sprint Backlogs

## SPRINT 1: Foundation (COMPLETED)
**Goal:** Initialize the project, environments, and base architecture.
- [x] Task: Setup Django backend + SQLite/PostgreSQL (BE1)
- [x] Task: Setup Next.js + Webpack fix + Tailwind (FE)
- [x] Task: Configure CORS and basic routing (BE2)
- [x] Task: Draft Product and Sprint Backlogs (Lead)

---

## SPRINT 2: Inventory & Vendors (CURRENT - ACTIVE SPRINT)
**Goal:** Establish the core data models for Inventory and allow the frontend to render stock tables.

### Backend Tasks
- [x] **BE1-T1**: Create Django Models for `Warehouse`, `Category`, `Product` (SKU, Base Price, Shelf Life Days, etc.).
- [x] **BE1-T2**: Create Django Models for `StockBatch` (MFD, EXP dates) and `StockMovement` (GRN, Transfer, Scrap).
- [x] **BE1-T3**: Write DRF ModelSerializers. Create custom API filters/endpoints for `?status=near_expiry` and `?status=dead_stock`.
- [x] **BE2-T1**: Setup SimpleJWT Authentication in `settings.py` and create Auth endpoints (`/api/v1/auth/login/`).
- [x] **BE2-T2**: Create CRUD ViewSets for Products and Warehouses. Provide Postman/Swagger mocks to FE.

### Frontend Tasks
- [x] **FE-T1**: Setup Axios API client with JWT interceptors (to auto-attach tokens).
- [x] **FE-T2**: Build the Main Dashboard Layout (Sidebar navigation).
- [x] **FE-T3**: Build the "Product Master List" Data Table UI using Tailwind.
- [x] **FE-T4**: Build the "Dead Stock & Expiry Alerts" widget/banner on the main dashboard to immediately flag at-risk items.
- [x] **FE-T5**: Build the "Add New Product / GRN" Modal ensuring fields for MFD and EXP are present.

---

## SPRINT 3: Manufacturing & BOM (UPCOMING)
**Goal:** Connect Raw Materials to Finished Goods via Multi-Level BOMs.

### Backend Tasks
- [ ] **BE1-T1**: Create Models for `BillOfMaterial` (Parent Product, Child Material, Quantity).
- [ ] **BE1-T2**: Create `WorkOrder` Models and logic to auto-deduct Raw Materials on completion.
- [ ] **BE2-T1**: Expose APIs for BOM management.
- [ ] **BE2-T2**: Create Wastage tracking logic in the database.

### Frontend Tasks
- [ ] **FE-T1**: Build BOM Tree-View UI.
- [ ] **FE-T2**: Build Work Order kanban/list board (Pending, In Progress, Completed).

*(Further Sprints will be detailed in planning sessions as velocity is established).*
