AGENTS.md — Codex Instructions for Connected Oral Exam
Mission
Build a beautiful, responsive, functional frontend prototype of an AI-assisted oral-exam practice product. The defining UI is a Siri-inspired floating animated orb at the bottom-right, which opens a voice/text assistant above the study workspace. The app should communicate the product's central difference: reasoning across chapters, not rote memorization.

Current milestone addendum
The project now includes one authorized server-side integration: a Next.js `/api/exam` route using the OpenAI Responses API. It may read `OPENAI_API_KEY` and `OPENAI_MODEL` only on the server and must keep the examiner bounded to the verified Computer Architecture demo knowledge base. Preserve the existing prohibitions on MCP, FastAPI, PDF extraction, vector databases, authentication, and other backend infrastructure. This addendum supersedes older frontend-only and “do not make LLM calls” statements below only for this narrow exam route.
Read first (in this order)
1. README.md — overall product scope, architecture and phases.
2. UI_SPEC.md — binding frontend requirements and acceptance checks.
3. ARCHITECTURE.md — backend-only conceptual reference, particularly four MCP tool contracts. Ignore Streamlit UI instructions because they are superseded.
4. IMPLEMENTATION_PLAN.md — old full-stack sprint, superseded; do not implement its tasks now.
Mandatory scope control
Implement frontend only in the current milestone. Do not create FastAPI, MCP server, PDF extraction, vector DB, LLM client, auth, real grading, Docker or deployments. Do not make LLM calls. Build a typed ExamService interface and an honest DemoExamService using explicit fixture data so the UI can be connected to a real API later.

The UI should feel interactive and complete, but NEVER fabricate backend functionality. Show “Interactive demo — AI analysis not connected” in an unobtrusive location. Mark graph relationships, questions, source references and feedback as Sample. A locally selected PDF is Queued (demo) only; do not imply it was read or analyzed.
Stack
Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + Motion + Lucide. Zustand or minimal React context for state. Use clear components, typed props and a service boundary. Prefer current official Next.js patterns and avoid unnecessary dependencies.
Required UI routes
- / dashboard
- /courses courses library
- /courses/[id] course detail, chapters and pending PDFs
- /connections clickable example concept graph
- /exam full exam practice view
- /history local demo sessions
- /settings theme, speech, motion preferences and reset
Assistant orb / expanded panel is globally available on all routes. It must retain its current text and session context when collapsed.
Assistant behavior
- Orb anchored bottom-right; softly floats/breathes; meaningful listening/speaking animation; supports reduced motion.
- Tap/click opens panel. It offers text composer plus optional microphone; tapping microphone is the only way capture begins.
- Quick actions: Test me; Ask cross-chapter question; Explain connection; Weak topics; End session.
- “Test me” initiates a deterministic Sample workflow from fixtures: cross-chapter question → user answer → explicitly sample feedback → follow-up → recap.
- Answer cannot be submitted empty. Show loading/progress transitions without implying remote processing.
- Browser speech recognition only with feature detection, direct user permission/gesture and text fallback; user must review captured text before sending.
- Optional browser text-to-speech only on action, with pause/stop/mute and cleanup on close/unmount. Handle vendor/permission errors visibly.
- On mobile assistant becomes a bottom sheet, never behind navigation or keyboard.
- All main actions must do something meaningful; do not leave clickable placeholder buttons.
Technical quality
- Clear separation: view components → store/actions → ExamService adapter → demo fixtures.
- Centralize demo content and example results in fixture files; no fabricated source references to user PDFs.
- Safe persistence of non-sensitive demo preferences/history only. Avoid raw document bytes and transcripts in localStorage.
- Handle empty, working, failure and success UI states. Keep explicit demo labels.
- Accessible button names, focus handling, Esc behavior, 44px mobile tap targets, keyboard support, visible focus and reduced motion.
- No microphone activation on page load, no autoplay audio, no dark-pattern permissions.
- Avoid misleading progress percentages for unprocessed PDF files.
- Add a light set of unit or interaction tests for assistant state and demo exam progression when feasible.
- Run npm run build and applicable tests; fix type/lint errors before finishing.
Task execution protocol
1. Inspect repository and read the documents above.
2. Scaffold frontend if necessary; do not replace existing user work without inspection.
3. Build shell and route navigation; verify responsive layout.
4. Build floating orb + panel first, including text interaction and demo exam flow.
5. Build courses, sample graph, exam, history and settings.
6. Add optional voice controls with robust fallback and accessibility.
7. Test manually and run build/tests; report exact results and remaining limitations.
Do not stop after static mockups. The prototype must have working local state and navigable interactions.
Definition of done
- Attractive, cohesive, functional web UI across all specified routes.
- Globally accessible animated orb; expansion/minimization working.
- Full sample exam turn, typed answer, sample feedback, follow-up and end recap.
- Voice input optional and safely falls back to typing; speech playback controllable.
- Course creation, pending file selection and chapter toggles functional locally.
- Visible transparent demo status; no fake AI or PDF-processing claims.
- Responsive mobile presentation and keyboard-friendly controls.
- npm run build succeeds; summarize implemented features and integration seams.
First Codex instruction to execute
Read README.md, UI_SPEC.md, and AGENTS.md. Implement the frontend-only Next.js prototype. Begin with the app shell, global floating assistant orb, expanded panel, and one full scripted oral-exam interaction. Then build the remaining specified routes and local state. Use a premium restrained dark design. Do not build backend/MCP/LLM services yet. Run the project build and report what works and what is deliberately mocked.
