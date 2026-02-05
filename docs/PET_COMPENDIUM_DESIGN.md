# Pet Compendium - Design Document

A community-driven wiki-style website providing detailed information about all kinds of pets and how to care for them.

---

## 1. Project Overview

### Vision
A comprehensive, searchable pet encyclopedia where users can browse detailed profiles for a wide range of pet species, learn about their care requirements, and contribute knowledge to help other pet owners.

### Goals
- Provide accurate, well-structured care guides for all common (and uncommon) pet types
- Make information easy to find through browsing, searching, and filtering
- Allow community contributions and editorial review to keep content current
- Present information in a consistent, scannable format across all pet profiles

### Tech Stack
- **Frontend:** Vue 3, Vue Router, Pinia, Vite
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL
- **Styling:** CSS (scoped component styles)

---

## 2. Information Architecture

### Pet Categories (Top-Level)
```
Dogs
Cats
Fish (Freshwater / Saltwater)
Birds
Small Mammals (Rabbits, Guinea Pigs, Hamsters, Gerbils, Ferrets, Chinchillas, Rats, Mice)
Reptiles (Snakes, Lizards, Turtles/Tortoises, Geckos)
Amphibians (Frogs, Axolotls, Newts/Salamanders)
Invertebrates (Hermit Crabs, Tarantulas, Stick Insects, Snails)
Horses & Ponies
Exotic (Sugar Gliders, Hedgehogs, Pygmy Goats, Miniature Pigs)
```

### Pet Profile Structure
Every pet profile follows a consistent template:

| Section | Description |
|---|---|
| **Overview** | Short summary, scientific name, photo, quick-facts sidebar |
| **Quick Facts** | Lifespan, adult size, diet type, activity level, noise level, beginner-friendly rating |
| **History & Origin** | Domestication history, natural habitat, breed/species origin |
| **Appearance** | Physical description, common colour/pattern variations, size ranges |
| **Temperament & Behaviour** | Personality traits, social needs, activity patterns (diurnal/nocturnal) |
| **Housing & Habitat** | Enclosure type and minimum size, substrate, temperature, humidity, lighting |
| **Diet & Nutrition** | Primary diet, feeding schedule, treats, foods to avoid, supplements |
| **Health & Wellness** | Common health issues, signs of illness, veterinary care frequency, vaccinations |
| **Grooming & Maintenance** | Grooming needs, habitat cleaning schedule, nail/beak/dental care |
| **Training & Enrichment** | Trainability, enrichment ideas, socialisation tips, exercise needs |
| **Breeding** | Breeding basics, gestation/incubation, litter/clutch size (informational only) |
| **Legal & Ethical** | Licensing requirements, regional restrictions, ethical sourcing |
| **Cost of Ownership** | Initial setup cost range, ongoing monthly cost range |
| **Further Reading** | Links to reputable external sources |

---

## 3. Core Features

### 3.1 Browse & Discovery
- **Category landing pages** - grid/list of pets within each category with thumbnail, name, and one-line summary
- **Global search** - full-text search across pet names, descriptions, and tags
- **Filter & sort** - filter by category, beginner-friendliness, size, lifespan, cost tier; sort by name or popularity
- **"Random pet" button** - discover a pet profile at random

### 3.2 Pet Profile Pages
- Full profile rendered from the template described above
- Sidebar with quick-facts card (always visible)
- Table of contents anchored to each section for long profiles
- Breadcrumb navigation (Home > Category > Pet)
- "Related pets" section at the bottom

### 3.3 Breed / Variant Sub-Pages
- For pets with recognised breeds (dogs, cats, horses, etc.), each breed gets its own sub-page
- Breed pages inherit the parent species care info but override breed-specific fields (size, temperament, health issues, grooming)
- Breed index page per species (e.g. "Dog Breeds A-Z")

### 3.4 Care Guides (Standalone Articles)
- Longer-form articles not tied to a single pet (e.g. "Setting Up a Freshwater Aquarium", "How to Litter Train a Rabbit")
- Tagged to relevant pet categories so they surface on profile pages
- Searchable and browsable independently

### 3.5 Comparison Tool
- Side-by-side comparison of 2-3 pets
- Compares quick-facts fields (lifespan, size, cost, beginner-friendliness, etc.)
- Helps prospective owners decide between similar pets

### 3.6 User Accounts & Contributions
- **Registration / Login** - email + password authentication
- **Roles:**
  - `reader` - browse, search, bookmark
  - `contributor` - submit new content and edits (go through review)
  - `editor` - approve/reject submissions, edit any profile directly
  - `admin` - manage users, categories, site settings
