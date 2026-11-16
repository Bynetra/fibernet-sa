# Homepage audit — 15 November 2026

## Scope and evidence

Compared the current original homepage at https://fibernet-sa.online/ with the Next.js redesign, including the visible sections, all package entries, enquiry/contact links and mobile behavior.

The original HTML was fetched again and saved as `original-homepage.html`. Its SHA-256 is `02F5C6D0777C569FF146B9EAAF054E091903C1C7F70D392C21B06FA3B016F734`, identical to the earlier source snapshot. This confirms the original page's published contents are unchanged; it does **not** independently verify current provider offers.

Extracted source text and URLs are in `original-text.txt` and `original-urls.txt`. Plan prices continue to carry the existing reconfirmation note.

## Findings and changes

| Item | Original homepage / prior redesign | Completed change |
| --- | --- | --- |
| Wall-mounted fiber boxes and plates | Original has a five-image carousel. The redesign omitted it. | Restored all five source photos in a labelled gallery, with useful English/Arabic instructions and full-image viewing. |
| Recognising the installation | Original photos show fiber equipment, a separate old DSL box and identification plates without much surrounding guidance. | Explain where to look, what to include in a photo and how to ask for help. Do not imply that a box proves active coverage. |
| Photo enquiry | No contextual photo enquiry in the redesign. | Dedicated WhatsApp draft asks about the box/plate and the user's city/neighbourhood. The user attaches the photo in WhatsApp; the website does not silently upload or send it. |
| Call and WhatsApp visibility | Call links existed but the persistent mobile bar showed Plans and a vaguely labelled chat action. | Separate explicit Call and WhatsApp actions, verified international number, minimum 44px controls, no truncated labels, RTL and safe-area spacing. Both are available in the final contact section and mobile menu. |
| 5G and Mobily | Mentioned by the original site's navigation/service description, absent from the redesign. | Add a compact alternatives enquiry using those names without inventing 5G plans, prices or coverage. |
| Service locations | Only the six main cities were included. | Add Makkah, Madinah, Bisha, Buraidah, Hafar Al Batin, Hail, Jazan and Tabuk from source links/images to the enquiry selector. City listings do not promise address-level coverage. |
| Package details | Some useful source inclusions were dropped. | Restore stc Basic's TV Lite qualification (no receiver) and Zain Black's two extenders. Remove the unlisted landline benefit from Salam 1000. Preserve the three provider tabs, nine package entries and three-card flow. |
| Human copy | Some copy described the page/interface or used campaign-like fragments. | Use familiar situations: moving home, changing providers, recognising a wall box and asking about a package. Simplify the final contact section and coverage FAQ. |
| Forms | Errors were visible but focus did not move to the missing field. | Focus the first missing field. Use 16px mobile inputs to avoid small-text focus zoom on mobile Safari. |
| Navigation | No route to a box guide. | Add section anchors to the mobile menu/footer and desktop navigation where space allows. Track the guide as an active section. Make the short-screen menu scrollable. |

## Gallery source files

All files are from the original site's gallery, in its original order:

1. `https://fibernet-sa.online/wp-content/uploads/2026/10/WhatsApp-Image-2025-09-06-at-2.38.27-AM.jpeg`
2. `https://fibernet-sa.online/wp-content/uploads/2026/10/WhatsApp-Image-2025-09-06-at-2.38.26-AM.jpeg`
3. `https://fibernet-sa.online/wp-content/uploads/2026/10/WhatsApp-Image-2025-09-06-at-2.38.26-AM-1.jpeg`
4. `https://fibernet-sa.online/wp-content/uploads/2026/10/WhatsApp-Image-2025-09-06-at-2.38.25-AM.jpeg`
5. `https://fibernet-sa.online/wp-content/uploads/2026/10/WhatsApp-Image-2025-09-06-at-2.38.25-AM-1.jpeg`

The public local copies are `public/images/fiber-boxes/box-1.jpg` through `box-5.jpg`. Photo 3's original is only 300×400 px; it is retained as supplied. No equipment, plate text or source annotations were generated or altered.

## Verification

- Next.js production build includes TypeScript validation.
- Browser QA checks the production static export in English and Arabic across eight widths, from 320px to 1440px, plus short landscape navigation.
- Checks include both contact destinations and full button visibility, all five photos, modal keyboard controls/Escape/focus return, package tabs and three-card visibility, FAQ expansion, error focus, city/neighbourhood WhatsApp content, mobile navigation and remembered language.
- Test calls were not dialled and test WhatsApp messages were not sent.
- Full results: `artifacts/qa-report.json`. Visual previews and the gallery section are saved beside it.
- Final result: **76 of 76 checks passed**, with zero browser errors. In both languages, the 320px page remains 320px wide and the Call/WhatsApp controls fit within the viewport.

## Remaining commercial confirmations

Current provider prices, promotion eligibility, VAT, contract duration, deposits, included benefits and address-level availability need the business/provider's confirmation before accepting an order. No verified Facebook profile was linked in the source; no guessed profile was added. No false reviews, ratings, customer counts or provider affiliations were introduced.
