# SkillSync AI Frontend Documentation

This is the Next.js frontend for SkillSync AI, a premium AI-powered career learning and resume intelligence platform. It connects to a Strapi backend, manages user registration/login, displays profile and dashboard data, generates AI quizzes, analyzes resumes, and supports several AI career guidance workflows.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The backend should also be running at [http://localhost:1337](http://localhost:1337).

## Main Features

- Login and multi-step registration
- Resume PDF upload to Strapi
- User dashboard with profile sections, charts, and quiz summaries
- Profile view/edit flow
- Skill-based technology quiz flow
- AI-generated multiple-choice quiz questions
- Quiz timer, pass/fail result, and quiz history saving
- Resume PDF analysis with AI summary and learning suggestions
- AI endpoints for skill assessment, interview prep, career insights, market insights, learning paths, and performance metrics
- Voice interview demo with transcription and answer feedback

## Important Routes

| Route | Purpose |
| --- | --- |
| `/` | Shows login |
| `/login` | User login |
| `/registration` | Multi-step profile and resume registration |
| `/dashboard` | Main user dashboard |
| `/profile` | Profile view/edit screen |
| `/technologies` | Lists user skills for quiz selection |
| `/quiz/[tech]` | Starts a quiz for selected skill |
| `/interactiveLearningHub` | Hub for learning, quiz, logical questions, and resume analysis |
| `/resumeAnalysis` | AI resume summary and learning suggestions |
| `/learning` | Personalized learning suggestions area |
| `/logical/[tech]` | Logical/coding question UI |
| `/voice` | Voice interview demo |
| `/changePassword` | Change password screen |

## API Routes

| API Route | Purpose |
| --- | --- |
| `/api/data/fetch` | Proxy GET request to Strapi |
| `/api/data/post` | Proxy POST request to Strapi |
| `/api/upload` | Upload files to Strapi |
| `/api/user/fetch` | Fetch user by Strapi `documentId` |
| `/api/user/update` | Update user profile/quiz data |
| `/api/quiz` | Generate and cache AI quiz questions |
| `/api/resume/analyze` | Analyze uploaded resume PDF |
| `/api/user/summary` | Generate user career summary |
| `/api/skills/assess` | Generate skill assessment |
| `/api/interview/prepare` | Generate interview preparation |
| `/api/learning/path` | Generate learning path |
| `/api/ai/*` | AI dashboard insights |
| `/api/transcribe` | Transcribe audio using OpenAI Whisper |
| `/api/evaluate` | Evaluate interview answer |

## Environment Variables

Create `frontend/.env` from `frontend/.env.example`.

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
```

AI calls use the shared helper in `src/lib/aiClient.js`, so the provider can be changed with environment variables.

For Google Gemini:

```bash
AI_PROVIDER=google
AI_MODEL=gemini-3.1-flash-lite
GOOGLE_API_KEY=your_google_ai_studio_key
```

You can configure multiple Gemini keys for automatic fallback:

```bash
NEXT_PUBLIC_GOOGLE_API_KEY=your_first_google_ai_studio_key
NEXT_PUBLIC_GOOGLE_API_KEY1=your_second_google_ai_studio_key
NEXT_PUBLIC_GOOGLE_API_KEY2=your_third_google_ai_studio_key
NEXT_PUBLIC_GOOGLE_API_KEY3=your_fourth_google_ai_studio_key
```

All server AI routes use `src/lib/aiClient.js`, so Gemini requests try key 1,
then key 2, then key 3, then key 4 before returning an error.

When `AI_PROVIDER=google`, the app calls Gemini's native `generateContent` API:

```text
https://generativelanguage.googleapis.com/v1beta/models/{AI_MODEL}:generateContent
```

For any OpenAI-compatible provider:

```bash
AI_BASE_URL=https://api.groq.com/openai/v1
AI_API_KEY=your_provider_key
AI_MODEL=llama-3.3-70b-versatile
```

Do not put server AI keys in `NEXT_PUBLIC_*` variables.

If `npm run dev` reports missing modules with `OS file watch limit reached`,
the dev script uses webpack mode by default to reduce watcher pressure. Use
`npm run dev:turbo` when your system watch limit is high enough for Turbopack.

For native OpenAI:

```bash
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-4o-mini
```

`/api/transcribe` uses `OPENAI_API_KEY` for Whisper transcription.

## Main Source Folders

```text
src/pages/             Next.js pages and API routes
src/components/        Shared UI components
src/components/quiz/   Quiz UI components
src/components/dashboard/ Dashboard sections and AI widgets
src/components/registration/ Registration form sections
src/components/profile/ Profile sections
src/customHooks/       Reusable data and AI hooks
src/context/           Auth context
src/helper/            Validation and dashboard helpers
src/lib/               Shared AI client
src/utils/             Performance, upload, dedupe, and dynamic import helpers
src/styles/            Global and AI dashboard styles
```

## Notes

- The dashboard has some AI components commented out to reduce AI API rate-limit issues.
- Quiz questions are cached in memory for 30 minutes.
- User summaries, learning paths, interview prep, and skill assessments also have in-memory caches.
- Login currently checks user records from Strapi and compares passwords in plain text. This is POC-level only and should be replaced before production.
- See `../PROJECT_DOCUMENTATION.md` for full project documentation.

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Full Documentation

Read the complete documentation at `../PROJECT_DOCUMENTATION.md`.