- **Contribution workflow:**
  1. Contributor submits a new profile or edit
  2. Submission enters a review queue
  3. Editor reviews, requests changes or approves
  4. Approved content goes live with attribution
- **Bookmarks / Favourites** - logged-in users can bookmark pets for quick access

### 3.7 Search
- Full-text search powered by PostgreSQL `tsvector` / `tsquery`
- Search results show pet name, category, thumbnail, and a snippet
- Autocomplete / suggestions as the user types

---

## 4. Page Map

```
/                               Home (featured pets, categories overview, search bar)
/search?q=                      Search results
/category/:slug                 Category landing (e.g. /category/reptiles)
/pet/:slug                      Pet profile page (e.g. /pet/bearded-dragon)
/pet/:slug/breeds               Breed index (e.g. /pet/dog/breeds)
/pet/:slug/breeds/:breedSlug    Breed profile (e.g. /pet/dog/breeds/golden-retriever)
/guides                         Care guides listing
/guides/:slug                   Individual care guide article
/compare                        Comparison tool
/compare?pets=slug1,slug2       Comparison results

/login                          Login
/register                       Register
/profile                        User profile & bookmarks
/contribute                     Contribution submission form
/admin/review                   Editor review queue
/admin/users                    User management (admin only)
/admin/categories               Category management (admin only)
```

---

## 5. Data Model

### pets
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | |
| slug | VARCHAR UNIQUE | URL-friendly name |
| name | VARCHAR | Display name |
| scientific_name | VARCHAR | Latin/scientific name |
| category_id | FK -> categories | Top-level category |
| summary | TEXT | One-paragraph overview |
| hero_image_url | VARCHAR | Main profile image |
| quick_facts | JSONB | Lifespan, size, diet type, activity, noise, beginner rating, cost tier |
| history_origin | TEXT | History & origin section content |
| appearance | TEXT | Appearance section content |
| temperament | TEXT | Temperament & behaviour |
| housing | TEXT | Housing & habitat |
| diet | TEXT | Diet & nutrition |
| health | TEXT | Health & wellness |
| grooming | TEXT | Grooming & maintenance |
| training | TEXT | Training & enrichment |
| breeding | TEXT | Breeding information |
| legal | TEXT | Legal & ethical notes |
| cost_of_ownership | TEXT | Cost breakdown |
| further_reading | JSONB | Array of {title, url} |
| is_published | BOOLEAN | Visible on site |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### categories
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | |
| slug | VARCHAR UNIQUE | |
| name | VARCHAR | |
| description | TEXT | |
| icon_url | VARCHAR | Category icon/image |
| display_order | INT | Sort order |

### breeds
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | |
| pet_id | FK -> pets | Parent species |
| slug | VARCHAR UNIQUE | |
| name | VARCHAR | |
| hero_image_url | VARCHAR | |
| size_override | VARCHAR | Breed-specific size |
| temperament_override | TEXT | Breed-specific temperament |
| health_override | TEXT | Breed-specific health issues |
| grooming_override | TEXT | Breed-specific grooming |
| quick_facts_override | JSONB | Override any quick-fact fields |
| is_published | BOOLEAN | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### guides
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | |
| slug | VARCHAR UNIQUE | |
| title | VARCHAR | |
| content | TEXT | Full article body (Markdown) |
| hero_image_url | VARCHAR | |
| author_id | FK -> users | |
| is_published | BOOLEAN | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### guide_pet_tags
| Column | Type | Description |
|---|---|---|
| guide_id | FK -> guides | |
| pet_id | FK -> pets | |
| (composite PK) | | |

### users
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | |
| email | VARCHAR UNIQUE | |
| password_hash | VARCHAR | |
| display_name | VARCHAR | |
| role | ENUM | reader, contributor, editor, admin |
| created_at | TIMESTAMP | |

### bookmarks
| Column | Type | Description |
|---|---|---|
| user_id | FK -> users | |
| pet_id | FK -> pets | |
| created_at | TIMESTAMP | |
| (composite PK) | | |

### contributions
| Column | Type | Description |
|---|---|---|
| id | SERIAL PK | |
| contributor_id | FK -> users | |
| target_type | ENUM | pet, breed, guide |
| target_id | INT (nullable) | Null for new entries |
| action | ENUM | create, edit |
| payload | JSONB | The submitted content |
| status | ENUM | pending, approved, rejected, changes_requested |
| reviewer_id | FK -> users (nullable) | |
| reviewer_notes | TEXT | |
| created_at | TIMESTAMP | |
| reviewed_at | TIMESTAMP | |

