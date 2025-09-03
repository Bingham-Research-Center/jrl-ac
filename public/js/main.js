document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initPostExpanders();
    initSmoothScroll();
    initThemeToggle();
});

function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            menuToggle.classList.toggle('active');
            
            if (mainNav.classList.contains('mobile-active')) {
                mainNav.style.display = 'flex';
                mainNav.style.position = 'absolute';
                mainNav.style.top = '100%';
                mainNav.style.left = '0';
                mainNav.style.right = '0';
                mainNav.style.background = 'rgba(255, 255, 255, 0.98)';
                mainNav.style.flexDirection = 'column';
                mainNav.style.padding = '1rem';
                mainNav.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                mainNav.style.borderTop = '1px solid #f0f0f0';
            } else {
                setTimeout(() => {
                    mainNav.style.display = '';
                    mainNav.style.position = '';
                    mainNav.style.top = '';
                    mainNav.style.left = '';
                    mainNav.style.right = '';
                    mainNav.style.background = '';
                    mainNav.style.flexDirection = '';
                    mainNav.style.padding = '';
                    mainNav.style.boxShadow = '';
                    mainNav.style.borderTop = '';
                }, 300);
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                mainNav.classList.remove('mobile-active');
                menuToggle.classList.remove('active');
                mainNav.style.display = '';
                mainNav.style.position = '';
                mainNav.style.top = '';
                mainNav.style.left = '';
                mainNav.style.right = '';
                mainNav.style.background = '';
                mainNav.style.flexDirection = '';
                mainNav.style.padding = '';
                mainNav.style.boxShadow = '';
                mainNav.style.borderTop = '';
            }
        });
    }
}

function initPostExpanders() {
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const postId = button.dataset.postId;
            const postContent = document.getElementById(`post-${postId}`);
            const postCard = button.closest('.post-card');
            
            if (postContent) {
                postContent.classList.toggle('hidden');
                postCard.classList.toggle('collapsed');
                postCard.classList.toggle('expanded');
                
                const icon = button.querySelector('.expand-icon');
                if (icon) {
                    icon.textContent = postContent.classList.contains('hidden') ? '+' : '−';
                }
                
                if (!postContent.classList.contains('hidden')) {
                    const allOtherContents = document.querySelectorAll('.post-content:not(#post-' + postId + ')');
                    const allOtherCards = document.querySelectorAll('.post-card:not(:nth-child(' + (parseInt(postId) + 1) + '))');
                    const allOtherButtons = document.querySelectorAll('.expand-btn:not([data-post-id="' + postId + '"])');
                    
                    allOtherContents.forEach(content => {
                        if (!content.classList.contains('hidden')) {
                            content.classList.add('hidden');
                        }
                    });
                    
                    allOtherCards.forEach(card => {
                        if (card.classList.contains('expanded')) {
                            card.classList.remove('expanded');
                            card.classList.add('collapsed');
                        }
                    });
                    
                    allOtherButtons.forEach(btn => {
                        const btnIcon = btn.querySelector('.expand-icon');
                        if (btnIcon) {
                            btnIcon.textContent = '+';
                        }
                    });
                }
            }
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    const themeText = themeToggle?.querySelector('.theme-text');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeIcon) {
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    if (themeText) {
        themeText.textContent = savedTheme === 'dark' ? 'Light mode' : 'Dark mode';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (themeIcon) {
                themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            }
            if (themeText) {
                themeText.textContent = newTheme === 'dark' ? 'Light mode' : 'Dark mode';
            }
        });
    }
}

const style = document.createElement('style');
style.textContent = `
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
    
    .main-nav.mobile-active {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);