# SRK Innovations - Order Management System
## Project State & Handover Summary (Session Backup)

**Date:** 05 September 2026  
**Live Subdomain:** [https://srkorder.radical-global.com/](https://srkorder.radical-global.com/)  
**GitHub Repository:** `https://github.com/diycircuits/srk-order.git` (Branch: `main`)  
**Deployment Pipeline:** GitHub Actions FTPS auto-deploy to Hostinger (`/public_html/srkorder/`)

---

### 1. Brand & Design System
* **Brand Identity:** SRK Innovations ([www.srkinnovations.com](https://www.srkinnovations.com))
* **Theme Colors:** Corporate Cobalt Blue (`#0062bd` / `bg-blue-600` / `from-blue-600 to-indigo-600`)
* **Company Tagline:** Official SRK Industrial RFID, Automation & Order Dispatch Gate

---

### 2. Completed Tasks in this Session

1. **Brand Theme Update:**
   * Switched active color theme to SRK Innovations' signature corporate Cobalt Blue.

2. **Cleaned Modules & Subsystems (as instructed):**
   * Removed Zoho Financials
   * Removed Sales Pipeline
   * Removed Outstanding Payments
   * Removed Packing, QC & RFID/Barcode Verification Gate
   * Removed Human Resources (HRM)
   * Removed Collaboration & Projects Hub
   * Removed Service, RMA & Warranty Tickets
   * Removed Executive Reports & Analytics
   * Removed Internal Alerts & SLA Delay Center
   * Removed Zoho Books API references
   * Removed the blue categories sub-navbar below the header
   * Removed the top announcement bar / phone & email banner
   * Removed the "Live ERP" badge and domain subtitle from the header

3. **Editable Customer Account & Order Line Items:**
   * Converted `Customer Account` from rigid dropdown into an editable input field with instant datalist auto-suggestions. Users can type any new customer name or pick from existing accounts (which auto-fills address/phone/email/GSTIN).
   * Made line items fully editable:
     - Item Description input with catalog suggestions.
     - Rate / Unit Price (₹) editable number field.
     - Quantity editable field.
     - Real-time subtotal & total recalculation.

4. **SKU Removal:**
   * Removed SKU inputs, tags, and column headers from the line items and invoice table as requested.

5. **"Book & Run Auto Stock Check" Button Fix:**
   * Resolved the button issue by adding resilient offline/static fallback in `AppContext.jsx` (`addOrder`).
   * Orders are now immediately booked and reflected in state even on static hosting without backend Node dependency.
   * Added submitting spinner feedback and guaranteed auto-close of the modal.

---

### 3. Current Live Status
* **Build Status:** Passed (`vite build` clean, 0 errors).
* **GitHub Actions Deployment:** Completed successfully (`status: completed`, `conclusion: success`).
* **Live Site:** `https://srkorder.radical-global.com/` returning HTTP 200 OK.

---

### 4. Ready for Next Session (Tomorrow)
Whenever you are ready tomorrow, we can pick up from here:
- Adding any new custom fields or features.
- Further customizing invoice prints or dispatch slips.
- Fine-tuning any other screens or workflows as needed.
