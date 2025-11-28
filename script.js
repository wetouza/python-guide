// ===== Lenis Smooth Scroll =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===== Course Tabs =====
const courseTabs = document.querySelectorAll('.course-tab');
const courseGrids = document.querySelectorAll('.courses-grid');

courseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update tab states
        courseTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update grid visibility with smooth animation
        courseGrids.forEach(grid => {
            if (grid.id === targetTab) {
                grid.classList.add('active');
                
                // Animate cards with stagger effect
                const cards = grid.querySelectorAll('.course-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) translateZ(0)';
                    
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) translateZ(0)';
                        }, index * 60);
                    });
                });
            } else {
                grid.classList.remove('active');
            }
        });
    });
});

// ===== Smooth Scroll for Navigation Links (using Lenis) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            lenis.scrollTo(target, {
                offset: -navHeight - 20,
                duration: 1.2,
            });
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.querySelector('.mobile-menu-btn').classList.remove('active');
            }
        }
    });
});

// ===== Navbar Background on Scroll (throttled for performance) =====
const navbar = document.querySelector('.navbar');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.style.background = 'rgba(10, 10, 15, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(10, 10, 15, 0.8)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

// ===== Intersection Observer for Animations (optimized) =====
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(() => {
                entry.target.classList.add('animate-in');
            });
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(`
    .why-card, 
    .roadmap-item, 
    .course-card, 
    .practice-card, 
    .resource-category,
    .book-card,
    .cheat-card,
    .faq-item,
    .project-idea,
    .extension-card,
    .vscode-category,
    .setup-step,
    .english-why,
    .english-resources,
    .eng-resource-card,
    .tip-card,
    .phrase,
    .trick-card,
    .oneliner,
    .yt-card,
    .yt-category
`);

animateElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) translateZ(0)';
    el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)`;
    el.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;
    animationObserver.observe(el);
});

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        
        let mobileMenu = document.querySelector('.mobile-menu');
        
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    ${navLinks ? navLinks.innerHTML : ''}
                    <div class="mobile-menu-actions">
                        ${navActions ? navActions.innerHTML : ''}
                    </div>
                </div>
            `;
            
            const mobileStyle = document.createElement('style');
            mobileStyle.textContent = `
                .mobile-menu {
                    position: fixed;
                    top: 73px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(10, 10, 15, 0.98);
                    backdrop-filter: blur(20px);
                    z-index: 99;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s;
                }
                
                .mobile-menu.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .mobile-menu-content {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .mobile-menu-content li {
                    list-style: none;
                    opacity: 0;
                    transform: translateX(-20px);
                    animation: slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                
                .mobile-menu-content li:nth-child(1) { animation-delay: 0.1s; }
                .mobile-menu-content li:nth-child(2) { animation-delay: 0.15s; }
                .mobile-menu-content li:nth-child(3) { animation-delay: 0.2s; }
                .mobile-menu-content li:nth-child(4) { animation-delay: 0.25s; }
                .mobile-menu-content li:nth-child(5) { animation-delay: 0.3s; }
                .mobile-menu-content li:nth-child(6) { animation-delay: 0.35s; }
                
                @keyframes slideInLeft {
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .mobile-menu-content a {
                    display: block;
                    padding: 1rem;
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    font-size: 1.1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    transition: color 0.2s, padding-left 0.2s;
                }
                
                .mobile-menu-content a:hover {
                    color: #fff;
                    padding-left: 1.5rem;
                }
                
                .mobile-menu-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }
                
                .mobile-menu-btn.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .mobile-menu-btn.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-btn.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }
            `;
            document.head.appendChild(mobileStyle);
            document.body.appendChild(mobileMenu);
        }
        
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        
        // Stop Lenis when menu is open
        if (mobileMenu.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });
}

// ===== Parallax effect for hero glow (GPU optimized) =====
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

const heroGlow = document.querySelector('.hero-glow');

function animateGlow() {
    if (heroGlow && window.innerWidth > 768) {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;
        
        heroGlow.style.transform = `translate(calc(-50% + ${currentX}px), ${currentY}px) translateZ(0)`;
    }
    requestAnimationFrame(animateGlow);
}

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 50;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 50;
});