---

## 6. API Endpoints

### Public
```
GET    /api/categories                     List all categories
GET    /api/categories/:slug               Single category with pet list
GET    /api/pets                            List pets (supports ?category, ?search, ?sort, ?page)
GET    /api/pets/random                     Random pet
GET    /api/pets/:slug                      Full pet profile
GET    /api/pets/:slug/breeds               Breeds for a pet
GET    /api/pets/:slug/breeds/:breedSlug    Single breed profile
GET    /api/guides                          List guides (supports ?pet, ?page)
GET    /api/guides/:slug                    Single guide
GET    /api/compare?pets=slug1,slug2        Comparison data for given pets
GET    /api/search?q=term                   Full-text search
```

### Authenticated (reader+)
```
GET    /api/bookmarks                       User's bookmarks
POST   /api/bookmarks/:petId                Add bookmark
DELETE /api/bookmarks/:petId                Remove bookmark
```

### Authenticated (contributor+)
```
POST   /api/contributions                   Submit new content or edit
GET    /api/contributions/mine              User's own submissions
```

### Authenticated (editor+)
```
GET    /api/contributions?status=pending    Review queue
PATCH  /api/contributions/:id               Approve / reject / request changes
```

### Authenticated (admin)
```
GET    /api/admin/users                     List users
PATCH  /api/admin/users/:id                 Update user role
POST   /api/categories                      Create category
PATCH  /api/categories/:id                  Update category
DELETE /api/categories/:id                  Delete category
POST   /api/pets                            Create pet (directly, bypassing review)
PATCH  /api/pets/:id                        Update pet
DELETE /api/pets/:id                        Delete pet
```

---

## 7. UI / UX Notes

### Home Page
- Hero section with search bar and tagline ("Everything you need to know about your pet")
- Category grid with icons (clickable tiles)
- "Featured Pets" carousel or grid (editor-curated or random)
- "Latest Care Guides" section

### Navigation
- Top nav: Logo, Search bar, Category dropdown, Guides link, Login/Register (or user menu)
- Mobile: hamburger menu with the same items
- Breadcrumbs on all inner pages

### Pet Profile Page
- Hero image with pet name overlay
- Sticky sidebar: quick-facts card, table of contents
- Content sections rendered in order with clear headings
- "Related Pets" grid at bottom
- Bookmark button (heart icon) for logged-in users

### Responsive Design
- Mobile-first approach
- Sidebar collapses below content on small screens
- Category grid adjusts columns (4 -> 2 -> 1)
- Search bar prominent on all screen sizes

---

## 8. Non-Functional Requirements

| Concern | Approach |
|---|---|
| **Performance** | Paginated API responses (20 items default), lazy-load images, PostgreSQL indexes on slug and category_id |
| **SEO** | Server-rendered meta tags (or SSR if needed later), semantic HTML, descriptive URLs |
| **Accessibility** | WCAG 2.1 AA compliance, keyboard navigation, alt text on all images, sufficient colour contrast |
| **Security** | Password hashing (bcrypt), JWT auth, input sanitisation, rate limiting on auth endpoints, CSRF protection |
| **Content format** | Profile sections stored as Markdown, rendered to HTML on the frontend |

---

## 9. Future Considerations (Out of Scope for V1)

These are ideas noted for potential future versions but explicitly **not** part of the initial build:

- User comments / discussion threads on pet profiles
- User-uploaded photos and galleries
- Pet owner community forums
- Vet/store locator maps
- "Which pet is right for me?" quiz
- Mobile app (native)
- Multilingual / i18n support
- Pet news feed / blog

---

## 10. Open Questions

1. **Content sourcing** - Will initial pet profiles be seeded manually, imported from an existing dataset, or written from scratch?
2. **Image hosting** - Store images locally on the server, or use an external service (e.g. S3/Cloudinary)?
3. **Markdown editor** - Should the contribution form use a rich Markdown editor (e.g. Milkdown, Tiptap) or a plain textarea?
4. **Auth provider** - Stick with email/password, or add OAuth (Google, GitHub)?
5. **Content licensing** - What license applies to community contributions (e.g. CC BY-SA)?

---

*This document should be reviewed and agreed upon before any code is written. Update this document as decisions are made on the open questions above.*
