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

## SPRINT 3: Advanced WMS & Digital Mapping (UPCOMING)
**Goal:** Digitally map the physical warehouse layout down to the bin level.

### Backend Tasks
- [ ] **BE1-T1**: Create Hierarchical Models for `Zone`, `Aisle`, `Rack`, `Shelf`, and `Bin` attached to `Warehouse`.
- [ ] **BE1-T2**: Update `StockBatch` and `StockMovement` to track exact `Bin` locations.
- [ ] **BE2-T1**: Expose DRF ViewSets for WMS Hierarchy with nested serializers.
- [ ] **BE2-T2**: Create API for calculating capacity/utilization per bin.

### Frontend Tasks
- [ ] **FE-T1**: Build WMS Configuration UI to define Zones, Aisles, Racks.
- [ ] **FE-T2**: Build Interactive Visual Warehouse Grid map.

*(Further Sprints will be detailed in planning sessions as velocity is established).*

