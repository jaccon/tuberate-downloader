// Tuberate Downloader - Interactions & OS Detection

document.addEventListener('DOMContentLoaded', () => {
    
    // OS Detection for the primary download button
    function detectOS() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        
        if (userAgent.indexOf('mac') !== -1) return 'Mac';
        if (userAgent.indexOf('win') !== -1) return 'Windows';
        if (userAgent.indexOf('linux') !== -1) return 'Linux';
        
        return 'Unknown';
    }

    const currentOS = detectOS();
    const btnText = document.getElementById('os-download-text');
    
    if (btnText) {
        if (currentOS === 'Unknown') {
            btnText.textContent = 'Download Now';
        } else {
            btnText.textContent = `Download for ${currentOS}`;
        }
    }

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Apply animation to download options
    const downloadBtns = document.querySelectorAll('.platform-btn');
    downloadBtns.forEach((btn, index) => {
        btn.style.opacity = 0;
        btn.style.transform = 'translateY(20px)';
        btn.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, background-color 0.3s, border-color 0.3s`;
        observer.observe(btn);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
