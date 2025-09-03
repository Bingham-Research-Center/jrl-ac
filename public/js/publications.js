document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.publications-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const memberSlug = this.dataset.member;
            const content = document.getElementById(`publications-${memberSlug}`);
            const isExpanded = this.classList.contains('active');
            
            if (isExpanded) {
                // Collapse
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                content.classList.remove('expanded');
                this.querySelector('.toggle-subtitle').textContent = 'Click to expand publications';
            } else {
                // Expand
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                content.classList.add('expanded');
                this.querySelector('.toggle-subtitle').textContent = 'Click to collapse publications';
            }
        });
    });
    
    // Smooth scroll for anchor links
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
    
    // Handle keyboard navigation
    toggleButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});