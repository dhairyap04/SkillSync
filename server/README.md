# SkillSync API

Express + TypeScript with SQLite persistence. Requires Node 22.13 or later.
Node's built-in SQLite driver may print an experimental-feature notice on Node
22. No database service or native compilation is required. Tables are created on
first startup; this is schema version 3. Startup performs an additive, transactional upgrade
from earlier schemas without removing existing accounts or records.

## Run locally

From the repository root:

```sh
npm install
npm run dev:server
```

In another terminal:

```sh
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to `127.0.0.1:3001`.

1. Create a mentor account. Open Dashboard → Profile, complete the directory
   profile, and click Publish mentor profile.
2. Sign out and create a student account. Open Find Mentors, search for the
   published mentor, and send a mentorship request.
3. Accept the request in Mentorships as the mentor. Assign a challenge, submit
   work as the student, and review it as the mentor. The student can then publish
   reviewed work in Skill Passport.
4. Save learning preferences in Mentor Matches, start a Career Roadmap, or publish
   a complementary Peer Exchange offer. Active mentorship and exchange partners
   can message each other. Reports and dashboard totals reflect saved activity.

No demo users, default passwords, or fabricated reviews are seeded. The mentor
directory starts empty. Authentication, profiles, skills, goals, mentor discovery,
mentorships, challenges, passports, matching, roadmaps, peer exchanges, reports,
and messaging have connected UI flows. The resource library now uses a first-party catalog with personalized ranking,
persistent saves/completion, and explicit helpful/not-for-me feedback. Social login, password reset, email verification, file uploads,
scheduling, job matching, resume parsing, and WebSocket messaging are not
implemented. Messages refresh every ten seconds while viewing the newest page.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev:server` | Run API with automatic reload |
| `npm run typecheck:server` | Type-check server |
| `npm test` | Filter tests and HTTP integration tests |
| `npm run test:e2e` | Chromium browser journeys; install with `npx playwright install chromium` first |
| `npm run build` | Build frontend and compile server |
| `npm run start:server` | Run compiled server after building |

## Configuration

Set environment variables in the process starting the API (the server does not
load `.env` files automatically).

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3001` | API port |
| `HOST` | `127.0.0.1` | Bind address; use `0.0.0.0` in containers if needed |
| `DATABASE_PATH` | `data/skillsync.sqlite` | Database file relative to working directory |
| `APP_ORIGIN` | `http://localhost:5173` | Exact trusted browser origin |
| `NODE_ENV` | unset | `production` enables Secure cookies and requires an HTTPS origin |

If Vite uses a different host or port, set `APP_ORIGIN` to match it exactly.

For production, build with `npm ci && npm run build`, then run
`NODE_ENV=production APP_ORIGIN=https://your-domain.example npm run start:server`.
Serve the frontend build with SPA fallback and reverse-proxy `/api` to the API
under the **same HTTPS origin**. Vite's development proxy is not used in
production. Keep the database on a persistent volume and use SQLite's online
backup tooling: copying the main database file alone can omit writes in its WAL.
This is a single-instance API; rate limits are held in memory and SQLite is not
intended for a fleet of writers. The server binds to localhost by default and
does not trust forwarded IP headers.

Passwords use salted scrypt hashes. HttpOnly, SameSite=Lax session cookies expire
after seven days. Only hashes of random session tokens are stored. Logout
revokes the session; login rotates the current session. Mutations require
`X-SkillSync-Client: web`, and any supplied browser Origin must match
`APP_ORIGIN`. Cross-origin access is disabled. Ownership checks protect private
records; an active mentorship or peer exchange is required to read or send messages. Role and
verification status are not publicly editable.

## API

Send JSON with `Content-Type: application/json` and `X-SkillSync-Client: web` on
mutations. Retain the cookie from signup/login. Success responses use
`{ success: true, data }`; errors use `{ success: false, message }` with validation
details on HTTP 400. Requests are limited to 64 KiB; rate limits return HTTP 429.

| Method | Route | Behavior |
| --- | --- | --- |
| GET | `/api/health` | Database health |
| POST | `/api/auth/signup` | Create account and session (201) |
| POST | `/api/auth/login` | Verify credentials and start session |
| POST | `/api/auth/logout` | Revoke current session |
| GET | `/api/auth/me` | Current user; 401 without valid session |
| PATCH | `/api/users/me` | Update allowed profile fields |
| PUT | `/api/mentors/me` | Publish/replace own mentor profile (mentor only) |
| GET | `/api/mentors` | Search/filter published mentor profiles |
| GET | `/api/mentors/:id` | Public mentor profile, excluding email |
| GET, POST | `/api/skills`, `/api/goals` | List/create current user's records |
| PUT, DELETE | `/api/skills/:id`, `/api/goals/:id` | Replace/delete an owned record |
| GET, POST | `/api/mentorships` | List participant requests / request mentor |
| PATCH | `/api/mentorships/:id` | Accept, complete, or cancel |
| GET | `/api/messages/:peerId` | Read messages with an active mentorship peer |
| POST | `/api/messages` | Send to an active mentorship peer (201) |

