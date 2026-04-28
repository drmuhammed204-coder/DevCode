// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    const hamburgerSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    const closeSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        mobileMenuBtn.innerHTML = isOpen ? closeSVG : hamburgerSVG;
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            mobileMenuBtn.innerHTML = hamburgerSVG;
            document.body.style.overflow = '';
        });
    });

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('open');
            mobileMenuBtn.innerHTML = hamburgerSVG;
            document.body.style.overflow = '';
        }
    });
}

// ===== Scroll To Top =====
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Intersection Observer — Reveal Animations =====
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const delay = entry.target.style.animationDelay;
            if (delay) {
                setTimeout(() => entry.target.classList.add('revealed'), parseFloat(delay) * 1000);
            } else {
                entry.target.classList.add('revealed');
            }
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ===== Skill Bars =====
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const item = entry.target;
            const bar = item.querySelector('.skill-bar');
            const percentEl = item.querySelector('.skill-percent');
            const targetWidth = parseInt(bar.getAttribute('data-width'));
            if (bar && !bar.classList.contains('animated')) {
                setTimeout(() => { bar.style.width = targetWidth + '%'; bar.classList.add('animated'); }, 100);
                if (percentEl) { animateCounter(percentEl, 0, targetWidth, 1200); percentEl.classList.add('active'); }
                skillObserver.unobserve(item);
            }
        }
    });
}, { threshold: 0.25 });
skillItems.forEach(item => skillObserver.observe(item));

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(start + (end - start) * eased) + '%';
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== Stat Counter =====
const statCards = document.querySelectorAll('.stat-card [data-count]');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            animateStatCounter(el, 0, target, 1500);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
statCards.forEach(el => statObserver.observe(el));

function animateStatCounter(element, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(start + (end - start) * eased) + (end === 100 ? '%' : '+');
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ===== Toast =====
function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 3000);
}


// ╔═══════════════════════════════════════════════════════╗
// ║           FIREBASE — CONTACT FORM                    ║
// ╚═══════════════════════════════════════════════════════╝
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && typeof db !== 'undefined') {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('contactBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...';

        const data = {
            name: document.getElementById('cName').value.trim(),
            email: document.getElementById('cEmail').value.trim(),
            subject: document.getElementById('cSubject').value.trim(),
            message: document.getElementById('cMessage').value.trim(),
            read: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('messages').add(data)
            .then(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                formMessage.classList.remove('hidden');
                formMessage.style.background = 'rgba(34,197,94,0.08)';
                formMessage.style.border = '1px solid rgba(34,197,94,0.2)';
                formMessage.style.color = '#4ADE80';
                formMessage.textContent = '✓ Message sent successfully!';
                showToast('Message sent! I\'ll reply soon.');
                contactForm.reset();
                setTimeout(() => formMessage.classList.add('hidden'), 5000);
            })
            .catch((err) => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                formMessage.classList.remove('hidden');
                formMessage.style.background = 'rgba(239,68,68,0.08)';
                formMessage.style.border = '1px solid rgba(239,68,68,0.2)';
                formMessage.style.color = '#F87171';
                formMessage.textContent = '✗ Failed to send. Try again or email directly.';
                setTimeout(() => formMessage.classList.add('hidden'), 5000);
            });
    });
}


// ╔═══════════════════════════════════════════════════════╗
// ║           FIREBASE — PROJECTS LOADER                  ║
// ╚═══════════════════════════════════════════════════════╝
const projectsGrid = document.getElementById('projectsGrid');
const projectSearch = document.getElementById('projectSearch');
const noResults = document.getElementById('noResults');
let firebaseProjects = [];

if (projectsGrid && typeof db !== 'undefined') {
    db.collection('projects')
        .where('visible', '==', true)
        .orderBy('order', 'asc')
        .onSnapshot((snap) => {
            firebaseProjects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            renderFirebaseProjects();
        }, (err) => {
            // If Firestore rules block reads, show fallback
            projectsGrid.innerHTML = '<p class="text-gray-600 text-sm font-mono text-center py-20 col-span-2">Unable to load projects.</p>';
        });
}

function renderFirebaseProjects() {
    if (!projectsGrid) return;

    const activeFilter = document.querySelector('.filter-btn.active');
    const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    const searchTerm = projectSearch ? projectSearch.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    let filtered = firebaseProjects;
    if (filter !== 'all') filtered = filtered.filter(p => p.category === filter);
    if (searchTerm) filtered = filtered.filter(p => (p.title || '').toLowerCase().includes(searchTerm));

    if (filtered.length === 0) {
        projectsGrid.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
        return;
    }
    if (noResults) noResults.classList.add('hidden');

    projectsGrid.innerHTML = filtered.map((p, i) => {
        const isMobile = p.category === 'mobile';
        const badgeColor = isMobile
            ? 'bg-purple-500/15 text-purple-400 border-purple-500/20'
            : 'bg-[#4F8CFF]/15 text-[#4F8CFF] border-[#4F8CFF]/20';
        const badgeText = isMobile ? 'Mobile' : 'Web App';
        const tags = (p.tags || []).map(t => `<span class="text-[10px] font-mono bg-white/5 rounded px-2 py-0.5 text-gray-500">${t}</span>`).join('');
        const liveLink = p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="inline-flex items-center gap-1 text-xs font-medium text-[#4F8CFF]/70 hover:text-[#4F8CFF] transition-colors">Live <iconify-icon icon="lucide:external-link" width="12"></iconify-icon></a>` : '';
        const githubLink = p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-white transition-colors">Code <iconify-icon icon="lucide:github" width="12"></iconify-icon></a>` : '';

        return `
        <div class="project-card group rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-500"
             data-category="${p.category}" data-name="${p.title}" data-live="${p.liveUrl || ''}"
             style="opacity:0;transform:translateY(15px);transition:opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s">
            <div class="aspect-[16/9] overflow-hidden relative">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onerror="this.src='https://picsum.photos/seed/${p.id}/1200/675.jpg'">
                <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80"></div>
                <div class="absolute top-3 left-3">
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider ${badgeColor} border rounded-md px-2.5 py-1">${badgeText}</span>
                </div>
                ${p.featured ? '<div class="absolute top-3 right-3"><span class="text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-md px-2 py-0.5">★ Featured</span></div>' : ''}
            </div>
            <div class="p-5">
                <h3 class="font-display font-semibold text-base mb-1.5 group-hover:text-[#4F8CFF] transition-colors duration-300">${p.title}</h3>
                <p class="text-xs text-gray-600 leading-relaxed mb-4">${p.description}</p>
                <div class="flex items-center gap-1.5 flex-wrap mb-4">${tags}</div>
                <div class="flex items-center gap-4">${liveLink}${githubLink}</div>
            </div>
        </div>`;
    }).join('');

    // Trigger animations
    requestAnimationFrame(() => {
        projectsGrid.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });
}

// Filter & Search for Firebase projects
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFirebaseProjects();
    });
});
if (projectSearch) projectSearch.addEventListener('input', renderFirebaseProjects);

// Make Firebase project cards clickable
document.addEventListener('click', (e) => {
    const card = e.target.closest('.project-card[data-live]');
    if (card && !e.target.closest('a')) {
        const url = card.getAttribute('data-live');
        if (url) window.open(url, '_blank');
    }
});