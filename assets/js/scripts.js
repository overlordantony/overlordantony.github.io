// ==============================
// CUSTOM CURSOR
// ==============================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});

(function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
})();

function setCursorHover(on) {
    cursor.style.transform = on ? 'translate(-50%,-50%) scale(2)' : 'translate(-50%,-50%) scale(1)';
    ring.style.width  = on ? '50px' : '32px';
    ring.style.height = on ? '50px' : '32px';
    ring.style.opacity = on ? '0.3' : '0.5';
}

document.querySelectorAll('a, button, .project-card, .service-card, .stack-item').forEach(el => {
    el.addEventListener('mouseenter', () => setCursorHover(true));
    el.addEventListener('mouseleave', () => setCursorHover(false));
});

// ==============================
// NAV SCROLL
// ==============================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ==============================
// REVEAL ON SCROLL
// ==============================
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
reveals.forEach(r => io.observe(r));

// ==============================
// PROJECT FILTERS
// ==============================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide cards
        projectCards.forEach(card => {
            const cat = card.dataset.category;
            const show = filter === 'all' || cat === filter;
            card.classList.toggle('hidden', !show);
        });
    });
});

// ==============================
// PROJECT MODAL
// ==============================
const modal        = document.getElementById('projectModal');
const modalClose   = document.getElementById('modalClose');
const modalTitle   = document.getElementById('modalTitle');
const modalDesc    = document.getElementById('modalDesc');
const modalTag     = document.getElementById('modalTag');
const modalTech    = document.getElementById('modalTech');
const modalLink    = document.getElementById('modalLink');
const modalPdf     = document.getElementById('modalPdf');
const pdfPlaceholder = document.getElementById('pdfPlaceholder');

function openModal(card) {
    const title   = card.dataset.title;
    const desc    = card.dataset.desc;
    const url     = card.dataset.url;
    const tech    = card.dataset.tech.split(',');
    const pdf     = card.dataset.pdf;
    const tag     = card.dataset.category;

    modalTitle.textContent = title;
    modalDesc.textContent  = desc;
    modalTag.textContent   = tag.charAt(0).toUpperCase() + tag.slice(1);
    modalLink.href = url;

    // Tech tags
    modalTech.innerHTML = tech
        .map(t => `<span class="tech-tag">${t.trim()}</span>`)
        .join('');

    // PDF
    if (pdf) {
        modalPdf.src = pdf;
        modalPdf.style.display = 'block';
        pdfPlaceholder.classList.add('hidden');
    } else {
        modalPdf.src = '';
        modalPdf.style.display = 'none';
        pdfPlaceholder.classList.remove('hidden');
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modalPdf.src = ''; }, 300);
}

// Open on card click
projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

// Close on button or overlay click
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});

// Close on Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});
