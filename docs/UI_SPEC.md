UI Specification — Connected Oral Exam
Version: 1.0 · Status: Approved direction for frontend-first prototype · Date: 2026-11-07
Audience: Codex and collaborators
Implementation priority: FRONTEND ONLY in this phase. Build interaction-rich frontend screens with local demo fixtures. Do not build or simulate a live AI backend.

Implementation addendum: The current milestone authorizes a narrow Next.js `/api/exam` OpenAI Responses API integration for real questions, practice feedback, and adaptive follow-ups. It uses only a clearly identified, verified Computer Architecture demo knowledge base. All PDF, graph, course-preview, and prior fixture content remains explicitly sample/demo; MCP, ingestion, databases, and authentication remain out of scope.
1. Product thesis
Students often prepare for oral exams by studying chapters separately, whereas professors test connections, reasoning, application, and explanation across chapters. The eventual product will use uploaded course materials to run adaptive, source-grounded oral examinations. The current deliverable is a convincing, honest interactive UI prototype that demonstrates this experience.

Product statement: “Go beyond memorization. Practice thinking across chapters.”

Primary target: University students preparing for oral exams. Secondary audience: tutors/mentors reviewing the concept.

Core design metaphor: A calm study workspace with a floating, Siri-inspired voice assistant orb anchored near the bottom-right corner. The app remains visible behind the expanded assistant overlay.
2. Stack and frontend boundary
- Next.js App Router + TypeScript (current compatible stable versions), React.
- Tailwind CSS for styling; shadcn/ui primitives for buttons, dialogs, tabs, tooltips, dropdowns, sheet and form controls.
- Motion (formerly Framer Motion) for the floating orb, transitions and small interaction cues; Lucide icons.
- Zustand or lightweight React context for demo application state, with localStorage persistence of non-sensitive UI preferences and demo sessions.
- Browser Web Speech API optionally for speech recognition/synthesis, only on explicitly supported browsers, with a full text-input fallback. Do not require a paid speech service.
- Backend integration later: Python/FastAPI exam orchestrator, local MCP tool server/client, PyMuPDF ingestion, LLM adapter, database and retrieval. See README and ARCHITECTURE for long-term boundaries; the old Streamlit UI choice is superseded.
What “functional UI” means right now
All interactions must work in the browser using demonstrative fixtures: navigation, drag/drop selection and validation, course list, chapter selection, assistant panel, talk/text controls, start/end exam, question progression, typed answers, sample feedback, history view, source-preview cards, empty/loading/error/success UI states. The app must never pretend to have processed a real PDF, made a real LLM call, validated an answer, or actually performed MCP retrieval. Clearly label mock questions and feedback as Sample / Demo. Do not make claims about analysis of newly uploaded files.
3. Navigation and screen map
Persistent desktop left navigation; compact bottom nav / drawer on mobile.
1. Home / Dashboard: Welcome header; recently opened course; “Continue practice”; mini stats marked “Demo”; illustration of disconnected versus connected knowledge; prominent “Start oral practice” CTA.
2. My Courses: cards for example subjects; add course modal; course detail with file list, chapter chips, source preview; uploaded local file names are only a pending upload list until backend exists.
3. Concept Connections: interactive mini network (SVG/CSS nodes): e.g. Data Hazards ↔ Forwarding ↔ Load-Use ↔ CPI. Click a node to show its explanation and cross-chapter links. This graph is sample data, not a PDF-derived graph.
4. Oral Exam: preparation controls (course, chapters, difficulty, duration preference, text/voice choice), question, answer composer, sample follow-up, feedback, end-of-session recap.
5. Practice History: previous demo sessions, details and suggested review topics; local-only, removable.
6. Settings: theme (default elegant dark), reduced-motion option, speech input/output toggles, microphone permission explanation, privacy disclaimer, demo data reset.
Assistant orb is accessible on every screen, without hiding the underlying workspace.
4. Design direction
- Visual tone: Premium, minimal, academic, slightly futuristic. Not a generic gradient-saturated chatbot.
- Canvas: near-black / deep ink (#0B1020), surfaces #121A2B, muted borders #26334A, text #EAF1FA, secondary text #9AAEC7.
- Accents: cool cyan #22D3EE and subtle violet #8B5CF6; amber #FBBF24 only for attention/connected reasoning. Use restrained glow around orb only.
- Fonts: modern sans (Geist/Inter); clear hierarchy, readable line lengths. Prefer 16:9 layout for presentations and desktop demo.
- Components: 12–20px radii, soft outlines, subtle shadows, clear focus rings, compact spacing, tidy course cards.
- Motion: orb gentle breathing/float in idle; lightweight ripple when listening; distinct pulsing/waveform when speaking; 150–350ms panel transitions. Respect prefers-reduced-motion and avoid continuous heavy GPU effects.
- Position: desktop orb bottom-right ~24px from edges, 64–80px size. Mobile ~16px from safe area and above bottom navigation; avoid overlap with input, scroll, and keyboard.
Main interaction: floating assistant orb
Collapsed: Glowing, softly animated orb with accessible label “Open oral exam assistant”; optional small “Ask me” hint; no audio recording.

Expanded: A floating panel (desktop ~420px wide × max 70vh, mobile near-full-width bottom sheet) over the still-visible course workspace. Header “Oral Exam Assistant”; current course pill; close/minimize; transcript thread; suggested quick actions; voice/text composer. Use a dim overlay only on small screens if needed. Always preserve context when collapsed.

Quick actions: “Test me”, “Ask a cross-chapter question”, “Explain the connection”, “Show my weak topics”, “End session”. They invoke deterministic local demo actions today and will map to backend actions later.

State visuals: idle → listening → transcribing → thinking (only simulated/labeled demo for mock path) → asking → waiting for answer → feedback → follow-up → completed; also microphone-denied and unsupported-browser states. Microphone must never start without explicit user gesture. The orb is a control, not an always-on assistant.

Example demo dialogue:
- Student clicks orb → “Test me.”
- Assistant: “Let's connect pipelining with performance. Why can forwarding remove some stalls, but a load-use hazard still affect CPI?” (Sample question)
- Student types an explanation or speaks into a supported browser microphone.
- Assistant shows Sample feedback with one strength, one missing connection, and a follow-up: “How would one added stall per iteration affect CPI?”
- Student can continue, request another question, see referenced example chapter labels or end exam.
Do not hardcode every answer to “Correct.” Sample feedback must explicitly be scripted demonstration content, not a purported personalized evaluation. Can use distinct scripted paths for empty answer and nonempty answer without pretending semantic grading.
5. Detailed states and interactions
Surface	Action	Frontend behavior now	Later API behavior
Course library	Create course	Create named local demo course	POST /courses
Course detail	Add PDFs	File chooser / drag-drop, validate .pdf and file size, show Queued (demo) filenames; keep files client-only/session memory	upload to ingest service and show actual progress
Course detail	Select chapters	Clickable multi-select chips	Load parsed chapter records
Connections	Click node/edge	Open source/relationship explanatory drawer, clearly Sample	Request grounded concept links + citations
Assistant	Click orb	Expand, focus composer	Same UI
Assistant	Tap microphone	Browser asks permission only on tap; if supported, transcribe into composer; user reviews before submit	Later real-time voice option
Assistant	Read question aloud	Browser speech synthesis on explicit action; stop/mute control	Optional TTS service
Assistant	“Test me”	Enter demo exam session with sample cross-chapter question	Start exam API call
Exam	Submit answer	Show recorded answer + Sample feedback; empty answers blocked	Evaluate with LLM + evidence
Exam	Follow-up	Show scripted question and progression	Adaptive examiner endpoint
Exam	End	Show local demo recap	Persist exam results
History	Clear	Remove local demo sessions	Delete account/session records
Settings	Toggle motion/voice	Update client preferences	Save user preferences


Important: Do not claim that the user's uploaded files determined demo questions. The sample course data should be preloaded independently from uploaded files. Expose “Backend not connected — interactive preview” unobtrusively but persistently in the demo.
6. Core components / suggested file organization
src/
  app/
    layout.tsx
    page.tsx                       # home
    courses/page.tsx
    courses/[id]/page.tsx
    connections/page.tsx
    exam/page.tsx
    history/page.tsx
    settings/page.tsx
  components/
    app-shell.tsx
    app-sidebar.tsx
    course-card.tsx
    upload-dropzone.tsx
    concept-network.tsx
    exam-question-card.tsx
    answer-composer.tsx
    feedback-card.tsx
    assistant-orb.tsx
    assistant-panel.tsx
    assistant-message.tsx
    voice-controls.tsx
    demo-mode-banner.tsx
  lib/
    demo-data.ts
    exam-fixtures.ts
    types.ts
    speech.ts
    api-client.ts                  # typed interface; not wired yet
  store/
    use-app-store.ts
  styles/
    globals.css
Organize by feature if Codex finds it clearer, but keep reusable view components separate from demo logic. Define ExamService interface and DemoExamService implementation so real API can be swapped without redesigning screens.
7. TypeScript domain contracts (target client-side interface)
type ExamPhase = 'idle' | 'preparing' | 'asking' | 'answering' | 'feedback' | 'followup' | 'completed' | 'error';
type AssistantPhase = 'closed' | 'idle' | 'listening' | 'transcribing' | 'responding' | 'speaking' | 'error';
interface Course { id: string; name: string; description?: string; chapterIds: string[]; status: 'demo' | 'pending' | 'ready'; }
interface Chapter { id: string; courseId: string; title: string; order: number; }
interface SourceRef { document: string; page: number; chapterId: string; sourceId?: string; isDemo?: boolean; }
interface ExamQuestion { id: string; text: string; chapterIds: string[]; sourceRefs: SourceRef[]; kind: 'cross_chapter_reasoning' | 'follow_up'; isDemo: boolean; }
interface ExamFeedback { strengths: string[]; gaps: string[]; suggestedImprovement: string; followUpQuestion?: ExamQuestion; sourceRefs: SourceRef[]; isDemo: boolean; }
interface ExamSession { id: string; courseId: string; phase: ExamPhase; questionIds: string[]; answers: Record<string,string>; startedAt: string; endedAt?: string; isDemo: boolean; }
A future ExamService should offer startExam, submitAnswer, nextQuestion, endExam and getSession, returning these types. Use async methods in the demo adapter to mirror future API shape, but do not fabricate network activity or true processing.
8. Responsive and accessibility requirements
- Desktop ≥1024px: fixed sidebar, spacious 2-column dashboard; assistant floats over right side.
- Tablet 768–1023px: collapsible sidebar; assistant smaller.
- Mobile <768px: single-column content, usable bottom nav, orb above nav/safe-area and assistant bottom sheet.
- All actions accessible by keyboard; visible focus, Esc closes assistant (unless it would discard content), Enter submits only when appropriate.
- Microphone button has aria-label and visible recording/listening state; announce errors and new assistant responses via polite live region.
- Meet WCAG AA contrast where feasible; honor reduced motion, no flashing effects.
- Avoid autoplay audio. Text-only mode must provide 100% feature access.
9. UI-specific privacy and trust
- Microphone audio is handled by the browser speech feature only when explicitly activated; explain browser/vendor handling and support limits. Do not claim audio stays local.
- The browser speech API may use a vendor speech service; do not enable by default.
- Never upload PDFs or answers to a server in this frontend-only phase. Avoid localStorage for raw PDF bytes, full transcriptions or sensitive course materials; demo data can be stored locally.
- Clearly separate sample/simulated feedback from real validated AI responses. Never create fake citations that look like actual uploaded PDF page references.
- On reload, restore settings and basic local demo history; not microphone capture.
10. Acceptance checklist for Codex
- [ ] Next.js project runs with npm run dev and builds with npm run build.
- [ ] Six routes render and navigate without dead links.
- [ ] The bottom-corner orb expands/collapses reliably on desktop and mobile; stays above navigation; keyboard accessible.
- [ ] “Test me” works from orb and page and launches a complete scripted demo exam flow.
- [ ] User can type an answer, view Sample feedback, advance to follow-up and end with recap.
- [ ] Browser speech input is optional, permission-gated and has text fallback; TTS can be stopped.
- [ ] Course creation, queued demo PDF selection, chapter toggles, graph interactions, session history and settings all work locally.
- [ ] Visual design is polished, consistent and readable; animations are restrained and support reduced motion.
- [ ] Demo mode is clear; no fake processing, fake AI calls, fake MCP data, or fake PDF citations.
- [ ] README accurately documents frontend-only status and future backend/MCP plan.
11. Non-goals in this phase
No FastAPI or MCP process, LLM API calls, PDF extraction/OCR, embeddings, vector search, real grading, auth, payments, production-grade voice streaming, mobile native app or cloud deployment. Maintain interfaces to integrate these later without rebuilding the frontend.
