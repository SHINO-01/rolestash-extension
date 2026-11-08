# Chrome Web Store listing

Source of truth for the store listing. The API uploads packages only, so
copy changes here into the developer dashboard by hand.

## Name

Rolestash: Job Application Tracker

## Summary (≤132 characters)

The job market is broken. Your job hunt doesn't have to be. Find, apply, track and follow up from one private board in Chrome.

## Category

Productivity → Workflow & Planning

## Language

English

## Description

Your private HQ for the job hunt.

The job market is broken: thousands of applications, a handful of callbacks, and half the ads were never real. Rolestash runs the operation for you. It finds the jobs that fit, fills in the applications, flags the ghost jobs and tracks every one, inside Chrome. Nobody else sees a thing.

Stop job hunting like it's 2009. Swap the spreadsheet, the forty open tabs and the inbox searches for one place that knows where every application stands, what needs doing next, and which jobs aren't worth your evening.

SAVE ANY JOB IN ONE CLICK
• The Rolestash button sits at the edge of SEEK, LinkedIn, Indeed, Workday and 46 more job sites, and says "Save job" when a posting is open. On any other careers page, press Alt+J.
• Title, company, location, salary and closing date come with it. Anything uncertain is flagged for you to check.
• Found the same role on two sites? It stays one card.

ONE BOARD FOR THE WHOLE SEARCH
• Saved, Applied, Interviewing, Offer, Rejected. Drag the cards, add notes, tags and priorities, and see a timeline of every move.
• Ghost jobs, flagged: old ads, passed closing dates, talent pools and reposts are marked before you waste an evening on them.
• When they go quiet: two weeks after you apply with no word, Rolestash says they may have ghosted you and hands you a polite follow-up.
• Export to CSV or JSON at any time, on every plan.

