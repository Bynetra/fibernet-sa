# Homepage UI follow-up — 16 November 2026

This is a local UI follow-up to the original-site comparison on 15 November. It does not claim another verification of live provider offers.

- Keep the four gallery thumbnails in portrait frames on phones and tablets. The earlier wide crops concealed part of the fiber box or its identification plate. The annotated landscape photo retains its original proportions.
- Keep Previous, Next and Close in the viewer's sticky header, with 44px buttons. All three remain reachable when the image scrolls on a short landscape screen.
- Start each newly selected photo at its top. Previously the viewer retained the preceding photo's scroll position, concealing the beginning of the next photograph.
- Associate the viewer's description with the dialog for assistive technology; retain keyboard navigation, focus trapping, Escape and focus return to the exact opening thumbnail.
- Capture clean section previews without fixed viewport overlays. This affects the QA screenshot process only.

The six-section scroll navigation, Call/WhatsApp destinations, provider tabs and three-card plan flow remain covered by the existing browser checks. Current reports are `artifacts/qa-report.json`, `artifacts/navigation-qa.json` and `artifacts/gallery-qa.json`.

Final result: the production build passed, followed by **102 homepage checks, 58 navigation checks and 12 focused gallery checks**. All **172 checks passed**, with no browser errors in the main suite. English and Arabic mobile gallery previews are `artifacts/fiber-box-guide-mobile-en.png` and `artifacts/fiber-box-guide-mobile-ar.png`.

Production verification uses the static export on a separate local port, leaving the development server available. The homepage still uses the original business photographs; no equipment, labels or plate text were generated or altered.
