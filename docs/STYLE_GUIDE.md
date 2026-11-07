STYLE_GUIDE.md — Connected Oral Exam
Status: Visual design specification, v1.0
Scope: Frontend visual redesign ONLY
Inspiration: Carbon — minimalist developer-tool layout, dark canvas, focused central editor-like surface. Do not copy Carbon branding, assets, logos, or exact composition.
1. Design intent
Connected Oral Exam is a focused learning workspace, not a colorful admin dashboard. A student should immediately understand: select a course, start an oral examination, speak or type an answer, receive an intelligent follow-up.

Design principles (in priority order):
1. Content first: The current question and student's response are the visual center.
2. Quiet interface: Dark surfaces, few colors, restrained accents, generous empty space.
3. One primary action: Make Start Exam / Answer / Continue obvious.
4. Voice feels alive: A floating orb indicates idle, listening, thinking, speaking, and error states through small but meaningful motion.
5. Trust through clarity: Distinguish real AI from scripted/demo states; show progress and errors plainly.
6. Accessibility: Readable contrast, keyboard controls, focus indicators, reduced-motion support, and text fallback for microphone access.
2. Identity and visual language
Style name: Dark minimal developer-tool UI / editor-inspired productivity app.

Avoid: glassmorphism everywhere, blurred gradients behind every card, neon outlines on all controls, oversized emoji, unnecessary charts, giant sidebars, fake terminal text for ordinary students, and pure-black surfaces with no hierarchy.

Use: almost-black page, charcoal surfaces, hairline borders, compact utility controls, desktop-editor-like exam surface, one lime accent, white/gray typography. The oral-exam surface may borrow the 'window' metaphor with a short toolbar; it must NOT pretend to be a code editor.
3. Design tokens
Implement as semantic CSS variables and map them to Tailwind/shadcn theme tokens. Use light/dark-independent semantic names rather than hard-coded hex values inside components.
Token	Value	Usage
--canvas	#101010	App page
--surface	#1B1B1B	Primary exam window / cards
--surface-raised	#242424	Input and popover surfaces
--surface-hover	#2B2B2B	Hover / selected rows
--border-subtle	#383838	Dividers, window outlines
--text-primary	#F5F5F5	Headers and body
--text-secondary	#A3A3A3	Supporting text
--text-muted	#777777	Noncritical metadata (not tiny essential text)
--accent	#C4F56A	Main CTA, voice active, active progress
--accent-foreground	#151515	Text/icons on accent
--danger	#F87171	Error feedback
--success	#86EFAC	Successful states


Use lime on at most one major CTA per view, and not for large decorative blocks. Text contrast must meet WCAG AA where practical; don't use muted gray for essential instructions.

Typography: Geist or Inter for UI; Geist Mono / a system monospace only for slide refs, tags, and technical metadata. Headline 36–48px desktop / 28–34px mobile; section headings 22–28px; body 15–17px; utility labels 12–13px. Comfortable line height 1.5–1.65 in paragraphs. Avoid tiny text in exams.

Geometry: 8px spacing system (4px for tiny gaps), cards radius 12–16px, buttons radius 8–10px, thin 1px borders. Desktop main content max width 1100–1200px; exam conversation narrower (680–820px). Shadow soft and rare. No large blurred background halos.
4. Information architecture and layout
Global app shell:
- Quiet top navigation with brand, Courses, Exams/History, and Settings.
- No mandatory persistent left sidebar; use it only when it materially improves course navigation.
- Main content centered with intentional negative space.
- Floating AI orb bottom-right with safe margin, above any sticky bottom bar; never cover input/send controls.
- Mobile: collapse navigation, use full-width main surface, account for mobile safe-area insets.
Home/dashboard: Headline 'Think beyond the slides.' Secondary line explains the value. One prominent 'Start oral exam' action, course selector, recent sessions presented compactly. Avoid KPI-card dashboards for the demo.

Courses/materials: Compact course tiles or file rows, drag-and-drop PDF panel, file name, page count and processing status. Distinguish mock upload state from backend-processed material. Keep empty states useful.

Oral exam (hero feature): Large centered editor-inspired panel with very small window/toolbar strip (course, session status, source references). Current AI question prominent; answer input beneath it; voice action near answer field; 'Submit answer' primary CTA; feedback in clear readable blocks. Show connected chapter tags and slide references only when real source evidence exists; for mock sessions mark examples as demo.

