# FiberNet — Home Fiber, Made Clear

A complete homepage redesign in **Next.js 16, React 19 and TypeScript**. The original website is https://fibernet-sa.online/.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open http://127.0.0.1:3000. For a production export:

```powershell
npm.cmd run build
node scripts/serve-preview.mjs
```

The production site is generated in `out/`. It can be hosted as a static site. All fonts and images are served locally; no third-party font or image requests are needed at runtime.

## Included

- Complete English/Arabic interface with proper document language, RTL layout and remembered language preference.
- Responsive desktop, tablet and phone layouts; mobile navigation and fixed contact actions.
- Header navigation follows the current section during scrolling in either direction, including fast jumps, direct section links and the bottom of the page.
- Salam, stc and Zain package tabs, nine source-backed plan entries, introductory offer conditions and plan-specific WhatsApp enquiries.
- Validated city/neighbourhood form opening a WhatsApp coverage enquiry.
- All five original wall-mounted fiber-box/metal-plate photographs, with bilingual guidance, full-image modal viewing and a photo-specific WhatsApp enquiry.
- Photos fill their gallery frames; the viewer follows each original photo's proportions without empty side panels.
- Portrait gallery thumbnails preserve the box and identification plate on phones and tablets. The viewer keeps Previous, Next and Close together in a sticky header and resets each new photo to its top.
- Separate persistent Call and WhatsApp buttons, including the phone number, mobile safe-area spacing and explicit contact actions in the menu and final section.
- Source-listed service enquiry cities and a 5G/Mobily alternatives enquiry, with no invented package prices.
- FAQs, connection process, service cities, provider selection, direct telephone links and existing privacy-policy link.
- Refined five-strand navy/blue/cyan fiber mark from the source business graphic, balanced FiberNet wordmark, light footer variant and matching favicon. Scalable SVG files are in `public/images/brand/`.
- A real optical-fiber photograph by Compare Fibre, used under the Unsplash license. No generated lifestyle imagery is used in the current design.
- A dark-navy and electric-blue visual identity, large typography and practical bilingual copy.
- Keyboard-accessible tabs, visible focus states, labelled forms, accessible accordions and reduced-motion support.

Only the homepage is built. Navigation points to homepage sections. The existing privacy-policy page opens on the original website. No additional destination pages or customer account system were created.

## Edit content

- `app/content.ts`: translations, cities and package data.
- `app/page.tsx`: homepage sections and interactions.
- `app/fiber-box-guide.tsx`: photo guide and accessible image viewer.
- `app/globals.css`: responsive design and RTL styles.
- `app/layout.tsx`: metadata and local font loading.

WhatsApp enquiries use the verified Saudi number **+966 54 720 5593**. No messages are sent automatically. The coverage form prepares an enquiry and does not perform a live network lookup.

## Source and branding

The live homepage was reviewed again on 15 November 2026. The current audit and original source snapshot are retained in `research/audit-2026-11-15/`. The comparison and completed fixes are in `research/audit-2026-11-15/audit.md`.

The original site describes FiberNet as an independent sales/commission intermediary. No official provider affiliation, customer counts, ratings or testimonials were invented. Listed offers require reconfirmation; published promotion periods and subsequent prices are shown. VAT, contract duration and current eligibility remain subject to provider confirmation.

No verified Facebook profile or standalone vector logo was linked from the original homepage. The new logo adapts the fiber fan in `research/original-business-card.jpg` into a clean vector treatment. Provider names are their respective trademarks; the provider marks are typographic/vector treatments for this concept.

See `research/redesign-study.md` for the current provider-site research, design decisions, asset credit and installed design tools. The earlier concept's image prompts are retained in `research/design-notes.md` for history.

## Verification

Production build includes TypeScript checking. Browser QA is in `scripts/browser-qa.mjs`, and the local result is saved in `artifacts/qa-report.json` with screenshots.

Browser QA requires a Chrome DevTools endpoint on `127.0.0.1:9223`. A separate production preview avoids interfering with an active development server:

```powershell
node scripts/serve-preview.mjs 3005
node scripts/browser-qa.mjs http://127.0.0.1:3005
node scripts/navigation-qa.mjs http://127.0.0.1:3005
node scripts/gallery-qa.mjs http://127.0.0.1:3005
```

It exercises both languages across 320, 360, 390, 430, 768, 1024, 1280 and 1440 px, plus short landscape navigation. Checks cover package switching, FAQs, gallery controls, focus restoration, contact links and clipping, mobile navigation, language persistence, field validation and WhatsApp enquiry content.

The navigation regression checks scroll down and back up through all six sections, follow smooth anchor links, jump to the page bottom, resize to phone and tall desktop viewports, and reload direct section URLs. Results are saved in `artifacts/navigation-qa.json`. Gallery checks also verify that the featured image and all five full-image views have no side gaps.

The focused gallery checks use a 740×360 landscape viewport in both languages. They cover reachable controls while scrolling, photo changes, modal keyboard focus, Escape, focus restoration and released page scrolling. Results are in `artifacts/gallery-qa.json`; clean English/Arabic mobile gallery previews are saved alongside it.

For development hydration diagnostics, run `node scripts/hydration-qa.mjs http://127.0.0.1:3000`. The checks simulate an extension adding `bis_register` before hydration, exercise saved Arabic preference and plan interaction, and deliberately create one child mismatch to confirm that application warnings remain enabled. That final test warning is expected and exists only in the temporary browser tab. Results are in `artifacts/hydration-qa.json`.
