# 🦉 LernBuddy – Deployment Anleitung

## Projektstruktur
```
lernbuddy/
├── api/
│   └── chat.js          ← Sichere Server-Funktion (API Key bleibt geheim)
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   ├── App.jsx
│   └── LernBuddy.jsx    ← Haupt-App mit Upload-Funktion
├── package.json
└── vercel.json
```

---

## Schritt 1 – GitHub Repository erstellen

1. Gehe auf https://github.com → "New repository"
2. Name: `lernbuddy`
3. Visibility: **Private** (wichtig!)
4. Klick auf "Create repository"
5. Lade alle Dateien aus diesem Ordner hoch (Drag & Drop ins GitHub Interface)

---

## Schritt 2 – Vercel Projekt erstellen

1. Gehe auf https://vercel.com → "Sign up" mit deinem GitHub Account
2. Klick auf "Add New Project"
3. Wähle dein `lernbuddy` Repository → "Import"
4. Framework: **Create React App** (wird automatisch erkannt)
5. Klick auf **Deploy** → warte ~2 Minuten

---

## Schritt 3 – API Key als Umgebungsvariable setzen ⚠️

**Das ist der wichtigste Schritt – ohne das funktioniert die App nicht!**

1. Gehe auf https://console.anthropic.com → "API Keys" → "Create Key"
2. Kopiere den Key (beginnt mit `sk-ant-...`)
3. In Vercel: Dein Projekt → **Settings** → **Environment Variables**
4. Neue Variable hinzufügen:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (dein Key)
   - Environment: Production + Preview + Development
5. **Redeploy** klicken (Settings → Deployments → Redeploy)

---

## Schritt 4 – Easyname Domain verbinden

1. In Vercel: Dein Projekt → **Settings** → **Domains**
2. Gib deine Domain ein (z.B. `lernbuddy.at`) → "Add"
3. Vercel zeigt dir zwei DNS-Einträge, z.B.:
   ```
   A-Record:    @    →  76.76.21.21
   CNAME:       www  →  cname.vercel-dns.com
   ```
4. Gehe auf https://my.easyname.com → Deine Domain → **DNS-Verwaltung**
5. Trage die beiden Werte ein
6. Warte 5–30 Minuten → Domain ist live ✅

---

## Fertig! 🎉

Deine App ist jetzt erreichbar unter deiner Domain.
Der Anthropic API Key ist sicher auf dem Server gespeichert und
für niemanden von außen sichtbar.

---

## Optional: Kosten im Blick behalten

- Vercel Hobby Plan: **kostenlos** für kleine Projekte
- Anthropic API: ~$0.003 pro Gespräch (sehr günstig)
- Für mehr Traffic: Vercel Pro ($20/Monat) oder eigener Server

---

## Support

Bei Fragen: hello@lernbuddy.at (oder deine eigene Support-Mail)
