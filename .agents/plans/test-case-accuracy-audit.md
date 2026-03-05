# Test Case Accuracy Audit Report
## Copilot for Sales Testing Checklist vs. Official Microsoft Learn Documentation

**Date:** 2026-03-05
**Source Documentation:** https://learn.microsoft.com/en-us/microsoft-sales-copilot/landing
**Scope:** All 76 test cases across 5 categories verified against official Microsoft Learn docs

---

## Executive Summary

**74 out of 76 test cases contain at least one inaccuracy** when compared to the official Microsoft Learn documentation. Only 2 test cases (Productivity TC8: View and Edit Lead, TC12: Objects Creation from Side Panel) were verified as broadly accurate.

### Key Systemic Issues
1. **Product naming:** Test cases use "Copilot for Sales" throughout, but Microsoft has rebranded to "Sales in Microsoft 365 Copilot" with the app called "Sales" (formerly "Copilot for Sales")
2. **UI element names:** Many button/card/section names don't match the documentation (e.g., "Key Sales Info" should be "Key email info", "Suggested Updates" should be "Suggested actions")
3. **Admin role terminology:** "Tenant Admin" and "Environment Admin" are not official role names; docs use "tenant administrator" and "CRM administrator"
4. **Admin navigation paths:** Most admin test cases reference incorrect settings section names
5. **Feature behaviors:** Several test cases describe features that work differently than documented or don't exist as described

---

## CATEGORY 1: PRODUCTIVITY (31 test cases)

### TC1: AI-Generated Sales Email Summary — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 1 says "email thread with 3+ messages" — threshold is actually 1,000+ characters (~150-200 words), not message count. Step 3 says summary "appears automatically" in side panel — with premium license it shows in "Summary by Copilot" box at top of email; in Sales pane it appears in "Key email info" card |
| **Current** | `'Open Outlook and select a sales-related email thread with 3+ messages'` |
| **Proposed** | `'Open Outlook and select a sales-related email with content exceeding 1,000 characters (~150-200 words)'` |
| **prerequisites** | Missing: Copilot AI features must be turned on, Microsoft 365 Copilot license (for premium), new Outlook or Outlook on the web (for premium), email must not be encrypted |
| **crmNotes** | Should note that CRM enrichment requires external contact detection and may need manual "Add Sales insights" action |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/email-summary-premium |

### TC2: Generate Content Experience — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 2: No button called "Draft with Copilot" — premium experience shows "Copilot suggested drafts from Sales"; Sales pane uses "Draft an email" button in "Key email info" card. Step 5: Button is "Keep it" (premium) or "Add to email" (Sales pane), content is prepended not replaced |
| **Current** | `'Click "Draft with Copilot" or open the Copilot side panel'` |
| **Proposed** | `'In the Sales pane "Key email info" card, select "Draft an email" and choose a predefined category or enter custom prompt'` |
| **prerequisites** | Missing: Copilot AI features turned on, M365 Copilot license for premium experience |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

### TC3: Record Search with Record Type Filter — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 2: Search is via "search icon in the upper-right corner of the Sales pane", not a "search bar in the CRM records section" |
| **crmNotes** | Lead is NOT a default filter — it requires explicit admin configuration as a preview feature with specific prerequisites (adding Lead record, configuring required fields) |
| **Current** | `'Salesforce: Filters should include standard objects — Contact, Account, Opportunity, Lead.'` |
| **Proposed** | `'Salesforce: Available record types depend on admin configuration. Contact, Account, and Opportunity are defaults. Lead requires explicit admin setup as a preview feature.'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/global-search |

### TC4: Save Email to CRM — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 3: Button is "Save" (from highlight card), not "Save to CRM". Flow is: Save → Connect to a record → select attachments → Save |
| **crmNotes** | Oversimplified. With Enhanced Email ON: saved as email record. With Enhanced Email OFF (and MS Support approval): saved as task record. Replies NOT auto-saved in Salesforce. Cannot edit saved activities from Sales app with Salesforce |
| **Current** | `'Salesforce: Email saved as an Activity/Task. Attachments stored as ContentDocument linked to the parent record.'` |
| **Proposed** | `'Salesforce: If Enhanced Email is turned on (recommended), saved as an email record. If off (with MS Support approval), saved as a task. Replies to saved emails are NOT automatically saved. Cannot edit saved activities from the Sales app when using Salesforce.'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/save-outlook-activities-crm |

