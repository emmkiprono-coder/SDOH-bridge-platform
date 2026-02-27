# SDOH Bridge

**Social Determinants of Health Screening, Referral & Loop Closure Platform**

A role-based web application for managing SDOH screenings, referrals, cultural resource matching, and health equity analytics across Advocate Health's multi-state operations.

---

## Portals

| Portal | User | Key Views |
|--------|------|-----------|
| **Administration** | AVP / Leadership | Dashboard, Analytics, Equity Reports, AI Agent |
| **Screener** | Social Workers | Daily Schedule, Screening Tool, Referrals, Resources |
| **Patient** | Patients | My Health, My Services, Find Help, Messages |
| **Community Worker** | CHWs | Field Dashboard, Home Visits, Outreach, Resources |

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 3.4 + shadcn/ui
- Recharts (analytics charts)
- Lucide React (icons)
- Sonner (notifications)
- Epic FHIR R4 integration layer (SMART on FHIR, Gravity Project IG)

---

## Quick Start (Local Development)

```bash
# 1. Clone
git clone https://github.com/emmkip/sdoh-bridge.git
cd sdoh-bridge

# 2. Install
pnpm install

# 3. Run
pnpm dev
```

Open http://localhost:5173

---

## GitHub Setup

### Step 1: Create the Repository

Go to https://github.com/new and create a new repository:

- **Repository name:** `sdoh-bridge`
- **Visibility:** Private (recommended for healthcare data)
- **Do NOT** initialize with README, .gitignore, or license (we have our own)

### Step 2: Push the Code

```bash
# Unzip the downloaded repo
unzip sdoh-bridge-repo.zip
cd sdoh-bridge-repo

# Initialize git
git init
git add .
git commit -m "feat: SDOH Bridge platform with 4 role-based portals and Epic FHIR integration"

# Connect to GitHub (use your account)
git remote add origin https://github.com/emmkip/sdoh-bridge.git
git branch -M main
git push -u origin main
```

### Step 3: Verify

Visit https://github.com/emmkip/sdoh-bridge and confirm all files are present.

---

## Vercel Deployment

### Option A: One-Click (Recommended)

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select **emmkip/sdoh-bridge** from the list
4. Vercel auto-detects the Vite framework
5. Verify these settings (should be auto-filled from vercel.json):
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`
   - **Node.js Version:** 20.x
6. Click **Deploy**
7. Wait ~60 seconds for the build to complete
8. Your app is live at `https://sdoh-bridge-xxxx.vercel.app`

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from the repo directory)
cd sdoh-bridge-repo
vercel

# Follow the prompts:
#   Set up and deploy? Y
#   Which scope? (select your account)
#   Link to existing project? N
#   Project name? sdoh-bridge
#   Directory? ./
#   Override settings? N

# Deploy to production
vercel --prod
```

### Option C: Auto-Deploy from GitHub

Once connected via Option A, every push to `main` automatically triggers a new deployment. Vercel also creates preview deployments for pull requests.

---

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your domain: `sdoh-bridge.advocatehealth.org`
3. Update DNS:
   - **CNAME:** `sdoh-bridge` -> `cname.vercel-dns.com`
   - Or **A record:** `76.76.21.21`
4. Vercel auto-provisions SSL

---

## Environment Variables

For Epic FHIR integration (not needed for demo mode):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_EPIC_CLIENT_ID` | App Orchard client ID | `sdoh-bridge-prod` |
| `VITE_EPIC_REDIRECT_URI` | OAuth2 callback URL | `https://sdoh-bridge.vercel.app/launch/callback` |
| `VITE_FHIR_BASE_URL` | Epic FHIR endpoint | `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4` |

Set these in Vercel: **Settings > Environment Variables**

---

## Project Structure

```
sdoh-bridge/
├── .gitignore              # Git ignore rules
├── .npmrc                  # pnpm compatibility
├── .nvmrc                  # Node 20 for Vercel
├── vercel.json             # Vercel deployment config
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite build config
├── tailwind.config.js      # Tailwind theme
├── tsconfig.json           # TypeScript config
├── index.html              # Entry HTML
├── public/                 # Static assets
└── src/
    ├── App.tsx             # Root with role-based routing
    ├── main.tsx            # Entry point
    ├── index.css           # Global styles + Tailwind
    ├── components/
    │   ├── Sidebar.tsx     # Role-aware navigation + role switcher
    │   └── ui/             # 40+ shadcn/ui components
    ├── context/
    │   └── AppContext.tsx   # Global state (role, patients, referrals)
    ├── data/
    │   └── mockData.ts     # Demo data (8 patients, 6 states)
    ├── services/
    │   ├── fhir.ts         # Epic FHIR service layer
    │   └── SmartLaunchGate.tsx  # SMART on FHIR OAuth2 handler
    ├── types/
    │   └── index.ts        # TypeScript interfaces
    └── views/
        ├── DashboardView.tsx        # Admin KPIs
        ├── ScreeningView.tsx        # SDOH screening tool
        ├── ReferralsView.tsx        # Referral pipeline
        ├── PatientsView.tsx         # Patient registry
        ├── AnalyticsView.tsx        # Equity analytics (5 tabs)
        ├── AgentView.tsx            # AI agent chat
        ├── ScreenerScheduleView.tsx # Screener daily timeline
        ├── ScreenerResourcesView.tsx
        ├── PatientPortalViews.tsx   # Patient portal (4 views)
        └── CHWPortalViews.tsx       # CHW portal (4 views)
```

---

## Key Files Explained

| File | What It Does |
|------|-------------|
| `vercel.json` | Tells Vercel: use Vite, run `pnpm build`, output to `dist/`, rewrite all routes to `index.html` for SPA |
| `.nvmrc` | Pins Node.js 20 for Vercel builds |
| `.npmrc` | Ensures pnpm hoists packages correctly for shadcn/ui |
| `.gitignore` | Excludes `node_modules/`, `dist/`, `.env`, editor files from git |
| `tsconfig.app.json` | TypeScript config with relaxed unused-variable checks (prevents build failures) |
| `src/services/fhir.ts` | FHIR R4 types, LOINC mappings, resource mappers, SMART client, CDS Hooks handler |
| `src/services/SmartLaunchGate.tsx` | Detects EHR vs standalone launch, handles OAuth2 flow, falls back to demo mode |

---

## Troubleshooting

**Build fails on Vercel?**
- Check that Node.js version is 20 (set in `.nvmrc`)
- Ensure `pnpm` is the install command (set in `vercel.json`)

**Blank page after deploy?**
- The SPA rewrite in `vercel.json` should handle this. If not, check the browser console for errors.

**Want to use npm instead of pnpm?**
- Delete `pnpm-lock.yaml`
- Change `vercel.json` installCommand to `npm install` and buildCommand to `npm run build`
- Run `npm install` locally

---

## License

Private. All rights reserved. Advocate Health.
