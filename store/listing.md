# Chrome Web Store listing

Source of truth for the store listing. The API uploads packages only, so
copy changes here into the developer dashboard by hand.

## Name

Rolestash — Job Application Tracker

## Summary (≤132 characters)

The private job tracker: save postings in one click, autofill applications, track every reply. No AI, no data selling.

## Category

Productivity → Workflow & Planning

## Language

English

## Description

The private job application tracker. No AI reading your applications, no access to your inbox, no data selling. Free for up to 30 active jobs; Pro is US$12 a month.

Rolestash turns job postings into cards on a Kanban board, so you always know where every application stands.

CAPTURE IN ONE CLICK
• On SEEK, LinkedIn, Indeed, Workday, Greenhouse and 50+ other job sites, a small Rolestash button sits at the edge of the page. Click it to save the job, fill the application and mark it applied, without leaving the page.
• On any other careers page, click the Rolestash icon (or press Alt+J) for the same panel.
• Title, company, location, salary, closing date and the full description are filled in for you. Anything uncertain is flagged so you can check it before saving.
• The same job found on two sites stays one card.

A BOARD YOU'LL ACTUALLY USE
• Drag cards through Saved → Applied → Screening → Interviewing → Offer.
• Notes, tags, priorities, closing-date warnings and a timeline of every move.
• Autofill your name, contact details, address and links on any application form, free.
• Up to 30 active jobs free (rejected and withdrawn jobs don't count).
• Export to CSV or a JSON backup at any time, on every plan.

PRO: US$12/month, US$30 every 3 months, or US$99/year. Try it free for 14 days, no card needed
• Unlimited active jobs.
• Automatic status updates: forward job emails to your private address and the board moves the card ("we'd like to interview you", "unfortunately…"), with interview times and join links on the card. Plain rules, no AI, no access to your mailbox.
• Full autofill on the common applicant tracking systems and most careers forms: your current role, work rights, salary, notice period and saved answers too, and start your profile from your résumé (PDF or Word). It never answers demographic questions and never submits for you.
• Insights: applications per week, how far applications get, reply rates, the sites that work best for you, and a chart of where your applications end up.
• Contacts, interview rounds and documents per job, and a calendar export.
• Bulk actions, follow-up reminders, closing-date alerts, custom columns, capture from a pasted link and your full history.
• Sync across up to 5 devices, including your phone through the web board.

PRIVATE BY DESIGN
• No AI services read your applications. Capture and email updates use plain rules.
• Rolestash reads a page only when you open it there. Its button on job sites reads nothing until you click it, and it doesn't track the sites you visit.
• The free plan needs no account, and everything stays in your browser. Accounts and sync are optional.
• No ads, no analytics, no data selling.

Payments are handled by Paddle.com, our merchant of record. Privacy policy: https://rolestash.com/privacy/

## Single purpose

Save job postings from web pages to a personal job-application tracker, and keep that tracker up to date: filling applications from the user's own details and recording replies the user forwards.

## Permission justifications

| Permission         | Justification |
| ------------------ | ------------- |
| `activeTab`        | On sites outside the job-site list: opens the Rolestash panel in the current tab, reads the job posting and fills an application form there, only after the user clicks the toolbar button or a context-menu item, or presses the shortcut. |
| `scripting`        | Injects the bundled extraction script (to read the job), the bundled autofill script (to fill the form) or the panel's script into that one tab, when the user opens the panel or clicks. No remote code. |
| `storage`          | Saves the user's jobs, settings and autofill profile locally. |
| `unlimitedStorage` | Job description snapshots can exceed the default 10 MB quota over time. |
| `contextMenus`     | "Track this job" and "Fill this application" on the page, and "Open board" on the toolbar button. |
| `alarms`           | Checks every 15 minutes for follow-up reminders and closing dates the user set, while the board is closed. |
| `identity`         | Optional account sign-in with Google through `chrome.identity.launchWebAuthFlow`. Accounts are optional and used for paid plans and sync. |
| `notifications` (optional) | Asked for only when the user turns on follow-up reminders or closing-date alerts, to show them. |
| Host permissions for the supported job sites (`https://*.linkedin.com/*`, `https://*.seek.com.au/*`, `https://*.greenhouse.io/*` and the rest of `policy/manifest-policy.json`), with the `launcher` content script on the same sites | Shows the Rolestash button at the edge of job pages on the sites Rolestash supports, so a job can be saved, its application filled and its status updated from the page. The script draws only the button and the panel's frame: it reads nothing from the page and sends nothing anywhere until the user opens the panel. The user can hide the button per site. |
| `https://*/*`, `http://*/*` (optional host permissions) | "Capture from a pasted link": when the user pastes a job link, Rolestash asks for access to **that one site** in the same click, reads that page, and removes the access straight afterwards. |

`externally_connectable`: only `https://rolestash.com/board/*`, our own web board, may message the extension, to sign the web board in with the same account. No other site can.

Host permissions granted at install: the job sites above, nothing else. Content scripts: one (the button), on those sites only. Web-accessible resources: the panel page and the button's icon, which hold no data. Remote code: none. Every script, including the PDF reader used to read a résumé on the device, is bundled in the package.

## Data usage disclosures (dashboard → Privacy)

Collected (only when the user creates an optional account, or chooses to send a problem report):

- **Personally identifiable information:** email address, the user's full name (from their Google account, or typed by them; they can skip it), and optionally a profile photo. With a problem report, an email address for our reply if the user gives one.
- **Authentication information:** sign-in session tokens. No passwords.
- **Website content:** the job postings the user saves, when they turn on sync.
- **Personal communications:**
  - emails the user chooses to forward for automatic status updates (Pro). They're read in memory, and only the extracted update is kept, for at most 90 days;
  - problem reports the user chooses to send us: their message, the extension version, browser, plan, and the page's address only if they tick it. Kept for at most 12 months.

Not collected: health, financial or payment information (Paddle handles payments), location, web history, user activity.

Certify:

- not sold to third parties;
- not used or transferred for purposes unrelated to the single purpose;
- not used to determine creditworthiness or for lending.

Privacy policy URL: https://rolestash.com/privacy/

## Screenshots

`store/screenshots/*.png` (1280×800), in order:

1. Board: Kanban columns with fictional jobs.
2. Job details: the drawer with an interview round and a contact.
3. Insights: where applications end up.
4. The floating panel on a fictional careers page.
5. Autofill profile, started from a résumé.

Regenerate with `npm run store:screenshots` in the source repo. It writes `.output/store-screenshots/`; copy those files here.
