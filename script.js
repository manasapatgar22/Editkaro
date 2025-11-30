const videos = [
    { title: "Short Promo — Fast Edit", category: "Short-form", url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ", details: "Quick cuts & dynamic transitions." },
    { title: "Product Ad — Cinematic", category: "Ads", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U", details: "Cinematic ads with motion graphics." },
    { title: "Gaming Montage", category: "Gaming", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", details: "High-energy montage for clips." },
    { title: "Documentary Teaser", category: "Documentary", url: "https://www.youtube.com/watch?v=VYOjWnS4cMY", details: "Teaser edit for festival submission." },
    { title: "Color Grading Reel", category: "Color Grading", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4", details: "Before/after color grading examples." },
    { title: "Anime Edit — AMV", category: "Anime", url: "https://www.youtube.com/watch?v=oHg5SJYRHA0", details: "AMV with synced beats." },
];

const GSA_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwCEOiagGaOWA2PaTJU1NmrDLxMXcQzFjq_Rgdrs8fgIR-HzSjzUdhYAhlRSyhZVQnm/exec';

const videos = [
    { title: "Short Promo — Fast Edit", category: "Short-form", url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ", details: "Quick cuts & dynamic transitions." },
    { title: "Reel — Trend Edit", category: "Short-form", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U", details: "Social reel with trending audio." },

    { title: "Long-form — Product Story", category: "Long-form", url: "https://www.youtube.com/watch?v=VYOjWnS4cMY", details: "20-min product story & interviews." },

    { title: "Gaming Montage", category: "Gaming", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", details: "High-energy montage for clips." },

    { title: "Football Edit — Highlights", category: "Football Edits", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4", details: "Slow-mo & highlights package." },

    { title: "Product Ad — Cinematic", category: "eCommerce Ads", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U", details: "Cinematic ads with motion graphics." },

    { title: "Documentary Teaser", category: "Documentary Style", url: "https://www.youtube.com/watch?v=VYOjWnS4cMY", details: "Teaser edit for festival submission." },

    { title: "Color Grading Reel", category: "Color Grading", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4", details: "Before/after color grading examples." },

    { title: "Anime Edit — AMV", category: "Anime Videos", url: "https://www.youtube.com/watch?v=oHg5SJYRHA0", details: "AMV with synced beats." },

    { title: "Facebook/IG Ad — Quick", category: "Ads", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U", details: "Short ad optimized for social platforms." }
];

const grid = document.getElementById("grid");
const filtersContainer = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const emptyMsg = document.getElementById("emptyMsg");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const videoWrap = document.getElementById("videoWrap");
const closeModalBtn = document.getElementById("closeModal");
const openYT = document.getElementById("openYT");
const preloader = document.getElementById("preloader");
const themeToggle = document.getElementById("themeToggle");
const contactDrawer = document.getElementById("contactDrawer");
const openContact = document.getElementById("openContact");
const closeContact = document.getElementById("closeContact");
const contactForm = document.getElementById("contactForm");

let activeCategory = "All";

const hireBtn = document.getElementById("hireBtn");

const subscribeForm = document.getElementById('subscribeForm');
const subEmail = document.getElementById('subEmail');
const subMsg = document.getElementById('subMsg');

let activeCategory = "All";
function getYouTubeID(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
        if (u.searchParams.has("v")) return u.searchParams.get("v");
        return url.split("/").pop();
    } catch {
        const m = url.match(/[?&]v=([^&]+)/);
        return m ? m[1] : url;
    }
}

function thumb(url) {
    const id = getYouTubeID(url);
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function buildFilters() {
    const categories = ["All", ...new Set(videos.map(v => v.category))];
    filtersContainer.innerHTML = "";
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "filter-btn" + (cat === "All" ? " active" : "");
        btn.textContent = cat;
        btn.onclick = () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategory = cat;
            renderGrid();
            gsap.from('.card', { opacity: 0, y: 20, stagger: 0.06, duration: 0.5 });
            if (window.gsap) gsap.from('.card', { opacity: 0, y: 20, stagger: 0.06, duration: 0.5 });
        };
        filtersContainer.appendChild(btn);
    });
}

function renderGrid() {
    const q = searchInput.value.toLowerCase();
function renderGrid() {
    const q = (searchInput.value || "").toLowerCase();
    const filtered = videos.filter(v => {
        const matchesCategory = activeCategory === "All" || v.category === activeCategory;
        const matchesSearch = v.title.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    grid.innerHTML = "";
    if (filtered.length === 0) { emptyMsg.style.display = "block"; return; } else { emptyMsg.style.display = "none"; }

    filtered.forEach(v => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <div class="thumb">
        <img src="${thumb(v.url)}" alt="${v.title}">
        <div class="playbtn">▶</div>
        <img loading="lazy" src="${thumb(v.url)}" alt="${v.title}">
        <div class="playbtn" aria-hidden>▶</div>
      </div>
      <div class="meta">
        <div class="title">${v.title}</div>
        <div class="cat">${v.category}</div>
      </div>
    `;
        card.addEventListener("click", () => openModal(v));
        grid.appendChild(card);
    });
}

function openModal(v) {
    const id = getYouTubeID(v.url);
    modal.classList.add("open");
    modal.setAttribute('aria-hidden', 'false');
    modalTitle.textContent = v.title;
    videoWrap.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  `;
    document.getElementById('caseDetails').textContent = v.details || '';
    openYT.onclick = () => window.open(v.url, "_blank");
    gsap.from('.modal-content', { scale: 0.98, opacity: 0, duration: 0.25 });
    videoWrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    document.getElementById('caseDetails').textContent = v.details || '';
    openYT.onclick = () => window.open(v.url, "_blank");
    if (window.gsap) gsap.from('.modal-content', { scale: 0.98, opacity: 0, duration: 0.25 });
}

function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute('aria-hidden', 'true');
    videoWrap.innerHTML = "";
}

closeModalBtn.onclick = closeModal;
modal.onclick = (e) => { if (e.target === modal) closeModal(); };
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function setTheme(theme) {
    if (theme === 'light') {

function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.style.setProperty('--bg', '#f7f9fc');
        document.documentElement.style.setProperty('--card', '#ffffff');
        document.documentElement.style.setProperty('--muted', '#475569');
        document.documentElement.style.setProperty('--accent', '#ff7b96');
        document.documentElement.style.setProperty('--text', '#0f1724');  

        document.body.style.background = 'linear-gradient(180deg,#fff,#f1f5f9)';
        themeToggle.textContent = '🌙';
        localStorage.theme = 'light';

    } else {
        document.documentElement.style.setProperty('--text', '#0f1724');
        document.body.style.background = 'linear-gradient(180deg,#fff,#f1f5f9)';
        themeToggle.textContent = '🌙';
        localStorage.theme = 'light';
    } else {
        document.documentElement.style.setProperty('--bg', '#0f1724');
        document.documentElement.style.setProperty('--card', '#0b1220');
        document.documentElement.style.setProperty('--muted', '#98a0b3');
        document.documentElement.style.setProperty('--accent', '#ff5c7c');
        document.documentElement.style.setProperty('--text', '#e6eef8');  

        document.documentElement.style.setProperty('--text', '#e6eef8');
        document.body.style.background = 'linear-gradient(180deg,#071026,#071827)';
        themeToggle.textContent = '☀️';
        localStorage.theme = 'dark';
    }
}


themeToggle.onclick = () => { setTheme(localStorage.theme === 'dark' ? 'light' : 'dark'); };


openContact.onclick = () => { contactDrawer.classList.add('open'); contactDrawer.setAttribute('aria-hidden', 'false'); };
closeContact.onclick = () => { contactDrawer.classList.remove('open'); contactDrawer.setAttribute('aria-hidden', 'true'); };

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks! Message sent (demo).');
    contactForm.reset();
    closeContact.onclick();
});

searchInput.addEventListener('input', () => { renderGrid(); gsap.from('.card', { opacity: 0, y: 20, stagger: 0.04, duration: 0.45 }); });

function init() {
    buildFilters();
    renderGrid();
themeToggle.onclick = () => { setTheme(localStorage.theme === 'dark' ? 'light' : 'dark'); };

openContact.onclick = () => { contactDrawer.classList.add('open'); contactDrawer.setAttribute('aria-hidden', 'false'); };
closeContact.onclick = () => { contactDrawer.classList.remove('open'); contactDrawer.setAttribute('aria-hidden', 'true'); };
if (hireBtn) hireBtn.onclick = () => { contactDrawer.classList.add('open'); contactDrawer.setAttribute('aria-hidden', 'false'); };
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const payload = {
        mode: 'contact',
        name: data.get('name'),
        email: data.get('email'),
        type: data.get('type'),
        message: data.get('message'),
        ts: new Date().toISOString()
    };

    try {
        const res = await fetch(GSA_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
            alert('Thanks! We received your message.');
            contactForm.reset();
            closeContact.onclick();
        } else {
            alert('Submission failed — saved locally. Please email us at hello@editkaro.in');
            console.error('GSA error:', json);
        }
    } catch (err) {
        console.error(err);
        alert('Network error while sending message. Please try again or email hello@editkaro.in');
    }
});

if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const email = (subEmail.value || '').trim();
        if (!email) { subMsg.textContent = 'Enter a valid email.'; return; }
        subMsg.textContent = 'Submitting...';
        try {
            const res = await fetch(GSA_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'subscribe', email, ts: new Date().toISOString() })
            });
            const json = await res.json();
            if (json.success) {
                subMsg.textContent = 'Thanks — you are subscribed!';
                subscribeForm.reset();
            } else {
                subMsg.textContent = 'Could not save — try again later.';
            }
        } catch (err) {
            console.error(err);
            subMsg.textContent = 'Network error — try again later.';
        }
    });
}

searchInput.addEventListener('input', () => { renderGrid(); if (window.gsap) gsap.from('.card', { opacity: 0, y: 20, stagger: 0.04, duration: 0.45 }); });

function init() {
    buildFilters();
    renderGrid();
    document.querySelectorAll('.num').forEach(el => {
        const target = +el.dataset.target;
        let cur = 0;
        const step = Math.max(1, Math.floor(target / 80));
        const t = setInterval(() => {
            cur += step;
            if (cur >= target) { el.textContent = target.toLocaleString(); clearInterval(t); }
            else el.textContent = cur.toLocaleString();
        }, 18);
    });

    gsap.from('.card', { opacity: 0, y: 20, stagger: 0.06, duration: 0.6 });

    setTheme(localStorage.theme || 'dark');

    setTimeout(() => { preloader.style.display = 'none' }, 700);

    if (window.gsap) gsap.from('.card', { opacity: 0, y: 20, stagger: 0.06, duration: 0.6 });
    setTheme(localStorage.theme || 'dark');
    setTimeout(() => { if (preloader) preloader.style.display = 'none' }, 700);
    document.getElementById('year').textContent = new Date().getFullYear();
}

window.addEventListener('load', init);

