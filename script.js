// ===== Mobile Menu =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        if (menuIcon) {
            menuIcon.setAttribute('icon', isOpen ? 'lucide:x' : 'lucide:menu');
        }
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            if (menuIcon) menuIcon.setAttribute('icon', 'lucide:menu');
        });
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
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger based on animation-delay if set
            const delay = entry.target.style.animationDelay;
            if (delay) {
                const ms = parseFloat(delay) * 1000;
                setTimeout(() => entry.target.classList.add('revealed'), ms);
            } else {
                entry.target.classList.add('revealed');
            }
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== Skill Bars — Accurate Percentage Animation =====
const skillItems = document.querySelectorAll('.skill-item');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const item = entry.target;
            const bar = item.querySelector('.skill-bar');
            const percentEl = item.querySelector('.skill-percent');
            const targetWidth = parseInt(bar.getAttribute('data-width'));

            if (bar && !bar.classList.contains('animated')) {
                // Animate the bar
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                    bar.classList.add('animated');
                }, 100);

                // Animate the number counter
                if (percentEl) {
                    animateCounter(percentEl, 0, targetWidth, 1200);
                    percentEl.classList.add('active');
                }

                skillObserver.unobserve(item);
            }
        }
    });
}, { threshold: 0.3 });

skillItems.forEach(item => skillObserver.observe(item));

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);

        element.textContent = current + '%';

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===== Stat Counter Animation =====
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
        const current = Math.round(start + (end - start) * eased);

        element.textContent = current + (end === 100 ? '%' : '+');

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ===== Project Filtering & Search =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectSearch = document.getElementById('projectSearch');
const noResults = document.getElementById('noResults');

function filterProjects() {
    const activeFilter = document.querySelector('.filter-btn.active');
    const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
    const searchTerm = projectSearch ? projectSearch.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    projectCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const name = card.getAttribute('data-name').toLowerCase();
        const matchesFilter = filter === 'all' || category === filter;
        const matchesSearch = !searchTerm || name.includes(searchTerm);

        if (matchesFilter && matchesSearch) {
            card.style.display = '';
            card.classList.remove('hidden-card');
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 60);
            visibleCount++;
        } else {
            card.classList.add('hidden-card');
            card.style.display = 'none';
        }
    });

    if (noResults) noResults.classList.toggle('hidden', visibleCount > 0);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProjects();
    });
});

if (projectSearch) projectSearch.addEventListener('input', filterProjects);

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Button loading state
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<iconify-icon icon="lucide:loader-2" width="16" class="animate-spin"></iconify-icon> Sending...';
        btn.disabled = true;

        // Simulate sending
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;

            if (formMessage) {
                formMessage.classList.remove('hidden');
                formMessage.style.background = 'rgba(79, 140, 255, 0.08)';
                formMessage.style.border = '1px solid rgba(79, 140, 255, 0.2)';
                formMessage.style.color = '#6BA3FF';
                formMessage.textContent = '✓ Message sent successfully!';
            }

            showToast('Message sent! I\'ll reply soon.');
            contactForm.reset();

            setTimeout(() => {
                if (formMessage) formMessage.classList.add('hidden');
            }, 4000);
        }, 1200);
    });
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
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 3000);
}

// ===== Smooth nav active state on scroll (optional enhancement) =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Just for visual feedback, no prevent needed for page nav
    });
});