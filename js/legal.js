// Legal pages functionality
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('disclaimer.html') || 
        currentPage.includes('privacy.html') || 
        currentPage.includes('cookie.html')) {
        initLegalPage();
    }
});

function initLegalPage() {
    initLegalAnimations();
    initTableOfContents();
    initReadingProgress();
    initPrintFunctionality();
    addLastUpdatedDate();
}

function initLegalAnimations() {
    // Animate legal content sections
    const contentSections = document.querySelectorAll('.legal-content h2, .legal-content h3, .legal-content p, .legal-content ul, .legal-content ol');
    
    const legalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                legalObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });
    
    contentSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        legalObserver.observe(section);
    });
    
    // Special animations for highlight boxes
    const highlightBoxes = document.querySelectorAll('.warning-box, .privacy-highlight, .cookie-intro, .important-note');
    highlightBoxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            box.style.transition = 'all 0.8s ease-out';
            box.style.opacity = '1';
            box.style.transform = 'scale(1)';
        }, index * 300 + 500);
    });
}

function initTableOfContents() {
    const headings = document.querySelectorAll('.legal-content h2');
    if (headings.length < 3) return; // Only create TOC if there are enough headings
    
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = '<h3>Table of Contents</h3>';
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        // Create ID for heading if it doesn't exist
        if (!heading.id) {
            heading.id = `section-${index + 1}`;
        }
        
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
        
        // Smooth scroll for TOC links
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(heading.id);
            if (target) {
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight the target section
                target.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
                setTimeout(() => {
                    target.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
    
    tocContainer.appendChild(tocList);
    
    // Insert TOC after the first paragraph
    const firstParagraph = document.querySelector('.legal-content p');
    if (firstParagraph) {
        firstParagraph.parentNode.insertBefore(tocContainer, firstParagraph.nextSibling);
    }
    
    // Style the TOC
    const tocStyle = document.createElement('style');
    tocStyle.textContent = `
        .table-of-contents {
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 2rem 0;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .table-of-contents h3 {
            margin-top: 0;
            margin-bottom: 1rem;
            color: var(--primary-color);
            font-size: 1.25rem;
        }
        
        .toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .toc-list li {
            margin-bottom: 0.5rem;
        }
        
        .toc-link {
            color: var(--secondary-color);
            text-decoration: none;
            padding: 0.5rem;
            display: block;
            border-radius: 4px;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
        }
        
        .toc-link:hover {
            background: rgba(255, 107, 53, 0.1);
            border-left-color: var(--primary-color);
            transform: translateX(5px);
        }
    `;
    document.head.appendChild(tocStyle);
}

function initReadingProgress() {
    // Create reading progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    
    // Style the progress bar
    const progressStyle = document.createElement('style');
    progressStyle.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            z-index: 9999;
            backdrop-filter: blur(10px);
        }
        
        .reading-progress-fill {
            height: 100%;
            background: var(--primary-gradient);
            width: 0%;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
        }
    `;
    document.head.appendChild(progressStyle);
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.reading-progress-fill');
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

function initPrintFunctionality() {
    // Add print button
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '🖨️ Print This Page';
    printButton.title = 'Print this legal document';
    
    // Style the print button
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        .print-button {
            position: fixed;
            bottom: 30px;
            left: 30px;
            background: var(--secondary-color);
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 78, 137, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }
        
        @media print {
            .print-button,
            .main-header,
            .main-footer,
            .reading-progress,
            .table-of-contents {
                display: none !important;
            }
            
            .legal-content {
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            body {
                padding-top: 0 !important;
            }
        }
        
        @media (max-width: 768px) {
            .print-button {
                bottom: 20px;
                left: 20px;
                padding: 0.5rem 0.75rem;
                font-size: 0.75rem;
            }
        }
    `;
    document.head.appendChild(printStyle);
    
    printButton.addEventListener('click', function() {
        // Prepare page for printing
        const originalTitle = document.title;
        document.title = `${originalTitle} - Rotate to Escape`;
        
        // Add print date
        const printDate = document.createElement('div');
        printDate.className = 'print-date';
        printDate.textContent = `Printed on: ${new Date().toLocaleDateString('en-AU')}`;
        printDate.style.cssText = `
            display: none;
            text-align: center;
            font-size: 0.875rem;
            color: #666;
            margin-bottom: 2rem;
        `;
        
        const printDateStyle = document.createElement('style');
        printDateStyle.textContent = `
            @media print {
                .print-date {
                    display: block !important;
                }
            }
        `;
        document.head.appendChild(printDateStyle);
        
        const legalContent = document.querySelector('.legal-content');
        if (legalContent) {
            legalContent.insertBefore(printDate, legalContent.firstChild);
        }
        
        // Print the page
        window.print();
        
        // Cleanup after printing
        setTimeout(() => {
            document.title = originalTitle;
            if (printDate.parentNode) {
                printDate.remove();
            }
            if (printDateStyle.parentNode) {
                printDateStyle.remove();
            }
        }, 1000);
    });
    
    document.body.appendChild(printButton);
}

function addLastUpdatedDate() {
    const lastUpdatedElements = document.querySelectorAll('.last-updated');
    const currentDate = new Date().toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    lastUpdatedElements.forEach(element => {
        if (element.textContent.includes('January 2024')) {
            element.textContent = `Last updated: ${currentDate}`;
        }
    });
}

// Add scroll-to-section functionality for long legal documents
function addSectionNavigation() {
    const headings = document.querySelectorAll('.legal-content h2');
    if (headings.length < 5) return; // Only add for long documents
    
    // Create floating navigation
    const floatingNav = document.createElement('div');
    floatingNav.className = 'floating-section-nav';
    floatingNav.innerHTML = `
        <button class="nav-prev" title="Previous Section">↑</button>
        <span class="nav-indicator">1/${headings.length}</span>
        <button class="nav-next" title="Next Section">↓</button>
    `;
    
    // Style the floating navigation
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .floating-section-nav {
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border-radius: 25px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .floating-section-nav.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .floating-section-nav button {
            background: var(--primary-color);
            color: white;
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .floating-section-nav button:hover {
            background: var(--secondary-color);
            transform: scale(1.1);
        }
        
        .floating-section-nav button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        
        .nav-indicator {
            font-size: 0.75rem;
            color: #666;
            font-weight: 600;
        }
        
        @media (max-width: 768px) {
            .floating-section-nav {
                display: none;
            }
        }
    `;
    document.head.appendChild(navStyle);
    
    document.body.appendChild(floatingNav);
    
    let currentSection = 0;
    const prevBtn = floatingNav.querySelector('.nav-prev');
    const nextBtn = floatingNav.querySelector('.nav-next');
    const indicator = floatingNav.querySelector('.nav-indicator');
    
    function updateNavigation() {
        prevBtn.disabled = currentSection === 0;
        nextBtn.disabled = currentSection === headings.length - 1;
        indicator.textContent = `${currentSection + 1}/${headings.length}`;
    }
    
    function scrollToSection(index) {
        if (index >= 0 && index < headings.length) {
            const target = headings[index];
            const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            currentSection = index;
            updateNavigation();
        }
    }
    
    prevBtn.addEventListener('click', () => scrollToSection(currentSection - 1));
    nextBtn.addEventListener('click', () => scrollToSection(currentSection + 1));
    
    // Show/hide navigation based on scroll position
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const legalContent = document.querySelector('.legal-content');
        
        if (legalContent) {
            const contentTop = legalContent.offsetTop;
            const contentBottom = contentTop + legalContent.offsetHeight;
            
            if (scrollTop > contentTop && scrollTop < contentBottom - window.innerHeight) {
                floatingNav.classList.add('visible');
            } else {
                floatingNav.classList.remove('visible');
            }
        }
        
        // Update current section based on scroll position
        headings.forEach((heading, index) => {
            const headingTop = heading.offsetTop - 100;
            if (scrollTop >= headingTop) {
                currentSection = index;
            }
        });
        updateNavigation();
    });
    
    updateNavigation();
}

// Initialize section navigation for long documents
setTimeout(addSectionNavigation, 2000);

// Add keyboard shortcuts for legal documents
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only activate shortcuts when not in form fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case 'p':
            case 'P':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    const printButton = document.querySelector('.print-button');
                    if (printButton) printButton.click();
                }
                break;
                
            case 'Home':
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
                
            case 'End':
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                break;
        }
    });
}

// Initialize keyboard shortcuts
addKeyboardShortcuts();