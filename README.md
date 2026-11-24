# 🚀 Developer Portfolio & Interactive Resume

A pixel-perfect, modern, high-performance developer portfolio website inspired by [ishitamathur.netlify.app](https://ishitamathur.netlify.app/).

Engineered with **pure HTML5, CSS3, and JavaScript** (zero framework bloat, zero build steps, ultra-fast load speed), featuring a sleek dark aesthetic, animated stat counters, project showcase cards, and a **one-click direct Resume Download** feature.

---

## ✨ Features

- **Direct Resume Download**: Integrated `Download Resume` CTA buttons in the hero section, about section, and contact section linking directly to your PDF resume (`assets/Resume_Dhruv_Sharma.pdf`).
- **Dynamic Scroll Progress Bar**: Gradient indicator at the top of the viewport tracking your reading position.
- **Telemetry Counter Panel**: macOS terminal-style panel with animated number counting for solved problems, projects, and achievements.
- **Scroll Reveal Animations**: Smooth entrance animations triggered via modern `IntersectionObserver`.
- **Responsive Mobile Navigation**: Clean hamburger drawer for mobile screens and sticky blur navbar on desktop.
- **Interactive Contact Features**: One-click copy email button with visual feedback tooltip and contact form handler.
- **100% Zero-Config & Static**: Runs anywhere with zero build tools or dependencies.

---

## 📂 Project Structure

```text
portfolio-website/
├── index.html                   # Main webpage containing all sections
├── styles.css                   # Custom dark design system, CSS variables & animations
├── script.js                    # Smooth scrolling, counters, copy button & handlers
├── generate_resume.py           # Standalone Python script to regenerate Resume PDF
├── assets/
│   ├── Resume_Dhruv_Sharma.pdf  # Downloadable PDF resume
│   └── avatar.svg               # Modern tech avatar illustration (or your photo)
└── README.md                    # Documentation & deployment guide
```

---

## 💻 Quick Start & Local Preview

### Option 1: Direct File Open (Easiest)
Simply double-click `index.html` or right-click `index.html` → **Open with Google Chrome** (or Edge / Firefox / Brave).

### Option 2: Local HTTP Server
Run any of the following commands in this directory:

```bash
# Using Python
python -m http.server 3000

# Or using Node.js
npx serve .
```
Then visit `http://localhost:3000` in your browser.

---

## 🎨 How to Customize Your Portfolio

### 1. Update Personal Details & Projects
Open `index.html` in your favorite code editor (VS Code, etc.) and edit:
- **Hero Title & Bio**: Look for the `<h1 class="hero-title">` and `<p class="hero-sub">`.
- **Stat Counters**: In the `.stats-grid`, change `data-target="500"` to your preferred numbers.
- **Featured Projects**: Under `<section id="projects">`, customize project titles, descriptions, and GitHub links.
- **Contact Info**: Search for `dhruvsharma71105@gmail.com` and replace it with your email.

### 2. Update Your Photo
- Drop your photo (e.g. `me.jpg` or `profile.png`) into the `assets/` folder.
- In `index.html`, find `<img src="assets/avatar.svg" alt="...">` and replace it with:
  ```html
  <img src="assets/me.jpg" alt="Dhruv Sharma">
  ```

### 3. Replace or Update Your Resume PDF
- Place your updated PDF in the `assets/` directory (e.g., `assets/Resume_Dhruv_Sharma.pdf`).
- If you change the filename, update the `href` and `download` attributes in `index.html`:
  ```html
  <a href="assets/Your_Resume.pdf" class="btn btn-secondary" download="Your_Resume.pdf">
    <i class="fa-solid fa-arrow-down"></i>
    <span>Download Resume</span>
  </a>
  ```

---

## 🌐 Free 1-Click Deployment (Get Your Live Link!)

### Method A: Netlify Drop (Just like Ishita's site!)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Sign in or sign up with your GitHub account.
3. Drag and drop the `portfolio-website` folder directly into the browser.
4. Your site is live instantly! You can change the subdomain in Site Settings to `dhruvsharma.netlify.app` or connect a custom domain for free.

### Method B: GitHub Pages
1. Create a new GitHub repository named `portfolio` (or `dhruv-sharma07.github.io`).
2. Push this folder's contents:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/dhruv-sharma07/portfolio.git
   git push -u origin main
   ```
3. Go to repository **Settings** → **Pages** → under **Branch**, select `main` / `root` and click **Save**.
4. Your website is live at `https://dhruv-sharma07.github.io/portfolio`!

### Method C: Vercel
1. Run `npx vercel` in the project folder, or import your GitHub repository at [vercel.com](https://vercel.com).
2. Click **Deploy**.

---

## 🔗 Adding the Link to Your GitHub Profile

To display your new portfolio on your GitHub profile like Ishita:

1. **In your GitHub Profile Bio**:
   - Go to your GitHub profile → Click **Edit profile**.
   - Under **Website**, enter your live URL (e.g., `https://dhruvsharma.netlify.app` or `https://dhruv-sharma07.github.io/portfolio`).

2. **In your Profile README (`README.md`)**:
   Add a portfolio badge and link near the top:
   ```markdown
   [![Portfolio](https://img.shields.io/badge/Portfolio-Live%20Site-f2a63c?style=for-the-badge&logo=google-chrome&logoColor=black)](https://dhruvsharma.netlify.app)
   [![Resume](https://img.shields.io/badge/Resume-Download%20PDF-6c8cff?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white)](https://dhruvsharma.netlify.app/assets/Resume_Dhruv_Sharma.pdf)
   ```
