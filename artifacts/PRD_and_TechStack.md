# Product Requirements Document (PRD)
**Project Name**: Custom Enterprise ERP & Analytics Management System
**Client**: K.A.R.S.H Technologies Pvt. Ltd. (Proprietor: Rishikesh Jha)
**Timeline**: 8 to 10 Weeks
**Budget**: ₹42,000 INR

## 1. Executive Summary
This document outlines the product requirements and technical architecture for a comprehensive ERP & Analytics Management System. The system is designed to streamline end-to-end operations, from inventory and manufacturing to complex profitability analysis (CM1/CM2), multi-channel e-commerce reconciliation, and GST compliance.

## 2. Core Modules & Features (Scope)

### Epic 1: Inventory & Warehouse Management
* **Multi-Location Tracking**: Real-time tracking across central warehouses, production floors, and 3PL hubs.
* **Stock Movements**: Automated tracking of GRN (Goods Received Notes), transfers, scrap, and dispatch.
* **Reorder Automation**: Low-stock triggers, safety stock thresholds, and alerts.

### Epic 2: Manufacturing & Bill of Materials (BOM)
* **Multi-Level BOM**: Configuration for raw materials, packaging, and sub-assemblies.
* **Production Work Orders**: Creation, tracking, and auto-deduction of raw materials.
* **Wastage & Yield Analysis**: Variance tracking (expected vs. actual yield) and scrap monitoring.

### Epic 3: Product Costing
* **Landed Cost Calculation**: Raw material + direct labor + freight + duties + packaging.
* **Batch & Lot Costing**: Real-time updates via FIFO/Weighted Average.
* **Cost Variance Tracking**: Alerts for raw material price hikes breaching margins.

### Epic 4: CM1 & CM2 Profitability Engine
* **Contribution Margin 1 (CM1)**: Net Sales Revenue - Direct Product Cost.
* **Contribution Margin 2 (CM2)**: CM1 - Variable Logistics, Marketplace Fees, Payment Gateway, Shipping, & Returns.
* **SKU & Channel Granularity**: Real-time profitability per SKU/category/channel (Amazon, Flipkart, D2C).

### Epic 5: Marketplace Reconciliation
* **Multi-Channel Sync**: Automated sync for sales orders, payouts, and fees.
* **Payment & Fee Audit**: Expected vs. actual payouts, flagging overcharged commissions/shipping penalties.
* **Discrepancy Reporting**: Exportable dispute claim sheets for marketplace support.

### Epic 6: Purchase Orders & Vendor Management
* **Vendor Master & Portal**: Supplier performance, lead times, pricing history.
* **PO Workflow**: Auto PO generation, approval workflow, partial fulfillment, pending balances.
* **Vendor Invoicing**: 3-Way Matching (PO, GRN, Vendor Invoice) prior to clearance.

### Epic 7: GST & Tax Reporting
* **Automated GST Invoicing**: B2B/B2C compliant, HSN/SAC codes, CGST/SGST/IGST slabs.
* **Tax Reconciliation**: Automated GSTR-1 and GSTR-3B monthly reports.
* **E-Way Bill/E-Invoice**: API framework ready for ClearTax/MasterIndia integration.

### Epic 8: Marketing Analytics Integration
* **Ad Platform Integration**: Aggregate spend from Meta Ads, Google Ads, Amazon/Flipkart Ads.
* **Blended ROAS & MER**: Real-time ROAS and Marketing Efficiency Ratio tracking.
* **CAC & LTV Metrics**: Customer Acquisition Cost vs. Contribution Margins.

### Epic 9: Returns & Refunds Management
* **RTO & Customer Returns**: Separate tracking with reason mapping.
* **Restock vs. Damaged Flow**: Automated stock routing (sellable vs. damaged).
* **Financial Refund Loss**: Quantify reverse logistics penalty costs in CM2.

### Epic 10: Founder Dashboard (Real-Time KPIs)
* **Executive Cockpit**: Daily revenue, net cash flow, order count, gross profit.
* **Live Operational KPIs**: Inventory valuation, pending PO balances, un-reconciled amounts, RTO %.
* **Drill-Down Analytics**: High-level metrics to individual batch order numbers.

---

## 3. Proposed Tech Stack Architecture

To support the requirement of starting as a web application and eventually transitioning to a standalone software application, an **API-first architecture** is highly recommended. 

### Backend (Server-Side)
* **Framework**: Python + Django 
* **API Layer**: Django REST Framework (DRF)
  * *Reasoning*: Django's robust built-in ORM and admin panel provide rapid out-of-the-box management. DRF will serve APIs so the same backend can seamlessly power a website now, and a desktop/mobile application later without rewriting core logic.
* **Language**: Python 3.11+

### Database & Caching
* **Primary Database**: PostgreSQL
  * *Reasoning*: An enterprise relational database is mandatory for complex financial, transactional, and ERP data integrity. Perfectly complements Django.
* **Caching/Queue**: Redis + Celery
  * *Reasoning*: Necessary for processing background tasks, such as syncing marketplace data, crunching large analytics, and calculating CM1/CM2 metrics asynchronously.

### Frontend (Client-Side)
* **Framework**: React / Next.js
* **Styling**: Tailwind CSS
  * *Reasoning*: A separate SPA (Single Page Application) frontend communicating with Django APIs ensures the smoothest web experience and sets the stage for easy porting to a standalone software app (e.g., via Electron or Tauri) in the future.

### DevOps & Infrastructure (Client-Owned)
* **Hosting**: DigitalOcean Droplet or AWS EC2 (Ubuntu Linux).
* **Containerization**: Docker & Docker Compose.
* **Web Server / Reverse Proxy**: Nginx + Gunicorn.

---

## 4. System Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend [Web App / Future Software]
        UI[React UI]
        Dash[Analytics Dashboards]
    end

    subgraph Backend [Backend Server - Django]
        API[Django REST Framework API]
        Admin[Django Admin / Auth]
        Engine[Reconciliation Engine]
        Celery[Celery Background Workers]
    end

    subgraph Database [Data Layer]
        PG[(PostgreSQL)]
        Cache[(Redis)]
    end

    subgraph External [External APIs & Services]
        MP[Marketplaces: Amazon/Flipkart/D2C]
        Ad[Ads: Meta/Google]
        Tax[GST/E-Way Bill: ClearTax]
    end

    UI -->|HTTPS (JSON)| API
    Dash -->|HTTPS (JSON)| API
    API <--> Admin
    API <--> Engine
    Engine <--> PG
    Celery <--> Cache
    Celery <--> PG
    Celery <--> MP
    Celery <--> Ad
    API <--> Tax
```
