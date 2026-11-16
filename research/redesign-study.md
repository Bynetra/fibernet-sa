# FiberNet homepage redesign study

## Brief

The first concept felt generic and did not reflect FiberNet's blue branding. The revision restores deep navy and electric blue, removes generated home imagery and slogan-heavy sections, and retains the existing Salam/stc/Zain tab navigation with three package cards per provider.

## Official provider references reviewed

1. **GFiber — https://gfiber.com/**
   Large, confident typography and one clear availability action. Packages explain both the price and the equipment/service included. Visual lesson: give the main message room, but make the next action obvious.
2. **Hyperoptic — https://www.hyperoptic.com/**
   A strongly branded blue identity, offer-led hero, postcode enquiry and explicit pricing after the promotional period. Visual lesson: strong brand contrast and useful offer details can coexist.
3. **Verizon — https://www.verizon.com/home/internet/**
   Direct price-led copy, prominent offer conditions, an address-first flow and benefit comparisons. The page text and color data loaded; the initial local screenshot did not fully render. No visual details were inferred from the blank capture.
4. **Starlink — https://starlink.com/residential**
   A dark, high-contrast layout with a clear home/on-the-go distinction and address input. Some background media did not load in the research browser. The visible layout and action hierarchy were reviewed.
5. **Swisscom — https://www.swisscom.ch/en/residential/internet-subscription.html**
   Blue brand palette, specific service modules, comparison information and practical FAQs. Text and color data loaded; hero media was incomplete in the local capture.

Additional content references: https://www.att.com/internet/ and https://www.telstra.com.au/internet — address availability, specific package choices and explicit offer terms.

These are design references rather than an objective ranking of the world's best providers. Their proprietary assets and copy were not reused.

Research screenshots and extracted headings/colors are in `research/provider-references/`.

## Implemented direction

- Deep navy `#04112e` and `#071b46`, electric blue `#245cff`, sky blue `#83b6ff`.
- A full-width photographic hero, three-line headline, direct comparison/coverage actions and a source-backed maximum speed display.
- Clearer provider tabs; the same selection state, keyboard behavior and three-card comparison remain.
- Package prices, offer periods and subsequent prices remain visible. No invented official affiliation, review score, customer count or installation guarantee.
- An editorial advice section about address eligibility, actual subscription cost and the next steps.
- A navy application process band, white coverage form beside an illustrative map, practical FAQs and a direct contact section.
- English and Saudi Arabic copy. Proper RTL and separate treatment of phone numbers, trademarks and speed values.

## Photography

**Photographer:** Compare Fibre

**Photo:** https://unsplash.com/photos/blue-and-white-light-in-dark-room-INNsF0Zz_kQ

**License:** Free to use under the Unsplash License, as stated on the photo's source page: https://unsplash.com/license

**Local file:** `public/images/fiber-photograph.jpg`

The photograph is loaded locally and blended through CSS; no generated raster images are used by this revision. Earlier generated assets are retained in `research/generated-assets/` and are not shipped as public assets.

## Design tools

Official skills installed from https://github.com/openai/skills:

- `figma`
- `figma-create-new-file`
- `figma-generate-design`
- `figma-use` (required scripting dependency)

The skills are available to Codex on the next turn. Figma and Product Design plugins were offered for connection. They were not confirmed connected during this work, so this revision was implemented and reviewed locally rather than being represented as a completed Figma file.

## Verification

Next.js production build with TypeScript validation, plus browser QA at 320, 360, 390, 768, 1024 and 1440 pixels in English and Arabic. Interaction checks cover provider switching, three-card visibility, FAQs, mobile navigation, language persistence and validated WhatsApp enquiry content. No test messages were sent.