FREE, NO ACCOUNT NEEDED
• Up to 30 active jobs (rejected ones don't count).
• Autofill your name, contact details and links on any application form.
• A CV and cover letter for each job, built from your profile.

PRO: US$12 a month, US$30 every 3 months or US$99 a year, charged in your currency. 14 days free, no card needed.
• Unlimited active jobs.
• Jobs for you: every Monday, the week's openings that fit your profile best, picked on your computer. Your profile is never sent anywhere.
• Auto apply, if you want it: it checks you fit, writes a CV and cover letter for the job, fills the form across every page, answers its questions from your profile and sends it, with 5 seconds to cancel. Or set a match range and let it work through a batch. The card moves to Applied with what was sent. Sensitive questions and consents are answered only as your profile says, it doesn't send while a required question is left, and it never gets past a CAPTCHA.
• Job emails move the cards: forward job emails to your private Rolestash address and the card moves itself, with the interview time and join link. Rolestash keeps the update, never the email. On Gmail, "Set up with Gmail" walks you through the forwarding on Gmail's own settings screens.
• Full autofill: work history, work rights and visas, salary, notice period and saved answers, with your profile started from your résumé (PDF or Word).
• Insights on how far applications get, how fast employers reply and which job sites work for you, plus contacts, interview rounds, documents, reminders and your full history.
• Sync across 5 devices, including your phone: Today shows what's due, closing soon and gone quiet.

PRIVATE BY DESIGN
• On your computer: your profile and CVs never leave it unless you turn on sync, and synced boards are stored in Sydney, Australia. Deleting your account deletes them.
• AI that stays home: the optional AI model runs on your computer. Nothing you write is sent to an AI service, and every line it writes is checked against your profile so nothing is made up.
• No inbox access: Rolestash never connects to your mailbox. You choose which emails to forward; they're read with plain rules and only the update is kept. "Set up with Gmail" uses access to Gmail's settings only during the setup, never reads your mail and gives the access back when it's done.
• On job sites, the button only checks whether a job posting is open. It reads nothing else, and stores and sends nothing, until you open it. You can hide it on any site.
• No ads, no trackers, no data selling.
• Accounts are optional. Sign in with an emailed code, Google or a password, with two-step sign-in from any authenticator app.

Payments are handled by Paddle.com, our merchant of record. Privacy policy: https://rolestash.com/privacy/

## Single purpose

Save job postings from web pages to a personal job-application tracker, and keep that tracker up to date: filling applications from the user's own details and recording replies from employers from emails the user forwards to their private address (with an optional guided setup for Gmail forwarding).

## Permission justifications

| Permission         | Justification |
| ------------------ | ------------- |
| `scripting`        | Injects the bundled extraction script (to read the job) or the bundled autofill script (to fill the form) into the tab when the user opens the panel or clicks. No remote code. |
| `storage`          | Saves the user's jobs, settings and autofill profile locally. |
| `unlimitedStorage` | Job description snapshots can exceed the default 10 MB quota over time. |
| `offscreen`        | Opt-in AI on the user's device: a hidden extension page runs Rolestash's own AI model with WebGPU to tailor a CV or draft a cover letter, only while the user is using it, and closes a minute after. The model's program is bundled in the package; only its weights (data) are downloaded, once, from Rolestash's own storage, after the user turns AI on. Nothing the user writes is sent anywhere. |
| `contextMenus`     | "Track this job" and "Fill this application" on the page, and "Open board" on the toolbar button. |
| `alarms`           | Checks every 15 minutes for follow-up reminders and closing dates the user set, while the board is closed. |
| `identity`         | Optional account sign-in with Google through `chrome.identity.launchWebAuthFlow`. Accounts are optional and used for paid plans and sync. It requests no mailbox access. |
| `notifications` (optional) | Asked for only when the user turns on follow-up reminders, closing-date alerts or notifications for status updates from the emails they forward, to show them. |
| `activeTab`        | On sites outside the job-site list: opens the Rolestash panel in the current tab, reads the job posting and fills an application form there, only after the user clicks the toolbar button or a context-menu item, or presses the shortcut. |
| Host permissions for the supported job sites (`https://*.linkedin.com/*`, `https://*.seek.com.au/*`, `https://*.greenhouse.io/*` and the rest of `policy/manifest-policy.json`), with the `launcher` content script on the same sites | Shows the Rolestash button at the edge of job pages on the sites Rolestash supports, so a job can be saved, its application filled and its status updated from the page. The script only checks whether a job posting is open (the address and the page's schema.org job data) to label the button "Save job"; it reads nothing else and sends nothing anywhere until the user opens the panel. It never runs in subframes, and the user can hide the button per site. |
| `https://*/*`, `http://*/*` (optional host permissions) | Asked for only when the user turns on "Show the button on all sites": the same button on every other site, registered at that moment and removed if the user turns it off. Also "Capture from a pasted link": access to that one site, asked for in the click and removed afterwards. And "Set up with Gmail" (Pro, optional): `https://mail.google.com/*` only, asked for in the click and removed when the setup ends. While the setup runs, a bundled guide script is registered on Gmail to show the steps on Gmail's settings pages and fill in the forwarding address and filter. It never reads mail, and stores and sends nothing from Gmail. |

`externally_connectable`: only `https://rolestash.com/board/*`, our own web board, may message the extension, to sign the web board in with the same account. No other site can.

Host permissions granted at install: the job sites above, nothing else. Content scripts: one (the button), on those sites (and on all sites only if the user turns that on), top frames only; plus the Gmail setup guide, registered on mail.google.com only while the user runs "Set up with Gmail". Web-accessible resources: the panel page and the button's icon, which hold no data. Remote code: none. Every script, including the PDF reader used to read a résumé on the device and the on-device AI model's WebAssembly program, is bundled in the package; the CSP allows `'wasm-unsafe-eval'` for that packaged program only. The AI model's weights are data, downloaded from Rolestash's own storage when the user turns AI on.

## Data usage disclosures (dashboard → Privacy)

Collected (only when the user creates an optional account, or chooses to send a problem report):

- **Personally identifiable information:** email address, the user's full name (from their Google account, or typed by them; they can skip it), and optionally a profile photo. With sync on, the contacts the user adds to jobs (such as a recruiter's name, email and phone). With a problem report, an email address for our reply if the user gives one.
- **Authentication information:** sign-in session tokens; a password only if the user adds one (sent to our sign-in provider, Supabase Auth, over HTTPS and stored only as a salted hash); and, only if the user turns on two-step sign-in, the authenticator app's secret key, kept by Supabase Auth to check their codes.
- **Website content:** the job postings the user saves, with their notes, when they turn on sync.
- **Personal communications:**
  - emails the user chooses to forward for automatic status updates (Pro). They're read in memory, and only the extracted update is kept, for at most 90 days. When the user sets up Gmail forwarding, our email service opens Gmail's forwarding confirmation link to confirm it for them;
  - with sync on, the status update on a job card and its reason: the forwarded email's subject, sender and date;
  - problem reports the user chooses to send us: their message, the extension version, browser, plan, and the page's address only if they tick it. Kept for at most 12 months.

Rolestash doesn't connect to the user's mailbox (Connect Gmail was removed in 0.6.9). "Set up with Gmail" (Pro, optional) uses temporary access to mail.google.com in the user's browser only to show the forwarding steps and fill in the address and filter; it reads no mail, sends nothing from Gmail to us, and the access is removed when the setup ends. Rolestash uses no AI or machine-learning models on email. Rolestash's use of information received from Google APIs (Google sign-in) adheres to the Google API Services User Data Policy, including the Limited Use requirements.

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
