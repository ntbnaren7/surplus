# 🥗 Surplus | Zero Hunger Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Framework: Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014-black)](https://nextjs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com/)
[![Maps: Mapbox](https://img.shields.io/badge/Maps-Mapbox-blue)](https://www.mapbox.com/)

**Surplus** is a high-fidelity, real-time logistics ecosystem designed to bridge the gap between food waste and food insecurity. It transforms surplus food into life-saving resources by connecting Donors, Drivers, Receivers, and Volunteers through an AI-driven, road-aware logistics engine.

---

## 🚀 Key Features

### 🏢 Four-Pillar Ecosystem
Surplus provides tailored experiences for every stakeholder in the food rescue lifecycle:
*   **Donor Dashboard:** Frictionless broadcasting of surplus food with AI-suggested expiry and one-click POS integration.
*   **Driver Dashboard:** High-stakes mission dispatch with the **Neural Navigator** for optimized road-aligned routing.
*   **Receiver Dashboard:** Priority-based feed powered by the **Smart Match Engine** to ensure food goes where it is needed most.
*   **Volunteer Hub:** Gamified community engagement with **Swipe-to-Rescue** mechanics and local impact leaderboards.

### 🧠 Intelligence Layer
*   **Neural Navigator:** A modified TSP (Traveling Salesman Problem) solver that prioritizes **expiry-risk** over simple distance, ensuring highly perishable items are delivered first.
*   **Smart Match Engine:** A weighted priority scoring algorithm that ranks available food based on facility need, population density, and geospatial proximity.
*   **Edge AI Vision:** A client-side OCR (Optical Character Recognition) pipeline using **Tesseract.js** to read food labels, verify expiry dates, and block non-compliant pickups automatically.

### 🚛 High-Fidelity Simulation
*   **Live Logistics Simulator:** A physics-based movement engine using **Turf.js** that interpolates vehicle positions along actual Bangalore road networks (Koramangala Pilot).
*   **Logistics Pulse:** Real-time state synchronization across all dashboards via **Supabase Realtime**, allowing stakeholders to watch "The Pulse of the City" live.

---

## 🏗️ System Architecture & Design

### **System Flow**
1.  **Broadcast:** Donors list food. The event is pushed via Supabase Realtime to the global store.
2.  **Matching:** The Smart Match Engine scores the drop against all active NGO/Shelter profiles.
3.  **Claim:** A Receiver claims the batch. Status updates to `CLAIMED`.
4.  **Dispatch:** The Neural Navigator calculates the optimal route for the nearest available Driver/Volunteer.
5.  **Verification:** The Driver uses the **Edge AI Vision** scanner to verify labels before pickup.
6.  **Transit:** Live movement is broadcast to the Receiver until the digital signature is captured.

### **Tech Stack**
*   **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion.
*   **Backend:** Next.js Server Actions, Supabase (Postgres, Auth, Realtime).
*   **Maps & Geospatial:** Mapbox GL JS, Turf.js.
*   **AI/ML:** Tesseract.js (Edge OCR), Custom Heuristic Routing Algorithms.
*   **State Management:** Zustand (with Realtime Sync Persistence).

---

## 🛠️ Getting Started

### **Prerequisites**
*   Node.js 18+
*   Supabase Account
*   Mapbox Access Token

### **Installation**
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/surplus.git
    cd surplus
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token
    ```

4.  **Database Setup:**
    Run the `supabase_seed_koramangala.sql` script in your Supabase SQL Editor to populate the Bangalore pilot data.

5.  **Run Locally:**
    ```bash
    npm run dev
    ```

---

## 🗺️ Roadmap
*   [ ] **Neural Forecasting:** Predicting tomorrow's surplus using historical data.
*   [ ] **Cold-Chain Verification:** Integration with IoT sensors for temperature-sensitive transport.
*   [ ] **Global Scale:** Expanding the "Road-Aware" simulation beyond Bangalore.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

## ✨ Developed with ❤️ for a Hunger-Free World
Surplus is more than an app—it's the infrastructure for a zero-waste future.
