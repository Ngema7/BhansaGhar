<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:29231E,50:4A1719,100:D4A44C&height=230&section=header&text=BHANSA%20GHAR&fontSize=62&fontColor=F5EBD7&animation=fadeIn&fontAlignY=38&desc=A%20Taste%20of%20Nepal%2C%20A%20Feeling%20of%20Home.&descAlignY=58&descSize=20" width="100%" />

<h3>स्वादमा नेपालीपन, आतिथ्यमा आफ्नोपन।</h3>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Playfair+Display&weight=600&size=20&duration=3000&pause=1000&color=D4A44C&center=true&vCenter=true&width=700&lines=Authentic+Nepali+Cuisine;Restaurant+Website+%2B+QR+Table+Ordering;Full+Admin+Dashboard;Bilingual+%7C+English+%2B+%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A5%80;Built+with+React+%26+Supabase" alt="Typing SVG" />
</a>

<br/>

[![Live Demo](https://img.shields.io/badge/🍛_Live_Demo-bhansaghar--black.vercel.app-D4A44C?style=for-the-badge&logo=vercel&logoColor=black)](https://bhansaghar-black.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com)

![Status](https://img.shields.io/badge/status-live-brightgreen?style=flat-square)
![Responsive](https://img.shields.io/badge/design-responsive-4A1719?style=flat-square)
![Bilingual](https://img.shields.io/badge/language-EN%20%7C%20NE-D4A44C?style=flat-square)
![Made in Nepal](https://img.shields.io/badge/made%20in-Nepal-DC143C?style=flat-square)

<br/>

<!-- 📸 Put your 6-screen preview image here: ./docs/preview.png -->
<img src="./docs/preview.png" alt="Bhansa Ghar Preview" width="95%" />

</div>

---

## 🏔️ About

**BHANSA GHAR** is a complete restaurant platform: a premium, bilingual **Nepali restaurant website**, a **QR table-ordering system**, and a full **admin dashboard**. The owner manages everything from one place without touching code, and every change appears on the live website instantly.

> *"More Than Food, It's Our Heritage."*

```
Public Website ──┐
QR Order Page  ──┼──► Supabase (Postgres + Auth + Storage)
Admin Dashboard ─┘
```

---

## ✨ Features

### 🌐 Public Website

| | Feature | Description |
|---|---|---|
| 🏠 | **Home** | Cinematic hero, signature dishes (from ⭐ featured), gallery preview; sections can be shown or hidden from the admin |
| 📜 | **Our Story** | Heritage storytelling and values |
| 🍽️ | **Menu** | Live from the database, category filters, prices in Rs., unavailable dishes hidden automatically |
| 🖼️ | **Gallery** | Categories, "view more", full-screen lightbox |
| 📅 | **Reservation** | Saved to the database with spam protection, plus WhatsApp and call options |
| 📍 | **Contact** | Address, hours, map and social links controlled from the admin |
| 🌐 | **EN / NE Toggle** | Instantly switch between English and Nepali |
| 🎞️ | **Animations** | Smooth page and scroll animations with GSAP |
| 📱 | **Responsive** | Mobile-first for every screen size |
| 🛟 | **Fallback** | If the database is unreachable, built-in default content is shown |

### 📲 QR Table Ordering

| | Feature | Description |
|---|---|---|
| 🔳 | **Permanent QR per table** | Print once, works forever; no reprinting |
| 🛒 | **Menu + cart** | 2-column mobile menu, add to cart, kitchen note |
| 🧾 | **One bill per sitting** | Later orders from the same table are added to the same bill |
| 👀 | **Order status** | Received → Preparing → Served, plus running total |
| 🔒 | **Table must be open** | A photographed QR cannot be used from home |
| 💰 | **Server-side prices** | The phone sends only dish and quantity; the database calculates the price |
| ⭐ | **Google review button** | "Rate us on Google" and a contact footer |

### 🛠 Admin Dashboard

| Section | What it does |
|---|---|
| **Dashboard** | Today's paid sales, open tables, reservations, activity chart (sales / reservations, 7 or 30 days) |
| **Menu Management** | Add, edit, delete dishes; photo upload; price; available and featured toggles; search and filter |
| **Categories** | Add, rename, delete, reorder |
| **Gallery Management** | Multi-photo upload, edit details, show/hide, delete, gallery categories |
| **Reservations** | Search and filter, Pending / Confirmed / Cancelled, call / WhatsApp / email shortcuts |
| **Orders** | Live orders (auto-refresh), status updates, printable bill, close table when paid |
| **Tables** | Add tables, open/close, rename, hide, printable QR codes |
| **Homepage Content** | Hero text and show/hide homepage sections |
| **Website Settings** | Name, address, phone, WhatsApp, email, hours, Google Maps, social links, Google review link |
| **Admin Profile** | Change password (current password required), logout |

### 🔐 Security

- Supabase Auth login, sign-ups disabled, only users in the `admins` table get access
- Row Level Security on every table; the public can read only what is meant to be public
- Customers can submit reservations and orders but never read other people's data
- Ordering runs through secure database functions (`get_table_state`, `place_order`, `get_my_bill`)
- Database constraints validate lengths, formats and price ranges
- Image uploads limited by type and size; upload and delete are admin-only
- Secrets stay in environment variables; only the public key is used in the frontend

---

## 🎨 Design System

| Color | Hex | Usage |
|---|---|---|
| 🟤 Royal Maroon | `#4A1719` | Headers, footer, primary surfaces |
| 🔴 Brick Red | `#8E3028` | Buttons, accents |
| 🟡 Antique Gold | `#D4A44C` | CTAs, highlights, ornaments |
| 🟠 Warm Cream | `#F5EBD7` | Page backgrounds |
| ⚫ Dark Wood | `#29231E` | Text and dark sections |

**Typography:** Playfair Display · Noto Serif Devanagari · Poppins

---

## 🛠 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,js,html,css,supabase,postgres,git,github,vercel&perline=11" alt="Tech Stack" />

</div>

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, JSX, Tailwind CSS, React Router |
| **UI & Animation** | GSAP, Lucide Icons, qrcode.react |
| **Backend** | Supabase: PostgreSQL, Auth, Storage, Row Level Security |
| **Hosting** | Vercel |
| **Version Control** | Git · GitHub |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A free [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/Ngema7/BhansaGhar.git
cd BhansaGhar
npm install
```

Create a `.env` file in the project root (never commit it):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

```bash
npm run dev
```

Open **http://localhost:5173** 🍛

> Never put a Supabase **secret / service_role** key in this project. Only the publishable key is used.

### Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

---

## ☁️ Deployment

Deployed on **Vercel**.

1. Push the repo to GitHub and import it on [Vercel](https://vercel.com/new)
2. Preset: **Vite** · Build: `npm run build` · Output: `dist`
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (Production and Preview)
4. Deploy 🚀, then print table QR codes **from the live site**, not from `localhost`

---

## 👨‍💻 Developer

<div align="center">

### **Ngema Theeng**
*Creative Technologist · Full-Stack Developer*

📍 Sindhupalchok, Nepal

<a href="https://github.com/Ngema7"><img src="https://img.shields.io/badge/GitHub-ngema--theeng-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
<a href="https://ngemauniverse.vercel.app"><img src="https://img.shields.io/badge/Portfolio-NGEMA_UNIVERSE-D4A44C?style=for-the-badge&logo=vercel&logoColor=black" /></a>
<a href="#"><img src="https://img.shields.io/badge/LinkedIn-Ngema_Theeng-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
<a href="#"><img src="https://img.shields.io/badge/Instagram-@ngema__exe-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a>

</div>

---

## 📄 License

© 2026 **Ngema Theeng**. All rights reserved.
Restaurant name, branding, and content are for demonstration purposes. Please do not copy or redistribute without permission.

---

<div align="center">

**Built with ❤️ from Nepal**

*स्वादमा नेपालीपन, आतिथ्यमा आफ्नोपन।*

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:D4A44C,50:4A1719,100:29231E&height=100&section=footer" width="100%" />

</div>