### Accounts and profiles

Signup: `firstName`, `lastName`, `email`, `password`, `role` (`student` or `mentor`),
and `agreeToTerms: true`. Passwords require 8–128 characters, uppercase,
lowercase, and a digit. Login: `email`, `password`.

Profile updates allow names, email, bio, location, company, title, website,
LinkedIn URL, and GitHub URL. Unknown fields are rejected. Social URLs must use
HTTP/HTTPS. See [schemas](./schemas.ts) for exact validation.

Mentor profile: `title`, `company`, `location`, `bio`, `skills: string[]`,
`experienceYears: number`, `hourlyRate: number`, and `availabilityValue`
(`immediate`, `this-week`, `next-week`, `flexible`). Optional `specializations`
and `languages` arrays default to empty. A mentor account is not publicly listed
until its directory profile is published.

Search query: `search`, comma-separated `skills`, `experience` (`junior`, `mid`,
`senior`, `executive`), `availability`, `minPrice`, `maxPrice`, `page`, `limit`
(1–100, default 20). The response includes a sibling `pagination` object with
`page`, `limit`, `total`, `totalPages`. Experience ranges follow existing frontend
labels (1–3, 3–7, 7+, 10+); executive is a years threshold, not a verified title.
Selected skills use OR; separate filters use AND.

### Skills and goals

Skills require `name`, `category`, `proficiency` (0–100), with optional
`targetProficiency` and `evidence`. Goals require `title`, with optional
`description`, `status`, `priority`, `dueDate`, `skills` (owned skill IDs),
`progress`, and `milestones`. PUT replaces the full editable record, not a patch.
Do not include server-generated IDs, timestamps, or verification fields in write
bodies. Skill evidence cannot be self-verified. For complete field definitions,
see [schemas](./schemas.ts).

### Mentorship and messaging

Create a request as a student with `{ "mentorId": "<mentor-user-id>" }`.
List requests with `GET /api/mentorships` as either participant. Only the mentor
can accept a pending request using `PATCH /api/mentorships/:id` with
`{ "status": "active" }`. Participants can complete active requests or cancel
pending/active ones. Closed requests cannot be reopened; duplicate requests for
the same student/mentor pair return 409.

Send a message with `{ "receiverId": "<peer-user-id>", "content": "Hello" }`.
Read history using `GET /api/messages/:peerId?page=1&limit=50`. The default limit
is 50, maximum 100. Page 1 contains the newest messages in chronological order.
History and sending are blocked once no active mentorship or exchange connects the participants.

## Growth feature endpoints

All routes require a session except the public passport endpoint. All writes
require the same custom client header as other API mutations.

| Method | Route | Behavior |
| --- | --- | --- |
| GET, PUT | `/api/learning-profile` | Own skills to learn, career goal, optional budget and availability |
| GET | `/api/mentor-matches` | Ranked published mentors with visible scoring reasons |
| GET | `/api/mentorship-details` | Participant-only requests including names |
| GET | `/api/connections` | Active mentorship/exchange peers, excluding emails |
| GET, POST | `/api/challenges` | List participant challenges / assign to own active student |
| POST | `/api/challenges/:id/submit` | Assigned student submits work URL and summary |
| POST | `/api/challenges/:id/review` | Assigned mentor accepts or requests revision |
| GET | `/api/passport` | Own accepted evidence and sharing state |
| PUT | `/api/passport/sharing` | `{ published: boolean }`; publish/revoke a random link |
| GET | `/api/public/passports/:token` | Accepted evidence only; 404 if unpublished/revoked |
| GET | `/api/roadmap-templates` | Three editable starting paths |
| GET, POST | `/api/roadmaps` | Own paths / materialize template as editable goals |
| GET, POST | `/api/exchange-offers` | Member directory of active offers / create own offer |
| PATCH | `/api/exchange-offers/:id` | Owner pauses/reactivates offer |
| GET, POST | `/api/exchanges` | Own requests / request a reciprocal skill exchange |
| PATCH | `/api/exchanges/:id` | Recipient accepts; participants complete/cancel |
| GET | `/api/reports` | Participant-only reports computed from saved reviews |
| GET | `/api/dashboard` | Own activity counts, not seeded demo metrics |

### Review and evidence rules

