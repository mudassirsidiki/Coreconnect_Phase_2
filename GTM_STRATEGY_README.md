# Ideal Customer Profile & Go-To-Market (GTM) Strategy Guide

This module provides a structured, responsive B2B questionnaire for clients to articulate their Ideal Customer Profile (ICP), target market parameters, sales channels, and engagement governance. Upon submission, it renders a read-only, C-suite-ready strategy document that mirrors your internal GTM spreadsheet and exports to Excel/CSV, PDF/print, and Markdown/text.

---

## 1. How to Run Locally

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.
3. **Navigate to the Page**:
   In the left sidebar under the **Account Business Plan** section, click **Go to Market Strategy**.

---

## 2. File Architecture

| File Path | Description |
|---|---|
| `lib/gtm-types.ts` | Comprehensive TypeScript interfaces and data models for all 13 sections. |
| `lib/gtm-config.ts` | Centralized config file for dropdown options, default values, prefilled items, and timezones. |
| `components/business-plan/GoToMarketStrategyPage.tsx` | Main page view managing wizard state, local storage auto-save, and toggle between editing and summary modes. |
| `components/business-plan/gtm/GtmWizardForm.tsx` | 4-step interactive wizard with progress bar, inline validation, and priority conflict detection. |
| `components/business-plan/gtm/GtmCompletedSummary.tsx` | Read-only executive document view with print/PDF, CSV export, text copy, and API submission. |
| `components/business-plan/gtm/SectionCard.tsx` | Accessible section container with badges and section numbering. |
| `components/business-plan/gtm/PriorityPicker.tsx` | 1–5 priority ranking widget with duplicate collision detection. |
| `components/business-plan/gtm/RepeatableRows.tsx` | Dynamic table/card row builder for Named Accounts, Conferences, and Contacts. |
| `components/business-plan/gtm/ChipInput.tsx` | Tag/chip entry field for custom titles and regions. |
| `components/business-plan/gtm/SummaryCard.tsx` | Polished executive summary card with priority badges. |
| `app/api/gtm-submissions/route.ts` | Backend POST endpoint placeholder for receiving strategy JSON payloads. |

---

## 3. How to Edit Questionnaire Options (No Component Changes Needed)

All options, prefill choices, and defaults are centralized in **`lib/gtm-config.ts`**:

- **Products & Offerings**: Modify `GTM_CONFIG.products.prefilledList`.
- **Target Countries & Regions**: Modify `GTM_CONFIG.geography.countries` and `GTM_CONFIG.geography.prefilledRegions`.
- **Subcontractor Trades**: Modify `GTM_CONFIG.industry.subContractorTrades`.
- **Company Size Tiers**: Modify `GTM_CONFIG.companySize.employeeRanges` or `revenueRanges`.
- **Job Titles**: Modify `GTM_CONFIG.jobTitles.prefilledList`.
- **CRM Providers**: Modify `GTM_CONFIG.crm.providers`.
- **Weekly Meeting Cadence**: Modify `GTM_CONFIG.weeklyMeeting.daysOfWeek` and `timeZones`.
- **Communication Modes**: Modify `GTM_CONFIG.communicationModes`.

---

## 4. How to Connect the Backend

The submit button on the **Completed GTM Strategy** summary triggers a POST request to `/api/gtm-submissions`.

To connect to an external CRM, database, or webhook (e.g. HubSpot, Supabase, Airtable, or Make/Zapier):

1. Open `app/api/gtm-submissions/route.ts`.
2. Replace or augment the handler:
   ```ts
   export async function POST(request: Request) {
     const payload = await request.json()
     
     // Example: Forward to external webhook or database
     // await fetch(process.env.CRM_WEBHOOK_URL, {
     //   method: 'POST',
     //   body: JSON.stringify(payload)
     // })

     return NextResponse.json({
       success: true,
       submissionId: `GTM-${Date.now()}`
     })
   }
   ```
3. Add your environment variables in `.env.local` if needed.

---

## 5. Exports & Spreadsheets

- **Download as Excel/CSV**: Generates a CSV file matching the internal GTM spreadsheet format (sections grouped as blocks with priorities in the adjacent column).
- **Print / PDF**: Leverages CSS `@media print` rules to hide UI chrome and format a clean, multi-page strategy document suitable for client delivery.
- **Copy as Text**: Copies Markdown-formatted text to the clipboard for easy pasting into Notion, Slack, or Google Docs.
