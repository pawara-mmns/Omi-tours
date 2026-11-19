# OMI TOURS — The Ceylon Field Journal

A responsive English-language Sri Lankan travel site built with Next.js App Router, TypeScript and Tailwind CSS. Node.js 22.13 or later is required. Use a Node server with a persistent disk for inquiries.

## Run

```sh
npm ci
npm run dev
```

For a production build, run `npm run build` and `npm start`. Use `npm test` for the data and inquiry tests and `npm run typecheck` for TypeScript checks.

## Owner workflow available now

1. Open the journey page to check the public ten-day route. Travelers can add notes to any day and select a beach. Those preferences are saved in the visitor's browser. Their name and email go to the server only on submission.
2. A successful form submission creates a durable SQLite record and returns a reference. Set `OMI_DATA_DIR` to a private persistent directory outside the web root. The default is `.private/` under the project. Keep this directory out of source control. The website process and the owner command must use the same directory.
3. Run `npm run admin -- inquiries` to see received references. Open one with `npm run admin -- show REFERENCE`. Mark it with `npm run admin -- status REFERENCE in-review`, `quoted`, or `closed`. Prepare and send a quote through OMI’s own business channel. The site stores inquiries locally. It does not send email or WhatsApp notifications.
4. From the project folder run `npm run admin -- draft journey-draft.json`. Edit the journey introduction, day headings or descriptions in the draft. Run `npm run admin -- apply journey-draft.json` to validate and import the revision. The command rejects stale revisions and backs up the prior JSON under the private data directory. Rebuild and restart to publish. Admin tools are local commands and require access to the project folder.
5. Changes to route geography, the beach list or night allocation require coordinated edits to the data, map and tests. The text editor deliberately maintains the original itinerary structure. Review any edited copy against the approved business agenda.

## Staged management and launch

| Stage | Work and acceptance condition |
| --- | --- |
| 1 · Delivered | Public experience pages, daily preferences, route map, real inquiry receipt, local owner queue and validated package text revisions. Verify a test inquiry on the intended host before opening it to customers. |
| 2 · Public launch | Choose a domain and persistent Node host, configure HTTPS, regular private backups, recovery, retention and submission rate limits. Confirm image rights, verified contact channels, operating terms, and the actual services offered. Select an owner recipient and add delivery with retry tracking. Verify a quote request reaches that recipient and survives restart. |
| 3 · Staff management | Add staff sign-in, editor and publisher roles, browser-based package drafts, photo uploads, route editing and revision history. Use stable package and day IDs. Publish only an approved revision and retain the exact revision attached to each inquiry. Restore a prior revision in staging before rollout. |
| 4 · Quotations | Add itemized prices, currency, traveler basis, validity, inclusions and exclusions, private customer versions and optional branded PDF export. Require OMI approval before dispatch. Add payments only after commercial terms are confirmed. |

## Source and visual choices

The supplied four-page OMI agenda dated 16–25 January 2027 supplies the actual ten-day route, optional temple stop, two breakfast-only Ella nights, park visits and five drop-offs. Timings are sample estimates. Beach extensions are outside the nine nights. No customer dates, bookings, prices, ratings or registration claims are published. Experience cards are themes from the sample itinerary.

Three visual directions were explored: The Living Island, The Ceylon Field Journal and The Island Atlas. The selected second direction, The Ceylon Field Journal, uses a linen binding, botanical sketches and a mounted railway scene. The railway scene and sketches are AI-generated editorial artwork. The island guide uses the ten leading destinations listed in section 5.1 of the [SLTDA 2024–2025 visitor survey](https://www.sltda.gov.lk/storage/common_media/SurveyReport2024-2025.pdf#page=55). Each destination opens its own field note and has a distinct engraved illustration. The mark and other destination imagery are extracted from the supplied agenda. Confirm publication rights before public launch. The route outline uses Natural Earth via world-atlas. The lines indicate the stop sequence. They are not driving directions.

## Project layout

The private packages section below the gallery uses `src/data/packages.mjs`. It presents the supplied ten-day itinerary alongside two suggested shorter routes. Each quote link carries the route, suggested length and interests into the editable inquiry. The owner can see the selected package ID and the requested destinations with the inquiry details.

- `src/app` contains the pages, metadata, global styles and server inquiry endpoint.
- `src/components` contains the shared header, hero, experience cards, itinerary, route map and form.
- `src/data` holds package copy, experience content and the geographical outline.
- `src/lib` handles local itinerary preferences, validation and durable inquiry storage.
- `scripts` holds owner tools and the reproducible map builder.
- `tests` covers validation, persisted submissions, retry handling and the original package allocation.

The homepage and individual experiences are prerendered. Images and fonts are served locally. The site includes keyboard navigation, reduced-motion styling, native labeled controls and text equivalents for the route.