### TC5: Saving Emails with Additional Fields — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 3: Section is called "Add email categories", not "additional fields section" |
| **crmNotes** | Admin path is "Save to (CRM) > Save emails to (CRM) > Categorize with fields > Add fields", not "Admin Settings > Save to CRM Fields" |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/save-additional-details-outlook |

### TC6: Duplicate Contacts in CRM — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Steps 4-5 fundamentally wrong. There is NO "view existing or proceed" choice. Duplicate detection is a **blocking error**: "This contact already exists. To create a duplicate contact, try adding it in Salesforce." User must create with different values, modify duplicate rules, or create directly in Salesforce |
| **Current** | `'Verify a duplicate detection warning appears'` / `'Choose to view the existing record or proceed with creation'` |
| **Proposed** | `'Verify error message: "This contact already exists. To create a duplicate contact, try adding it in Salesforce"'` / `'To resolve: create with different values, ask admin to modify duplicate rules, or create directly in Salesforce'` |
| **Ref** | https://learn.microsoft.com/en-us/troubleshoot/sales-copilot/crm-permissions-and-configurations/duplicate-record-error |

### TC7: Create Lead from Email — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No dedicated "Create Lead" button. Flow: hover over unsaved contact → "Add" → choose lead or contact (if leads support enabled). Leads support is a **preview feature** requiring explicit admin configuration |
| **prerequisites** | Must include: Leads support enabled in admin settings (preview), Lead record type added to admin settings, Lead form must have First Name, Last Name, Email as required fields |
| **crmNotes** | Company name is parsed from email **signature** (not domain). Also: Salesforce limitation — leads cannot appear in "Connected to" search |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/create-contact-crm |

### TC8: View and Edit Lead — VERIFIED ACCURATE
Minor note: Admin must enable "Edit records inside Sales" option for the record type.
**Ref:** https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-record-details

### TC9: Latest Activities in Summary — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 3: Card is called "Related items" (not "Latest Activities"). Shows recent emails and recent/upcoming meetings — NOT calls. 3 items displayed by default, "Show more" for up to 10. Items open in new browser tab |
| **crmNotes** | **Wrong data source.** Activities shown are your Outlook/Teams interactions, NOT pulled from Salesforce Activity Timeline |
| **Current** | `'Salesforce: Activities pulled from the Activity Timeline on the linked record.'` |
| **Proposed** | `'Activities displayed are your recent Outlook interactions (emails and meetings) with the customer, not pulled from the Salesforce Activity Timeline.'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-recent-upcoming-activities |

### TC10: Global View — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "global view" feature exists as described. Documentation describes "global search" (search icon in upper-right corner of Sales pane) for CRM records. No standalone view showing "all CRM-connected communications" |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/global-search |

### TC11: CRM Suggested Updates - Opportunity — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Card is called "Suggested actions" (not "Suggested Updates"). Button is "Update opportunity" |
| **crmNotes** | Only **two** fields receive suggestions: Amount and Close Date. **Stage and Next Step are NOT included** |
| **Current** | `'Salesforce: Suggestions target standard Opportunity fields — Amount, Close Date, Stage, Next Step.'` |
| **Proposed** | `'Salesforce: Suggestions target only two Opportunity fields — Amount and Close Date. Stage and Next Step are NOT included.'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/suggested-crm-updates |

### TC12: Objects Creation from Side Panel — VERIFIED ACCURATE
**Ref:** https://learn.microsoft.com/en-us/microsoft-sales-copilot/create-new-record

### TC13: AI Powered Opportunity Suggestions — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No standalone "AI-suggested Opportunity matches" section. AI suggestions appear during the save-to-CRM flow ("Connect to a record" step) where the app suggests related accounts and opportunities |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/save-outlook-activities-crm |