Concept connections: Sparse readable graph/list hybrid, with concept pairs and source information; do not build a dense decorative node cloud. Keyboard-accessible fallback list required.

History/feedback: Compact session history; review question → student answer → evaluation → next concept. Avoid unvalidated numeric mastery scores in demo mode.
5. Floating voice assistant
The orb is the product's recognizable element, but it must not dominate the study surface.
- Fixed bottom-right, approx. 56–64px desktop, 52–60px mobile, minimum 44px interaction target.
- Default: charcoal fill, thin accent border or subtle shadow; slow, minimal float/breath effect.
- Hover/focus: slightly brighter accent, scale at most 1.04.
- Listening: softly expanding waveform/ring; visible label 'Listening'.
- Thinking: subtle rotating or pulsing indicator; label 'Thinking'.
- Speaking: gentle audio bars; label 'Speaking'.
- Error: static error indicator + actionable text; don't animate endlessly.
- Clicking orb toggles the panel; Escape closes it when appropriate; focus moves predictably.
- Assistant panel anchored close to orb on desktop; on narrow screens show a bottom sheet with keyboard-safe layout.
- Allow switching between voice and typed answers at any point. Explain microphone permission failures clearly.
- If prefers-reduced-motion is enabled, eliminate continuous orb motion, use static state changes.
Do not change the existing voice, AI, or exam behavior as part of the visual refactor. Only style their existing states; if a state is missing, add a presentational fallback without changing orchestration.
6. Component styling rules
- Buttons: accent-filled only for primary action. Secondary gray outlined/ghost. Clear disabled/loading/focus states.
- Inputs: raised charcoal background, 1px border, generous hit area, unmistakable focus outline.
- Cards: subtle border and no gradient; use consistent padding 20–24px.
- Badges: small neutral pills; lime only for meaningful active state.
- Navigation: muted inactive labels, single subtle active marker; avoid giant icon-heavy rails.
- Toasts/errors: concise, unambiguous; provide retry action for network failures.
- Sources: short chapter/page chips and accessible hover/focus detail when real citations are available.
- Loading: local skeletons/spinners that preserve layout; avoid whole-page blocking overlays.
7. Motion rules
Use Motion already installed; prefer CSS transitions for simple interactions. Typical timing: 150–220ms for controls, 220–320ms for panel opening, spring only for orb interaction. All animation must serve attention or state. Avoid parallax and unnecessary animated background elements. Support prefers-reduced-motion.
8. Responsive behavior
- Desktop >=1024px: spacious centered workspace, orb at bottom-right.
- Tablet 640–1023px: reduced outer margins, compact toolbar.
- Mobile <640px: full-width stacked layout, assistant bottom sheet, no clipped long questions, keyboard-safe answer area. No horizontal scroll.
9. Functional invariants (must not break)
Preserve existing routes, course selection, sample content, exam-start flow, message history, loading/error states, OpenAI API calls if implemented, microphone and speech controls, conversation state, and keyboard interactions. No changes to backend contracts or API routes for a design-only pass. The app may already contain real or simulated features: keep truthful labels.
10. Suggested implementation sequence for Codex
1. Inspect existing components and audit reusable classes/tokens. Don't rewrite from scratch.
2. Add semantic design tokens and typography once, globally.
3. Restyle app shell and navigation.
4. Restyle exam window and input controls (highest priority).
5. Restyle the orb and assistant panel while preserving logic.
6. Restyle courses, materials, concepts, history, settings.
7. Test 1440px, 768px, 390px widths, keyboard navigation, focus, voice fallback, reduced motion.
8. Run TypeScript/lint/build and smoke-test a full sample exam flow.
11. Acceptance checklist
- [ ] Exam question is the visual focal point.
- [ ] The UI looks minimalist, dark, and editor-inspired (not like a code editor clone).
- [ ] One primary lime CTA per view.
- [ ] Floating orb changes appearance for all supported states.
- [ ] Text-only oral exam works even if microphone permission is denied.
- [ ] Course/materials/history screens share the same tokens.
- [ ] Good legibility and focus states on desktop and mobile.
- [ ] No functional regressions in existing exam/AI integration.
- [ ] No copied Carbon logos, code samples, or branded assets.
12. Future backend and Docker note
This design specification does not change the planned architecture: Next.js frontend now; optional Next.js API route for live OpenAI examiner; later Python/FastAPI, MCP, document processing, and storage. Keep server-side secrets out of the browser. Containerization belongs in a separate deployment document and must preserve environment-variable handling.