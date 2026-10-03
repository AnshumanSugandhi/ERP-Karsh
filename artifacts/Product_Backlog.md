# Comprehensive Product Backlog

This backlog contains the end-to-end user stories and requirements for the ERP System, prioritized for the development team.

## EPIC 1: Architecture & Foundation (COMPLETED)
- [x] **STORY**: As a developer, I need the Django backend structure with PostgreSQL/SQLite, CORS, and DRF setup.
- [x] **STORY**: As a frontend dev, I need Next.js, Tailwind, and Webpack configured to avoid Windows build errors.

## EPIC 2: Inventory & Warehouse Management (CURRENT)
- **STORY-2.1**: As an admin, I can create, edit, and disable multiple Warehouse locations (Central, Production, 3PL).
  - *Acceptance Criteria*: Warehouse model includes location, capacity, and manager ID.
- **STORY-2.2**: As a warehouse worker, I can record Stock Movements (GRN, Transfers, Scrap).
  - *Acceptance Criteria*: System requires source and destination for transfers. Scrap movements require a reason code.
- **STORY-2.3**: As a manager, I receive automated Reorder Alerts.
  - *Acceptance Criteria*: System flags items dropping below 'Safety Stock' thresholds.
- **STORY-2.4**: As an inventory manager, I can track Manufacturing Date (MFD), Expiry Date (EXP), and Shelf Life for products at the batch level.
- **STORY-2.5**: As a manager, I see immediate dashboard alerts for 'Dead Stock' (non-moving inventory) and 'Near-Expiring' products so I can take action.

## EPIC 3: Vendor Management & Purchase Orders
- **STORY-3.1**: As a procurement officer, I can maintain a Vendor Master list (terms, lead times, pricing history).
- **STORY-3.2**: As a buyer, I can generate and send Purchase Orders (POs) through an approval workflow.
- **STORY-3.3**: As a finance officer, I can perform a 3-Way Match (PO, GRN, Vendor Invoice) before payment clearance.

## EPIC 4: Manufacturing & BOM
- **STORY-4.1**: As a production manager, I can create Multi-Level Bills of Materials (BOM) for finished goods.
- **STORY-4.2**: As a floor worker, I can start and complete Production Work Orders.
  - *Acceptance Criteria*: Completing an order automatically deducts raw materials from inventory based on the BOM.
- **STORY-4.3**: As a manager, I can view Wastage & Yield Analysis reports.

## EPIC 5: Product Costing Engine
- **STORY-5.1**: As a financial analyst, I need the system to auto-calculate Landed Costs (materials + freight + duties).
- **STORY-5.2**: As the system, I will maintain Batch & Lot Costing using FIFO methods.
- **STORY-5.3**: As a founder, I receive Cost Variance Alerts if raw material price hikes compress margins.

## EPIC 6: GST & Tax Compliance
- **STORY-6.1**: As a billing clerk, I can generate B2B and B2C GST-compliant invoices with HSN/SAC codes.
- **STORY-6.2**: As an accountant, I can export automated GSTR-1 and GSTR-3B reconciliation reports.
- **STORY-6.3**: As a logistics manager, I can generate E-Way Bills directly via API integration.

## EPIC 7: Marketplace Reconciliation Engine
- **STORY-7.1**: As a marketplace manager, I can sync sales orders and payouts from Amazon, Flipkart, and D2C.
- **STORY-7.2**: As a finance auditor, I can view Payment & Fee Audits to spot overcharged commissions.
- **STORY-7.3**: As a user, I can export Discrepancy Reports to open dispute tickets with marketplaces.

## EPIC 8: Returns & Refunds Management
- **STORY-8.1**: As a warehouse worker, I can log RTOs (Return to Origin) vs. Customer Returns.
- **STORY-8.2**: As the system, I will route returned stock to 'Sellable' or 'Damaged' buckets.
- **STORY-8.3**: As a finance officer, I can quantify total Financial Refund Losses (reverse logistics penalties).

## EPIC 9: Marketing Analytics Integrations
- **STORY-9.1**: As a marketer, I can connect Meta Ads and Google Ads APIs.
- **STORY-9.2**: As an analyst, I can view Blended ROAS and Marketing Efficiency Ratios (MER) in real-time.

## EPIC 10: Founder Dashboard & KPIs (CM1/CM2)
- **STORY-10.1**: As a founder, I can view Contribution Margin 1 (CM1) and Contribution Margin 2 (CM2) down to the SKU level.
- **STORY-10.2**: As a founder, I have an Executive Cockpit showing daily revenue, cash flow, and RTO percentages.
- **STORY-10.3**: As a founder, I can click high-level metrics to Drill-Down into individual batch order numbers.