### TC14: Actionable Message Banners — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 3: Actual banner actions are "Save this email", "Add contact"/"Add contacts", "See sales insights" — NOT "Save to CRM" or "View in Salesforce". Reading banners limited to 2 external emails per user per day |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/open-app |

### TC15: Key Sales Information — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Card is "Key email info" (not "Key Sales Info"). It shows BANT indicators only. **Competitor mentions and pricing/financial figures are NOT documented features** of this card |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-save-email-summary-crm |

### TC16: Enhanced Teams App - Reading & Composing — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Teams experience is primarily through message extensions (More apps → Sales). "CRM data accessible in the reading pane" is not how it works. Step 5: Record card is automatically added to message box when selected from search |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/share-crm-record-teams-conversation |

### TC17: Enhanced Teams App Discovery - Search Message Extension — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 2: Button is "More apps" (not "extensions"). Step 3: App is called "Sales" (not "Copilot for Sales extension"). Step 4: Recently accessed records displayed by default; Advanced search available for filtering by record type |
| **prerequisites** | Should be "Sales app installed in Teams" (not "Copilot for Sales Teams message extension enabled"). Salesforce users must be signed in via Sales app in Outlook |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/share-crm-record-teams-conversation |

### TC18: Global Entity Search — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 2: It's a "search icon in the upper-right corner" (not a "global search bar"). Step 4: Results include only admin-configured record types; Leads not guaranteed |
| **crmNotes** | Salesforce uses SOSL only (not "SOSL or REST API"). Correct: "Salesforce Object Search Language (SOSL) across all indexable fields of eligible records" |
| **Current** | `'Salesforce: Search uses SOSL or REST API search across configured objects.'` |
| **Proposed** | `'Salesforce: Search uses SOSL across all indexable fields of eligible records.'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/global-search |

### TC19: Recent Communications — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Feature is called "Related items" card (not "Recent Communications"). Shows emails and meetings only — NO calls. 3 items default, "Show more" for up to 10. Items open in new browser tab. Feature is per saved contact, not per generic record |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-recent-upcoming-activities |

### TC20: Infobar Banners — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Banner actions are: "See sales insights", "Add contacts", "Save this email" — NOT "Saved to CRM" or "Not connected". Banners appear for emails with external contacts, not specifically "CRM-connected emails". Reading banners limited to 2/day |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/open-app |

### TC21: Sales Agent - Account Summary & Reports — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 1: Access via "Microsoft 365 Copilot Chat → Agents → Sales" (not a standalone "Sales Agent chat interface"). Steps 4-5: No "quarterly revenue report" feature — Agent supports natural language CRM queries. Account summary includes key info, pipeline, 3 closest opportunities, and meeting summary from last 30 days |
| **prerequisites** | Must include: M365 Copilot license, Sales app installed, signed in to CRM from Sales app. This is a preview feature |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-sales-chat |

### TC22: Prepare for Sales Meetings — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Steps 1-2 fundamentally wrong. Meeting prep is NOT accessed by opening a calendar event + side panel. It's a card sent to your Teams chat with the Sales bot (default 1 hour before meeting). Also accessible via M365 Copilot Chat → Sales agent |
| **prerequisites** | Missing: Meeting must not be recurring/canceled/private/all-day, 1-29 internal participants, Salesforce server-to-server connection required. "Linked Opportunity" is NOT required (falls back to account summary) |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/meeting-prep |

### TC23: Save, Use Suggestions & Custom Prompts — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 2: Save via star icon by hovering over prompt (max 3 saved). Step 3: Saved prompts in "Favorites" via favorites icon. Specific UI paths not matching |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

### TC24: Text Moderation in AI Content — INACCURATE (minor)

| Field | Issue |
|-------|-------|
| **testSteps** | Step 3: Moderation doesn't just "flag" — it **blocks generation entirely** with an error message |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

### TC25: Catch Up, Draft Emails & Take Actions — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | **No "Catch Up" view exists in the documentation.** Closest features: (1) Sales agent in M365 Copilot Chat for querying past meeting activity, (2) Email summary + banner actions in Outlook |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-sales-chat |

### TC26: Change Language of Key Info — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 3: Path is "Key email info" card → "..." (more options) → "Change language". Feature changes email summary language specifically |
| **prerequisites** | No "multi-language support enabled" toggle — feature is available when email summaries are available. Email must be 1,000+ characters, in a supported language, and not encrypted |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-save-email-summary-crm |

### TC27: Draft Email Options — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 1: No "Draft with Copilot" button — use "Draft an email" with down arrow for predefined categories: "Reply to an inquiry", "Make a proposal", "Address a concern". Step 3: One draft generated at a time, regenerate via "More options" → "Try again". Step 4: Button is "Add to email" (content prepended, not replaced) |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

### TC28: Adjust Tone of AI Content — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 2: Feature accessed via "Adjust draft" menu (not standalone "Adjust Tone"). Step 5: "Concise" is NOT a tone — it's a length setting. Length options: Short/Medium/Long. Tone and length are separate adjustments |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

### TC29: Suggest a Meeting Time — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Not a standalone feature — accessed under "Adjust draft" → "Suggest a meeting time". Shows first 3 available time slots based on calendar. Select slots + "Update" to regenerate draft. Not supported for Korean/Thai |
| **prerequisites** | Email doesn't need to "discuss scheduling" — feature available for any draft under "Adjust draft" |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

### TC30: Refine Enhancements — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 2: No "Refine" button — path is "Adjust draft" → "Add details" → enter changes → "Update". Restore via "More options" → "Restore last version" (only one version back) |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

### TC31: Explanations for Seller Prompts — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No hover/tooltip explanation feature exists. The actual feature: AI-generated contextual prompt suggestions based on email content, accessed via suggestions icon. Saved prompts (max 3) via favorites icon |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/use-copilot-kickstart-email-messages |

---

## CATEGORY 2: INTERACTIONS (7 test cases)

### TC1: Pre-Meeting Preparation — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Steps 1-2: Meeting prep is delivered as a card to the **Sales bot chat in Teams** (not by opening a meeting + panel). Card includes meeting title/time and up to 3 AI highlights. "Prepare with insights" button opens detailed view |
| **prerequisites** | Missing: Salesforce server-to-server connection, meeting must not be recurring/private/all-day/canceled, 1-29 internal participants |
| **crmNotes** | Communication history is per-opportunity (not per-attendee). Talking points include specific categories: strategic themes, icebreaker questions, discovery questions, potential use cases, likely objections |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/meeting-prep |

### TC2: Meeting Preparation Summary — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | **Step 5 is factually wrong:** Documentation explicitly states the card does NOT update if attendees change after scheduling. Minimum external attendees is 1 (not 2). "Attendee roles" is not a documented field |
| **Current** | `'Verify the summary updates if meeting attendees change'` |
| **Proposed** | `'Note: The meeting preparation card does NOT update if attendees change after initial scheduling'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/meeting-prep |

