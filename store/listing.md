# Chrome Web Store listing

Source of truth for the store listing. The API uploads packages only, so
copy changes here into the developer dashboard by hand.

## Name

Rolestash — Job Application Tracker

## Summary (≤132 characters)

Save any job posting, fill in applications and track every reply on one private board. No AI, no data selling.

## Category

Productivity → Workflow & Planning

## Language

English

## Description

The private job application tracker. Keep your whole job search on one calm board, and save, apply and follow up right where you find the job.

SAVE, APPLY AND TRACK WITHOUT LEAVING THE PAGE
• On SEEK, LinkedIn, Indeed, Workday, Greenhouse and 50+ other job sites, a small Rolestash button sits at the edge of the page and says "Save job" when a posting is open. Drag it wherever suits you, or turn it on for every site.
• On any other careers page, click the Rolestash icon or press Alt+J.
• One click saves the job. Title, company, location, salary and closing date fill themselves in, and anything uncertain is flagged for you to check.
• From the same panel, fill in the application from your profile and mark the job as Applied.
• Found the same role on two sites? It stays one card.

ONE BOARD FOR THE WHOLE SEARCH
• Drag cards from Saved to Applied, Interviewing, Offer and Rejected.
• Notes, tags, priorities and a timeline of every move.
• Closing dates and follow-ups surface before they slip.
• Export to CSV or JSON at any time, on every plan.

FREE
• Up to 30 active jobs (rejected jobs don't count).
• Autofill your name, contact details and links on any application form.
• No account needed. Everything stays in your browser.

PRO: US$12/month, US$30 every 3 months or US$99/year, in your currency. Try it free for 14 days, no card needed.
• Unlimited active jobs.
• Automatic status updates: connect Gmail or Outlook (read-only) and the board moves the card when a job email arrives ("we'd like to interview you", "unfortunately…"), with interview times and join links on the card. Job emails are read on your computer, never on our servers, and the board catches up as soon as Chrome opens. Prefer no inbox access? Forward job emails to your private address instead. Plain rules, no AI.
• Full autofill: your current role, work rights, salary, notice period and saved answers too, with your profile started from your résumé (PDF or Word). It never answers demographic questions and never submits for you.
• Insights on how your applications are going, plus contacts, interview rounds and documents for every job.
• Reminders, closing-date alerts, custom columns, bulk actions and your full history.
• Sync across up to 5 devices, including your phone: scan the QR code in Account to open your board there.

PRIVATE BY DESIGN
• No AI reads your applications. Capture and email updates use plain rules.
• Connected mail is read on your computer and never reaches our servers.
• The button reads nothing from a page until you open it. Rolestash doesn't track or record the sites you visit, and you can hide the button on any site.
• No ads, no analytics, no data selling.
• Accounts are optional. Sign in with an emailed code, Google or a password, and turn on two-step sign-in with any authenticator app.

Payments are handled by Paddle.com, our merchant of record. Privacy policy: https://rolestash.com/privacy/

## Single purpose

Save job postings from web pages to a personal job-application tracker, and keep that tracker up to date: filling applications from the user's own details and recording replies the user forwards.

## Permission justifications

| Permission         | Justification |
| ------------------ | ------------- |
| `scripting`        | Injects the bundled extraction script (to read the job) or the bundled autofill script (to fill the form) into the tab when the user opens the panel or clicks. No remote code. |
| `storage`          | Saves the user's jobs, settings and autofill profile locally. |
| `unlimitedStorage` | Job description snapshots can exceed the default 10 MB quota over time. |
| `contextMenus`     | "Track this job" and "Fill this application" on the page, and "Open board" on the toolbar button. |
| `alarms`           | Checks every 15 minutes for follow-up reminders and closing dates the user set, while the board is closed. |
| `identity`         | Optional account sign-in with Google, and connecting Gmail or Outlook read-only for status updates, through `chrome.identity.launchWebAuthFlow`. Accounts are optional and used for paid plans and sync; the mailbox connection is optional too, and mail is read on the user's computer. |
| `notifications` (optional) | Asked for only when the user turns on follow-up reminders or closing-date alerts, to show them. |
| `activeTab`        | On sites outside the job-site list: opens the Rolestash panel in the current tab, reads the job posting and fills an application form there, only after the user clicks the toolbar button or a context-menu item, or presses the shortcut. |
| Host permissions for the supported job sites (`https://*.linkedin.com/*`, `https://*.seek.com.au/*`, `https://*.greenhouse.io/*` and the rest of `policy/manifest-policy.json`), with the `launcher` content script on the same sites | Shows the Rolestash button at the edge of job pages on the sites Rolestash supports, so a job can be saved, its application filled and its status updated from the page. The script only checks whether a job posting is open (the address and the page's schema.org job data) to label the button "Save job"; it reads nothing else and sends nothing anywhere until the user opens the panel. It never runs in subframes, and the user can hide the button per site. |
| `https://*/*`, `http://*/*` (optional host permissions) | Asked for only when the user turns on "Show the button on all sites": the same button on every other site, registered at that moment and removed if the user turns it off. Also "Capture from a pasted link": access to that one site, asked for in the click and removed afterwards. |

`externally_connectable`: only `https://rolestash.com/board/*`, our own web board, may message the extension, to sign the web board in with the same account. No other site can.

Host permissions granted at install: the job sites above, nothing else. Content scripts: one (the button), on those sites (and on all sites only if the user turns that on), top frames only. Web-accessible resources: the panel page and the button's icon, which hold no data. Remote code: none. Every script, including the PDF reader used to read a résumé on the device, is bundled in the package.

## Data usage disclosures (dashboard → Privacy)

Collected (only when the user creates an optional account, or chooses to send a problem report):

- **Personally identifiable information:** email address, the user's full name (from their Google account, or typed by them; they can skip it), and optionally a profile photo. With a problem report, an email address for our reply if the user gives one.
- **Authentication information:** sign-in session tokens; a password only if the user adds one (sent to our sign-in provider, Supabase Auth, over HTTPS and stored only as a salted hash); and, only if the user turns on two-step sign-in, the authenticator app's secret key, kept by Supabase Auth to check their codes.
- **Website content:** the job postings the user saves, when they turn on sync.
- **Personal communications:**
  - emails the user chooses to forward for automatic status updates (Pro). They're read in memory, and only the extracted update is kept, for at most 90 days;
  - problem reports the user chooses to send us: their message, the extension version, browser, plan, and the page's address only if they tick it. Kept for at most 12 months.

Connected Gmail or Outlook mail (Pro, optional) is read in the extension on the user's computer and is not sent to us, so it isn't "collected"; only the job updates it produces sync if the user turns on sync. Rolestash's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.

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

## Promo tiles

`store/promo/small-440x280.jpg` (small promo tile) and
`store/promo/marquee-1400x560.jpg` (marquee promo tile), JPEG with no alpha
as the store requires. Regenerate with `npm run store:promo` in the source
repo; it writes `.output/store-promo/`.