requestAnimationFrame(animateGlow);

// ===== Roadmap marker animations =====
const roadmapMarkers = document.querySelectorAll('.roadmap-marker');
roadmapMarkers.forEach((marker, index) => {
    marker.style.animation = `pulseRing 2s ease-in-out infinite`;
    marker.style.animationDelay = `${index * 0.3}s`;
});

const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulseRing {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
        }
        50% {
            box-shadow: 0 0 0 12px rgba(59, 130, 246, 0);
        }
    }
`;
document.head.appendChild(pulseStyle);

// ===== Topic hover effects (using CSS transforms for performance) =====
document.querySelectorAll('.topic').forEach(topic => {
    topic.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, color 0.2s';
    
    topic.addEventListener('mouseenter', () => {
        topic.style.transform = 'scale(1.05) translateZ(0)';
        topic.style.borderColor = 'var(--accent-primary)';
        topic.style.color = 'var(--text-primary)';
    });
    
    topic.addEventListener('mouseleave', () => {
        topic.style.transform = 'scale(1) translateZ(0)';
        topic.style.borderColor = 'var(--border-color)';
        topic.style.color = 'var(--text-secondary)';
    });
});

// ===== Stats counter animation (optimized) =====
const statValues = document.querySelectorAll('.stat-value');
let statsAnimated = false;

const animateStats = () => {
    if (statsAnimated) return;
    statsAnimated = true;
    
    statValues.forEach(stat => {
        const text = stat.textContent;
        const number = parseInt(text);
        if (!isNaN(number)) {
            let current = 0;
            const duration = 1500;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                current = Math.floor(number * easeOut);
                
                stat.textContent = current + (text.includes('+') ? '+' : '') + (text.includes('%') ? '%' : '');
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    stat.textContent = text;
                }
            };
            
            requestAnimationFrame(animate);
        }
    });
};

// Trigger stats animation when hero is in view
const heroSection = document.querySelector('.hero');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (heroSection) {
    statsObserver.observe(heroSection);
}

// ===== External link security =====
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});

// ===== Copy code functionality =====
document.querySelectorAll('.code-preview, .code-block-mini').forEach(block => {
    block.style.cursor = 'pointer';
    block.title = 'Двойной клик для копирования';
    
    block.addEventListener('dblclick', async () => {
        const code = block.querySelector('code');
        if (code) {
            try {
                await navigator.clipboard.writeText(code.textContent);
                showToast('📋 Код скопирован!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    });
});

// ===== Toast notification =====
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        border-radius: 0.75rem;
        font-weight: 500;
        font-family: var(--font-primary);
        z-index: 1000;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
    `;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ===== Keyboard navigation =====
document.addEventListener('keydown', (e) => {
    // ESC closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.querySelector('.mobile-menu-btn').classList.remove('active');
            lenis.start();
        }
    }
});

// ===== Page visibility optimization =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

// ===== Cursor Glow Effect =====
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

let glowX = 0, glowY = 0;

function updateCursorGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(updateCursorGlow);
}
updateCursorGlow();

// ===== Card hover effects - simplified =====
// Tilt effect removed for better UX

// ===== Magnetic buttons - DISABLED =====
// Removed magnetic effect as it was causing issues

// ===== Staggered animation for cards on scroll =====
const staggerCards = document.querySelectorAll('.tricks-grid .trick-card, .yt-cards .yt-card, .phrases-grid .phrase');

const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const cards = entry.target.parentElement.children;
            Array.from(cards).forEach((card, i) => {
                card.style.transitionDelay = `${i * 0.1}s`;
                card.classList.add('animate-in');
            });
        }
    });
}, { threshold: 0.1 });

staggerCards.forEach(card => staggerObserver.observe(card));

// ===== Console greeting =====
console.log(
    '%c🐍 Python Master\n%cПолный гайд по изучению Python\n%c✨ Удачи в обучении!',
    'font-size: 28px; font-weight: bold; color: #3b82f6; text-shadow: 2px 2px 0 #8b5cf6;',
    'font-size: 14px; color: #8b5cf6; margin-top: 8px;',
    'font-size: 12px; color: #22c55e; margin-top: 4px;'
);