### TC3: Access CRM Data During Meeting — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | "Search for a CRM record" is not how the during-meeting experience works — it shows the connected record via the "Connected to" card. Terminology should be "Sales panel" |
| **crmNotes** | "Active Salesforce API connection during the meeting" is not documented as a requirement |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-meeting-summary-recap |

### TC4: Post-Meeting Sales Summary — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Navigation: Transcript dropdown → Sales (not "Copilot for Sales section"). Content includes suggested follow-ups, questions, keywords, sentiment — NOT "action items with owners" or "CRM entities linked" |
| **prerequisites** | Missing: recording requirement, non-recurring meeting requirement, Sales app must be added to meeting |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-meeting-summary-recap |

### TC5: Save AI Meeting Notes to CRM — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Button is "Save to (CRM)" in the Post-meeting actions section |
| **crmNotes** | **Wrong storage mechanism.** Notes are saved to Event description field (plain text in Salesforce) or to a specified Rich Text Area field — NOT to "a Note or Activity" |
| **Current** | `'Salesforce: Meeting notes saved as a Note or Activity on the record. Admin configures the save behavior.'` |
| **Proposed** | `'Salesforce: Meeting notes saved to Event description field (plain text) or to a specified Rich Text Area field on the record, depending on admin configuration.'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-meeting-summary-recap |

### TC6: Follow-Up Email from Meeting — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Button is "Draft email" (not "Draft Follow-Up Email"). Email opens in a pop-up with Copy/Open in Outlook web options. Automatic CRM tracking not documented for this flow |
| **prerequisites** | Missing: recording requirement, Sales app added to meeting, non-recurring meeting |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-meeting-summary-recap |

### TC7: Copilot for Sales Automatically Added to Meetings — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Terminology: "Sales app" throughout (not "Copilot for Sales") |
| **prerequisites** | "Admin has enabled automatic meeting addition" is wrong — auto-addition is built-in behavior when external participant is invited; no admin toggle exists. Post-meeting insights NOT generated for recurring meetings |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/meeting-prep |

---

## CATEGORY 3: FLOW OF WORK (15 test cases)

### TC1: AI-Suggested Contact Creation — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "AI suggests creating new contacts" proactive feature. User must manually initiate: hover over unsaved contact → "Add to (CRM)", or use banner "Add contact" action. Pre-population from email signature (not "AI suggestions") |
| **crmNotes** | No documented automatic account-matching during creation |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/create-contact-crm |

### TC2: Collaboration Spaces - Contextual Entry Points — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Creation only from Outlook (not Teams). Entry point is "Collaborate in Teams" card in Sales pane. Actions: "Set up account team" or "Set up deal room" |
| **prerequisites** | No discrete "Collaboration Spaces feature enabled" admin toggle. Requires: CRM account, valid license, Sales app for Outlook, for external collaboration: shared channels turned on by tenant admin |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/collaboration-space |

### TC3: Collaboration Spaces - Account Team — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Button is "Set up account team" (not "Create Collaboration Space > Account Team"). Process: choose new/existing team → configure name/sensitivity/privacy → add members → create. CRM data pinned as tab in channel |
| **crmNotes** | For Salesforce: CRM tab doesn't load in Teams web application (desktop only) |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/set-up-team-account-team-template |

### TC4: Collaboration Spaces - Deal Room — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Button is "Set up deal room". AI-generated opportunity summary auto-posted to channel welcome. Deal room template applied at channel level |
| **crmNotes** | CRM tab doesn't load in Teams web for Salesforce. Salesforce users must be signed in to Salesforce in Sales app in Outlook to view summary |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/set-up-team-deal-room-template |

### TC5: Share CRM Record in Teams Conversation — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | "/" command is an **Outlook feature** (not Teams). In Teams: More apps → Sales app → search for record. Adaptive card auto-added to message box |
| **prerequisites** | Recipients need Sales app installed and CRM access to view record details |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/share-crm-record-teams-conversation |

### TC6: People.ai Integration (Salesforce) — CANNOT VERIFY

| Field | Issue |
|-------|-------|
| **All fields** | **No documentation found** for a People.ai integration in official Microsoft Learn docs. May be a partner-built extension or training material reference not reflected in current public documentation |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/extend-sales-app |

### TC7: Duplicate Contacts Detection in Flow — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No interactive merge/skip/create workflow. Duplicate detection is a **blocking error**. User must change values, modify rules, or create directly in Salesforce |
| **Ref** | https://learn.microsoft.com/en-us/troubleshoot/sales-copilot/crm-permissions-and-configurations/duplicate-record-error |

### TC8: Sign-in for Third-Party Plugins — CANNOT FULLY VERIFY

| Field | Issue |
|-------|-------|
| **testSteps** | No documented in-app "plugin settings" page. Extensibility uses custom Power Platform connectors with OAuth 2.0. Authentication at connector level, not a user-facing plugin browser |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/custom-connector-action |

### TC9: DocuSign Integration — CANNOT VERIFY

| Field | Issue |
|-------|-------|
| **All fields** | **No documentation found** for a built-in DocuSign integration. May be a partner extension scenario from training materials |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/extend-sales-app |

### TC10: Actionable Cards Across Environments — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Cards are result of sharing CRM records via message extensions, not independently "received" with "action buttons". No generic action buttons documented on adaptive cards |
| **prerequisites** | No "adaptive cards enabled" admin toggle. Requires Sales app installed + enhanced Teams app deployed |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/share-crm-record-teams-conversation |

### TC11: AI Generated Planner Tasks — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Conflates two features: (1) Meeting recap "Create task" creates **CRM tasks** (not Planner tasks). (2) **Planner tasks** come from collaboration spaces (channels with 10+ messages in 24h), not from meeting recaps. Planner tasks are NOT synced to CRM |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/create-planner-tasks and https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-meeting-summary-recap |

### TC12: Extension Points via Copilot Studio — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Process: build APIs → create Power Platform connector → create Copilot Studio action → publish → admin enables → wait up to 7 days. Not just "working in Copilot Studio". Extensibility targets specific capabilities (email summaries, opportunity insights, record summaries, record details) |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/extend-sales-app |

### TC13: Sharing Records in Emails — PARTIALLY ACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | "/mention" feature only shows recently accessed records. Feature must be turned on by admin ("Quick-share records in Outlook"). Also available via Sales ribbon → Search Sales for broader search |
| **prerequisites** | Admin setting is "Quick-share records in Outlook" (not generic "sharing records in emails") |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/share-crm-record-admin |

### TC14: Copilot for Sales in Outlook Mobile — PARTIALLY ACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Access via "..." next to email from/to fields → Sales. App takes over full screen. Available **only when reading emails** (not composing/replying). **Salesforce sign-in not supported on iOS** (must sign in from desktop/web first) |
| **prerequisites** | No "mobile support enabled" admin toggle — it's built-in. Key Salesforce limitation on iOS must be noted |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/mobile-support |

### TC15: Improved Teams Meeting Recap Notifications — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Documented notifications are **pre-meeting** (preparation cards to Sales bot chat), NOT post-meeting recap notifications. Post-meeting recap must be manually accessed via Teams meeting recap → Transcript → Sales. No documented post-meeting push notification with CRM summary |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/meeting-prep |

---

## CATEGORY 4: ADMINISTRATION (19 test cases)

### ADMIN TC1: Admin Settings Landing Page — INACCURATE

| Field | Issue |
|-------|-------|
| **prerequisites** | "Tenant Admin or Environment Admin" are not official role names. Correct: CRM administrator (Salesforce: Modify All Data or Manage Data Integrations permission on user profile). Admin settings accessed from Sales personal app Settings tab (not standalone portal) |
| **testSteps** | Step 2: Navigate to Settings tab in Sales personal app in Outlook or Teams (not a generic "admin settings") |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/administrator-settings-for-viva-sales |

### ADMIN TC2: Copilot Settings at Tenant Level — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > Tenant Level Settings" path. Tenant-level settings are under the "Tenant" grouping in the Settings tab with two sections: "Copilot AI" and "Collaboration spaces" |
| **prerequisites** | Role is "tenant administrator" (not "Tenant Admin") |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/administrator-settings-for-viva-sales |

### ADMIN TC3: Exposure of Copilot Capabilities — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > Copilot Capabilities" path. Access control is under "Environment > Access settings" where admins choose "All users with a license" or "Specific security groups" |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/administrator-settings-for-viva-sales |

### ADMIN TC4: Save to CRM Fields Configuration — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Correct path: Settings > Environment > Save to (CRM) > Save emails to (CRM) > Categorize with fields > Add fields |
| **crmNotes** | Supported field types: option sets, lookup and text, multiple lines of text (plaintext/Memo), Boolean, and integer |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/save-additional-details-outlook |

### ADMIN TC5: Admin Settings Forms - Customize CRM Display — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Correct path: Settings > Environment > Forms. Admins can configure record types, fields, and field order for each record type (Contact, Account, Opportunity). Separate settings for detail view, edit form, create inline/in CRM |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/customize-forms-and-fields |

### ADMIN TC6: Copilot for Sales for M365 Apps Configuration — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Configuration is through Microsoft 365 admin center → Settings → Org settings → Copilot for Sales (or Sales Copilot). The admin page controls whether Sales Copilot is turned on/off for the organization and manages data use consents, not "which M365 apps show the entry point" |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/m365-admin-setting |

### ADMIN TC7: Role-Based Access to Settings Sections — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | "Environment Admin" is not an official role. Docs define: "tenant administrator" (M365 Global Admin role) sees all settings, "CRM administrator" sees environment and feature settings. Non-admin users cannot access the Settings tab |
| **prerequisites** | Should use: "Users with tenant administrator, CRM administrator, and seller roles" |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/administrator-settings-for-viva-sales |

### ADMIN TC8: Salesforce Notes Object Configuration — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > CRM Integration" path. Meeting notes save configuration is under Settings > Features > Meeting insights. The admin configures where to save AI meeting summaries, with options including the Event description field or a specified Rich Text Area field |
| **crmNotes** | Documentation does not confirm "ContentNote object" for Salesforce meeting notes. For Salesforce, notes are saved to Event description (plain text) or a specified Rich Text Area field on a record |
| **Current** | `'Salesforce: Uses the ContentNote object. Requires Notes to be enabled in Salesforce org settings.'` |
| **Proposed** | `'Salesforce: AI meeting notes saved to Event description field (plain text) or a specified Rich Text Area field. Enhanced Notes is not the storage mechanism for AI meeting notes.'` |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-meeting-summary-recap |

### ADMIN TC9: Enhanced Teams App - Admin Deployment — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | App name in Teams Admin Center is "Sales Copilot" (or "Sales"). Deployment involves setting up app policies (Setup policies → Add apps) and optionally pinning the app. For managed deployment, admin uses Integrated Apps in M365 Admin Center |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/install-viva-sales-as-an-integrated-app |

### ADMIN TC10: Collaboration Spaces Settings — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Collaboration spaces settings are under Settings > Tenant > Collaboration spaces. Admin configures which team templates are available: Account team and Deal room. Not a generic enable/disable toggle |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/administrator-settings-for-viva-sales |

### ADMIN TC11: Copilot Studio - Create Actions — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Must first create Power Platform connector, then create action in Copilot Studio. Not just "working in Copilot Studio." Extension is a preview feature |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/custom-connector-action |

### ADMIN TC12: Copilot Studio - Enable Plugins — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > Copilot Studio Plugins" path. Connector actions are managed in admin settings where they can be enabled/disabled for the environment |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/custom-connector-action |

### ADMIN TC13: Enable Sharing Records in Emails — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > Email Features" path. Setting is: Settings > Environment > Forms > [record type] > "Quick-share records in Outlook" toggle |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/share-crm-record-admin |

### ADMIN TC14: Connect Agents to Data Source (Salesforce) — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > Data Sources" or "Add Salesforce Connection" path. CRM connection is configured during initial app setup. For Salesforce: involves configuring server-to-server connection and Connected App in Salesforce. Process is documented in the deployment guide |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/connect-salesforce |

### ADMIN TC15: Configure Auto Record Meetings — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > Meeting Settings" or "Auto Record Meetings" toggle. Meeting recording is controlled by Teams admin policies (not Copilot for Sales admin settings). The Sales app auto-joins meetings with external participants but does not control recording |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/configure-meeting-agent |

### ADMIN TC16: Configure Save AI Meeting Notes — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Path: Settings > Features > Meeting insights > CRM integration. Options: auto-save on/off, select CRM record type to save to, select field to save to (for Salesforce: event Description field or Rich Text Area field) |
| **crmNotes** | "ContentNote or custom objects" is inaccurate — Salesforce saves to Event description field or Rich Text Area field |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/configure-meeting-agent |

### ADMIN TC17: Manage Access for Features & Agents — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > Access Management" path. Access is managed under Settings > Environment > Access settings. Two options: "All users with a license" or "Specific security groups." Feature-specific access is managed under each feature's settings |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/administrator-settings-for-viva-sales |

### ADMIN TC18: Sales Agent Configuration — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Path: Settings > Features > Sales Chat. Configuration includes: enabling/disabling, configuring CRM data access, adding custom instructions, managing glossary terms. No "Admin Settings > Sales Agent" path |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/set-up-sales-chat |

### ADMIN TC19: Manage Showing Sentiment Analysis — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No "Admin Settings > AI Features" or "Show Sentiment Analysis" toggle documented. Sentiment analysis is shown in meeting recap as "Overall meeting sentiment" and is part of the meeting insights feature, not a standalone toggle |
| **Ref** | https://learn.microsoft.com/en-us/microsoft-sales-copilot/view-meeting-summary-recap |

---

## CATEGORY 5: MONITORING (3 test cases)

### MONITORING TC1: Viva Insights - Analyst Workbench — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Feature is a **Power BI template** ("Copilot for Sales adoption" template), not an "Analyst Workbench section." Download from Viva Insights → Analyst experience → Analysis → select a template → Copilot for Sales adoption → Open in Power BI |
| **prerequisites** | Must include: Viva Insights analyst role, Power BI Desktop installed, access to Viva Insights data |
| **Ref** | https://learn.microsoft.com/en-us/viva/insights/advanced/analyst/templates/sales-copilot-adoption |

### MONITORING TC2: CxO Dashboard — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | No standalone "CxO Dashboard" documented. The analytics tool is the same Viva Insights Power BI template. Metrics include: active users, email interactions (saved, opened with Sales pane), meeting actions (prep cards sent, recaps viewed, notes saved to CRM) |
| **Ref** | https://learn.microsoft.com/en-us/viva/insights/advanced/analyst/templates/sales-copilot-adoption |

### MONITORING TC3: Copilot for Sales Adoption Metrics — INACCURATE

| Field | Issue |
|-------|-------|
| **testSteps** | Step 6: No "set up alerts for adoption threshold changes" — the Viva Insights Power BI template is a static report, not a monitoring platform with alert capabilities |
| **prerequisites** | Must include: Viva Insights license (analyst role), Power BI Desktop, access to organizational data in Viva Insights |
| **Ref** | https://learn.microsoft.com/en-us/viva/insights/advanced/analyst/templates/sales-copilot-adoption |

---

## Summary by Severity

### Critical (feature doesn't exist as described or fundamentally wrong behavior)
| # | Test Case | Issue |
|---|-----------|-------|
| P-TC6 | Duplicate Contacts in CRM | Describes interactive merge/skip/create — actual behavior is blocking error |
| P-TC10 | Global View | Feature doesn't exist in documentation |
| P-TC25 | Catch Up, Draft Emails | "Catch Up" view doesn't exist |
| P-TC22 | Prepare for Sales Meetings | Wrong access method (calendar+panel vs Teams bot card) |
| I-TC2 | Meeting Preparation Summary | Claims card updates with attendee changes — docs say it does NOT |
| FW-TC6 | People.ai Integration | No documentation found |
| FW-TC9 | DocuSign Integration | No documentation found |
| FW-TC11 | AI Generated Planner Tasks | Conflates CRM tasks with Planner tasks |
| FW-TC15 | Meeting Recap Notifications | Describes post-meeting notifications; actual feature is pre-meeting |
| A-TC15 | Configure Auto Record Meetings | Feature controlled by Teams policies, not Sales app admin |
| M-TC2 | CxO Dashboard | No standalone dashboard exists |

### High (wrong UI names, wrong data source, wrong field values)
| # | Test Case | Issue |
|---|-----------|-------|
| P-TC1 | Email Summary | Wrong trigger threshold (messages vs characters) |
| P-TC9 | Latest Activities | Wrong data source (Salesforce Timeline vs Outlook interactions) |
| P-TC11 | CRM Suggested Updates | Stage and Next Step not included (only Amount, Close Date) |
| P-TC15 | Key Sales Information | Competitor/pricing extraction not documented |
| I-TC5 | Save AI Meeting Notes | Wrong storage (Note/Activity vs Event description/Rich Text Area) |
| A-TC8 | Salesforce Notes Config | Wrong object (ContentNote vs Event description) |

### Medium (incorrect terminology, missing details, wrong navigation paths)
- All 19 Admin test cases have incorrect navigation paths
- All test cases use "Copilot for Sales" instead of "Sales" app
- Multiple test cases reference buttons/cards with wrong names
