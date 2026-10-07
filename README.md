# Priyanka Nitin Bhorkar: portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS and Framer Motion.
All content comes from the CV and lives in one file, `data/profile.json`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build: `npm run build && npm start`.

Requires Node.js 20.9 or newer.

## Update the content

Edit `data/profile.json`. The page and the Ask Priyanka assistant both read from it, so one edit updates both.

| What | Where |
| --- | --- |
| Name, headline, links, key numbers | `person`, `stats` |
| Hero greeting and rotating statements | `personal` |
| Hero boarding pass | `boardingPass` |
| Flags on the boarding pass (countries travelled) | `travel` (flag drawings are in `components/ui/flag.tsx`) |
| About text with highlighted phrases | `aboutRich` (`mark`: `tech`, `metric` or `em`), `aboutHighlight` |
| Roles | `experience` |
| Projects and their detail view | `projects` |
| Skill cards and the full toolkit list | `skillCards`, `skills` (icon keys are mapped in `components/ui/icons.tsx`) |
| Degrees, certifications, award, languages | `education`, `certifications`, `awards`, `languages` |

The typed entry points (`data/profile.ts`, `experience.ts`, `projects.ts`, `skills.ts`, `education.ts`, `certifications.ts`) re-export slices of that file for the components.

- CV download: replace `public/cv/Priyanka-Nitin-Bhorkar-CV.pdf`.
- Portrait: replace `public/images/priyanka-bhorkar.jpg` (a larger image, 800 px or more, will look sharper).
- Navigation: `data/navigation.ts`.
- Colours and fonts: the `@theme` block in `app/globals.css`.
- Animated background: `components/animated-background.tsx` and the "Animated background" block in `app/globals.css`.

## Ask Priyanka assistant

```
Chat UI (components/chat)  ->  POST /api/chat (app/api/chat/route.ts)  ->  LLM API
                                        |
                                        +-- knowledge: data/profile.json (lib/assistant.ts)
```

- **Without an API key** the assistant works out of the box. It answers with rules over `data/profile.json` (`answerFromKnowledge` in `lib/assistant.ts`) and says so when it has no answer.
- **With an API key** set `ANTHROPIC_API_KEY` in `.env.local`. The server route sends the conversation to the LLM with `data/profile.json` as its only context and strict rules against inventing anything. If the call fails, the built-in answers take over.
- The key is read on the server only and never reaches the browser. Do not prefix it with `NEXT_PUBLIC_`.
- The route validates input, caps message length and history, and rate-limits each visitor (20 questions a minute, held in memory).
- To use another provider, change `askLlm` in `app/api/chat/route.ts`. Nothing else depends on it.
- Greeting and suggested questions: `data/assistant.ts`.

## Contact form

The form validates on the client and on the server (`app/api/contact/route.ts`).

- With `CONTACT_FORM_ENDPOINT` set (for example a Formspree form URL), messages are forwarded there.
- Without it, the form opens the visitor's email app with the message filled in.

## Environment variables

Copy `.env.example` to `.env.local`. All are optional.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for SEO metadata, sitemap and social cards |
| `ANTHROPIC_API_KEY` | Turns on LLM answers in the assistant |
| `LLM_MODEL` | Model name for the assistant |
| `CONTACT_FORM_ENDPOINT` | Where contact form messages are delivered |

## Deploy

**Vercel (simplest)**

1. Push this folder to a GitHub repository.
2. On vercel.com choose "Add New Project" and import the repository. The defaults work.
3. Add the environment variables from the table above under Settings, Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to your final URL.
4. Deploy. Add a custom domain under Settings, Domains if you have one.

**Any Node host**

```bash
npm install
npm run build
npm start        # serves on port 3000, set PORT to change it
```

The site needs a Node server because of the two API routes, so a static-only host will not run the assistant or the contact form.

## Structure

```
app/                  layout, page, SEO files, API routes (chat, contact)
components/           navbar, back-to-top, motion provider
components/sections/  hero, about, experience, education, skills, projects, contact, footer
components/chat/      Ask Priyanka provider and widget
components/ui/        button, chip, section, timeline, reveal, counter, icons
data/                 profile.json and typed re-exports
lib/                  assistant logic, utilities
public/               CV and portrait
```

## Notes

- SEO: metadata, Open Graph image, JSON-LD Person data, `sitemap.xml` and `robots.txt` are generated from the data.
- Accessibility: keyboard focus styles, a skip link, focus handling in the dialog and chat, and reduced-motion support throughout.
- UI primitives follow the shadcn/ui pattern (`cn` helper, variant classes) but are written by hand, so there is no extra dependency.
