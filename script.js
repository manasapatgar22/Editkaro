const videos = [
    { title: "Short Promo — Fast Edit", category: "Short-form", url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ", details: "Quick cuts & dynamic transitions." },
    { title: "Product Ad — Cinematic", category: "Ads", url: "https://www.youtube.com/watch?v=ysz5S6PUM-U", details: "Cinematic ads with motion graphics." },
    { title: "Gaming Montage", category: "Gaming", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", details: "High-energy montage for clips." },
    { title: "Documentary Teaser", category: "Documentary", url: "https://www.youtube.com/watch?v=VYOjWnS4cMY", details: "Teaser edit for festival submission." },
    { title: "Color Grading Reel", category: "Color Grading", url: "https://www.youtube.com/watch?v=ScMzIvxBSi4", details: "Before/after color grading examples." },
    { title: "Anime Edit — AMV", category: "Anime", url: "https://www.youtube.com/watch?v=oHg5SJYRHA0", details: "AMV with synced beats." },
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
        };
        filtersContainer.appendChild(btn);
    });
}


function renderGrid() {
    const q = searchInput.value.toLowerCase();
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
        document.documentElement.style.setProperty('--bg', '#f7f9fc');
        document.documentElement.style.setProperty('--card', '#ffffff');
        document.documentElement.style.setProperty('--muted', '#6b7280');
        document.documentElement.style.setProperty('--accent', '#ff7b96');
        document.body.style.background = 'linear-gradient(180deg,#fff,#f1f5f9)';
        themeToggle.textContent = '🌙';
        localStorage.theme = 'light';
    } else {
        document.documentElement.style.setProperty('--bg', '#0f1724');
        document.documentElement.style.setProperty('--card', '#0b1220');
        document.documentElement.style.setProperty('--muted', '#98a0b3');
        document.documentElement.style.setProperty('--accent', '#ff5c7c');
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

    document.getElementById('year').textContent = new Date().getFullYear();
}

window.addEventListener('load', init);
