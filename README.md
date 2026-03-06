# Vetript brand website

Landing website for the **Vetript** pet-care app (coming soon).

## What’s included

- Feature sections (consultation, medicines, 24/7 ambulance, appointments)
- About section
- Coming-soon app waitlist (saves emails to browser `localStorage`)
- Contact form
  - If `VITE_CONTACT_ENDPOINT` is set, it sends a JSON `POST`
  - Otherwise it falls back to opening a `mailto:` draft

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal.

## Configure contact endpoint (optional)

Create a `.env` file:

```bash
VITE_CONTACT_ENDPOINT="https://your-endpoint.example.com/contact"
```

