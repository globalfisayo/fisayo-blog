# Opportunity Universe Migration Report

Migrated from the Notion "Opportunity Universe" database on 2026-08-21.

## Totals

- Rows exported from Notion: **408**
- Opportunity files written to `src/data/opportunities/`: **405**
- Blank rows skipped (no name and no link): **1**
- Duplicate rows dropped (same link + same title; newest kept): **2**
- Auto-closed (was marked open in Notion but deadline passed before 2026-08-21): **0**
- Needs-attention entries (no usable apply link, `applyUrl: null`): **3**

## Duplicates dropped

| Dropped (older) | Created | Kept (newer) | Created |
|---|---|---|---|
| The Club of Rome Communications Fellowship Programme | 2026-01-19 | The Club of Rome Communications Fellowship Programme (`the-club-of-rome-communications-fellowship-programme`) | 2026-02-10 |
| Kofi Annan Fellowship in Global Health Leadership | 2025-12-28 | Kofi Annan Fellowship in Global health Leadership (`kofi-annan-fellowship-in-global-health-leadership`) | 2026-01-22 |

## Needs attention: no usable apply link

These entries were migrated with `applyUrl: null` because the Notion Link field was empty or contained no extractable URL. Please find and add the correct apply link.

| Title | File | Original Link field |
|---|---|---|
| Finance & Strategy, Deal Desk - EMEA (Visa Sponsorship, €150,000 - €175,000) | `finance-strategy-deal-desk-emea-visa-sponsorship-150-000-175-000.json` | `Finance & Strategy, Deal Desk - EMEA` |
| Applications Open: Smithsonian Leadership for Change Internship 2026🌏 | `applications-open-smithsonian-leadership-for-change-internship-2026.json` | *(empty)* |
| UNOY Internship 2026: Communications Officer🌏 | `unoy-internship-2026-communications-officer.json` | *(empty)* |

## Cover images

Notion cover images could not be exported: Notion serves them through expiring signed URLs, so copying those URLs would produce images that break within hours. All migrated entries have `coverImage`/`coverImageUrl` set to `null` — the site renders its branded fallback covers in the meantime. Teammates can re-upload covers for individual opportunities via Pages CMS whenever they like.