Assign a challenge with `mentorshipId`, `title`, `description` (brief and criteria),
`skills: string[]`, and optional `dueDate`. Submit with `{ url, summary }`; URLs
must use HTTP/HTTPS. Review with `{ outcome, feedback, endorsedSkills }`, where
`outcome` is `accepted` or `revision_requested`. Only accepted work can receive
endorsements, and endorsed skills must come from the challenge. Accepted
submissions cannot be rewritten. Revision requests allow another submission;
all previous submissions and feedback remain in history (maximum 20 attempts).
Closing a mentorship blocks further submissions/reviews; already accepted
evidence and participant reports remain available. Reviews are mentor opinions,
not accredited certificates or independently verified competency scores.

Publishing a passport explicitly shares the student's name, accepted challenge
briefs, linked work, summaries, feedback, endorsed skills, and mentor names.
Self-reported skill proficiency, emails, account details, unreviewed submissions,
and revision history are excluded. External linked project permissions remain
under the project host's control. Revoking a link immediately makes it return
404; republishing generates a different token. Revocation cannot remove copies
someone already saved. Mentors see a notice that accepted reviews can be shared.

### Matching, roadmaps, and exchanges

Learning profile shape: `{ skills: string[], careerGoal: string, budget: number | null,
availability: '' | 'immediate' | 'this-week' | 'next-week' | 'flexible' }`.
Mentor matching uses a local content model: equivalent skills receive full credit,
curated adjacent skills receive partial credit, and TF-IDF/cosine similarity
compares career/goal text with profiles. Base weights remain skills 50%, budget
20%, availability 20%, and career text 10%; unset criteria are excluded. If there
are no explicit interests, saved skill gaps are used. Active goal text is used
when no explicit career goal is set. Cold starts with no context have zero
scores and are labeled unconfigured. There are no external AI calls, embeddings
services, or API keys. This is limited vocabulary/text matching, not an LLM or a
validated prediction of mentoring quality. Unknown skill names match exactly
after normalization; Java and JavaScript, C/C++/C#, and SQL/NoSQL stay distinct.

Each member can label mentors and resources helpful or not-for-me. One current
label per target is stored with a server-generated feature snapshot. Helpful
items receive up to three extra points when context exists; dismissed items are
hidden in the default UI and can be restored. After three ratings containing
both labels, a regularized local learner adapts that member's ranking weights
within 35% of the defaults. Only the latest 200 examples are used for fitting;
all dismissal labels remain available. Mentor and resource feedback are learned
separately. No other member's votes affect your scores. Resetting feedback removes
its labels/training snapshots and restores base weights without deleting saves.

Create a roadmap with `{ templateId, title? }` (`frontend`, `data`, or `product`).
Creation atomically creates a path and four goals with milestones. Edit goals
through the existing goals endpoints/UI. Deleting a goal removes it from the
path; deleting a skill linked to a goal returns 409 until the link is removed.
Roadmap progress averages the remaining goals' saved progress.

Create offers with `{ teach, learn, description }`. Request an exchange with
`{ offerId, requesterOfferId }`; the second must be your own active offer and the
skills must be reciprocal (case-insensitive). Duplicate offer-pair requests,
including reverse requests, return 409. Only the recipient can accept a pending
request. Accepted requests enable private messages. Pausing an offer prevents
new requests and acceptance; it does not end an already active exchange.
Complete/cancel the exchange explicitly to close it. Closed requests cannot be
reopened; publish a new offer to arrange another exchange.

Reports count challenges with at least one submission, currently accepted work,
revision rounds, and distinct mentor-endorsed skills. They include a timestamped
activity timeline and links to accepted evidence. They do not invent proficiency
gains or infer learning hours from chat activity.

## Personalized resources

The server catalog contains eight checked first-party learning links, with no
fabricated ratings, prices, or completion statistics. GET /api/resources returns
resource metadata, score, reasons, context/feedback flags, and own saved/completed
state. Ranking uses declared interests (55%), active goals/career text (25%),
self-reported gaps (15%), and relevant self-reported difficulty fit (5%).
Absent signals are excluded. Completed goals no longer contribute. Resource
completion is a tracking choice, not independent evidence of competency.

| Method | Route | Body / behavior |
| --- | --- | --- |
| GET | /api/resources | Own personalized catalog and state |
| PUT | /api/resources/:id/state | { saved?: boolean, completed?: boolean }; preserves omitted fields |
| PUT | /api/recommendation-feedback | { kind: 'mentor' or 'resource', targetId, value: 'helpful', 'not_for_me', or null } |
| DELETE | /api/recommendation-feedback | { kind: 'mentor' or 'resource' }; reset own labels and learned weights |

The resource UI includes Recommended, All, Saved, Completed, and Dismissed views.
Recommended excludes completed and dismissed resources; cold-start users can
explore the catalog. Filters operate on real categories, difficulty, and text.
Skill aliases, relationship weights, and catalog entries are curated in
[skillSimilarity.ts](./skillSimilarity.ts) and [resourceCatalog.ts](./resourceCatalog.ts).
