# AL SYED — Documented Cases Website
## cases.alsyedinitiative.com

---

## FOLDER STRUCTURE

```
alsyed-cases/
├── public/
│   ├── index.html          ← Main website
│   ├── admin/
│   │   ├── index.html      ← Netlify CMS panel
│   │   └── config.yml      ← CMS fields config
│   └── uploads/            ← Cover photos (auto-created)
├── content/
│   └── cases/
│       └── hamare-baarah.md  ← Each case = one .md file
├── scripts/
│   └── build-cases.js      ← Converts .md files → cases-index.json
├── package.json
├── netlify.toml
└── README.md
```

---

## SETUP STEPS (Do these once)

### Step 1 — Push to GitHub
1. Go to github.com → New repository → name it `alsyed-cases`
2. Make it **Private**
3. Upload all these files (drag and drop or use GitHub Desktop)

### Step 2 — Connect to Netlify
1. Go to netlify.com → Add new site → Import from GitHub
2. Select your `alsyed-cases` repo
3. Build command: `node scripts/build-cases.js`
4. Publish directory: `public`
5. Click Deploy

### Step 3 — Enable Netlify Identity (for admin login)
1. In Netlify dashboard → Site settings → Identity
2. Click **Enable Identity**
3. Under Registration → change to **Invite only**
4. Under Services → Git Gateway → click **Enable Git Gateway**

### Step 4 — Add Team Members
1. Netlify dashboard → Identity → Invite users
2. Enter their email → they get a link to set their password
3. They log in at: `cases.alsyedinitiative.com/admin`

### Step 5 — Connect your subdomain
1. In Netlify → Domain settings → Add custom domain
2. Type: `cases.alsyedinitiative.com`
3. Go to your domain registrar (Hostinger) → DNS settings
4. Add a CNAME record:
   - Name: `cases`
   - Value: `your-site-name.netlify.app`
5. Wait 10-30 mins for DNS to propagate

---

## HOW TEAM MEMBERS PUBLISH A CASE

1. Go to `cases.alsyedinitiative.com/admin`
2. Log in with their email + password
3. Click **New Case**
4. Fill in:
   - Title (English + Urdu)
   - Category (OSINT / Legal / Media / Community)
   - Case Outcome
   - Date, Cover Photo
   - Summary (English + Urdu)
   - Full Body (English + Urdu) — supports markdown formatting
5. Toggle **Published** to ON
6. Click **Publish** — article goes live in ~30 seconds

---

## ADDING MORE TEAM MEMBERS LATER
Just go to Netlify → Identity → Invite users → add their email.
They never need to touch code or GitHub.
