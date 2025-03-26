import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const ctaButtons = document.querySelector('.cta-buttons');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            ctaButtons.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .benefit-card, .pricing-card, .pain-point-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    };
    
    animateOnScroll();

    // Showcase tabs functionality with enhanced scroll into view
    const showcaseTabs = document.querySelectorAll('.showcase-tab');
    const showcasePanels = document.querySelectorAll('.showcase-panel');

    // Load showcase data and initialize showcase
    const initShowcase = async () => {
        try {
            const response = await fetch('js/showcase-data.json');
            if (!response.ok) {
                throw new Error('Failed to load showcase data');
            }
            const showcaseData = await response.json();
            renderShowcase(showcaseData);
            setupShowcaseInteractions();
        } catch (error) {
            console.error('Error initializing showcase:', error);
        }
    };

    // Render showcase content from JSON data
    const renderShowcase = (data) => {
        const showcaseContent = document.querySelector('.showcase-content');
        if (!showcaseContent) return;

        showcaseContent.innerHTML = '';

        // For each type of showcase (simple, medium, complex)
        Object.keys(data).forEach((type, index) => {
            const typeData = data[type];
            const isActive = index === 0;
            
            // Create panel for this type
            const panel = document.createElement('div');
            panel.id = `${type}-panel`;
            panel.className = `showcase-panel ${isActive ? 'active' : ''}`;
            
            // Render examples for this showcase type
            typeData.examples.forEach((example, exampleIndex) => {
                const exampleElement = document.createElement('div');
                exampleElement.className = `example-page ${exampleIndex === 0 ? 'active' : ''}`;
                exampleElement.dataset.category = example.category;
                exampleElement.dataset.model = example.model;
                
                // Create showcase example content
                const showcaseExample = document.createElement('div');
                showcaseExample.className = 'showcase-example';
                
                // Input panel
                const inputPanel = document.createElement('div');
                inputPanel.className = 'input-panel';
                inputPanel.innerHTML = `<h3 data-i18n="showcase.inputLabel">Input</h3>`;
                
                if (example.input.type === 'iframe') {
                    const iframe = document.createElement('iframe');
                    iframe.src = example.input.content;
                    iframe.width = '100%';
                    iframe.height = example.input.height;
                    iframe.frameBorder = '0';
                    iframe.className = 'input-iframe';
                    inputPanel.appendChild(iframe);
                } else {
                    const inputText = document.createElement('div');
                    inputText.className = 'input-text';
                    inputText.textContent = example.input.content;
                    inputPanel.appendChild(inputText);
                }
                
                // Output panel
                const outputPanel = document.createElement('div');
                outputPanel.className = 'output-panel';
                outputPanel.innerHTML = `<h3 data-i18n="showcase.outputLabel">Output</h3>`;
                
                const outputPreview = document.createElement('div');
                outputPreview.className = 'output-preview';
                
                const outputIframe = document.createElement('iframe');
                outputIframe.src = example.output.content;
                outputIframe.width = '100%';
                outputIframe.height = example.output.height;
                outputIframe.frameBorder = '0';
                outputPreview.appendChild(outputIframe);
                outputPanel.appendChild(outputPreview);
                
                // Add input and output panels to example
                showcaseExample.appendChild(inputPanel);
                showcaseExample.appendChild(outputPanel);
                exampleElement.appendChild(showcaseExample);
                panel.appendChild(exampleElement);
            });
            
            // Create pagination
            const pagerContainer = document.createElement('div');
            pagerContainer.className = 'showcase-pager';
            panel.appendChild(pagerContainer);
            
            showcaseContent.appendChild(panel);
        });
        
        // Update the tabs to match data
        const tabContainer = document.querySelector('.showcase-tabs');
        if (tabContainer) {
            tabContainer.innerHTML = '';
            Object.keys(data).forEach((type, index) => {
                const tab = document.createElement('button');
                tab.className = `showcase-tab ${index === 0 ? 'active' : ''}`;
                tab.setAttribute('data-tab', type);
                tab.setAttribute('data-i18n', `showcase.${type}Tab`);
                tab.textContent = data[type].title;
                tabContainer.appendChild(tab);
            });
        }
    };

    // Set up showcase interactions after rendering
    const setupShowcaseInteractions = () => {
        const tabs = document.querySelectorAll('.showcase-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.showcase-panel').forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding panel
                const panelId = `${tab.getAttribute('data-tab')}-panel`;
                const panel = document.getElementById(panelId);
                if (panel) {
                    panel.classList.add('active');
                    // Scroll the panel into view with smooth behavior
                    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });
        
        // Initialize pagination
        initShowcasePagination();
        
        // Initialize filters
        initShowcaseFilters();
    };

    // Initialize the showcase when the page loads
    if (document.querySelector('.showcase')) {
        initShowcase();
    } else {
        // Original showcase tab functionality for backwards compatibility
        showcaseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                showcaseTabs.forEach(t => t.classList.remove('active'));
                showcasePanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding panel
                const panelId = `${tab.getAttribute('data-tab')}-panel`;
                const panel = document.getElementById(panelId);
                panel.classList.add('active');
                
                // Scroll the panel into view with smooth behavior
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Load iframes if not already loaded
                const iframes = panel.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    if (iframe.getAttribute('data-src') && !iframe.src) {
                        iframe.src = iframe.getAttribute('data-src');
                    }
                });
            });
        });
    }

    // Showcase pagination functionality
    const initShowcasePagination = () => {
        const showcasePanels = document.querySelectorAll('.showcase-panel');
        
        showcasePanels.forEach(panel => {
            const pages = panel.querySelectorAll('.example-page');
            const pagerContainer = panel.querySelector('.showcase-pager');
            
            if (pages.length <= 1 || !pagerContainer) return;
            
            // Create pagination buttons
            pages.forEach((_, index) => {
                const pageButton = document.createElement('button');
                pageButton.classList.add('pager-button');
                pageButton.textContent = index + 1;
                if (index === 0) pageButton.classList.add('active');
                
                pageButton.addEventListener('click', () => {
                    // Hide all pages and deactivate all buttons
                    pages.forEach(p => p.classList.remove('active'));
                    pagerContainer.querySelectorAll('.pager-button').forEach(b => b.classList.remove('active'));
                    
                    // Show selected page and activate button
                    pages[index].classList.add('active');
                    pageButton.classList.add('active');
                });
                
                pagerContainer.appendChild(pageButton);
            });
        });
    };
    
    // Update showcase pagination after filtering
    const updateShowcasePagination = () => {
        const showcasePanels = document.querySelectorAll('.showcase-panel');
        
        showcasePanels.forEach(panel => {
            const pagerContainer = panel.querySelector('.showcase-pager');
            if (!pagerContainer) return;
            
            // Clear existing pagination
            pagerContainer.innerHTML = '';
            
            // Get visible pages
            const visiblePages = Array.from(panel.querySelectorAll('.example-page'))
                .filter(page => page.style.display !== 'none');
            
            if (visiblePages.length <= 1) return;
            
            // Create pagination buttons for visible pages
            visiblePages.forEach((page, index) => {
                const pageButton = document.createElement('button');
                pageButton.classList.add('pager-button');
                pageButton.textContent = index + 1;
                if (page.classList.contains('active')) pageButton.classList.add('active');
                
                pageButton.addEventListener('click', () => {
                    // Hide all pages and deactivate all buttons
                    visiblePages.forEach(p => p.classList.remove('active'));
                    pagerContainer.querySelectorAll('.pager-button').forEach(b => b.classList.remove('active'));
                    
                    // Show selected page and activate button
                    visiblePages[index].classList.add('active');
                    pageButton.classList.add('active');
                });
                
                pagerContainer.appendChild(pageButton);
            });
        });
    };

    // Showcase filters functionality
    const initShowcaseFilters = () => {
        const filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
        const modelFilterButtons = document.querySelectorAll('.filter-btn[data-model]');
        
        // Category filtering
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all category buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                applyFilters();
            });
        });
        
        // Model version filtering
        modelFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all model buttons
                modelFilterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                applyFilters();
            });
        });
        
        // Function to apply both category and model filters
        const applyFilters = () => {
            const activeFilterElement = document.querySelector('.filter-btn[data-filter].active');
            const activeModelElement = document.querySelector('.filter-btn[data-model].active');
            
            const activeFilter = activeFilterElement ? activeFilterElement.getAttribute('data-filter') : 'all';
            const activeModel = activeModelElement ? activeModelElement.getAttribute('data-model') : 'all';
            
            const examplePages = document.querySelectorAll('.example-page');
            
            examplePages.forEach(page => {
                if (!page) return; // Skip if page element is null
                
                const categories = page.getAttribute('data-category') || '';
                const model = page.getAttribute('data-model') || 'all';
                
                const matchesCategory = activeFilter === 'all' || (categories && categories.includes(activeFilter));
                const matchesModel = activeModel === 'all' || model === activeModel;
                
                if (matchesCategory && matchesModel) {
                    page.style.display = '';
                    
                    // If this is the first visible page in its panel, make it active
                    const panel = page.closest('.showcase-panel');
                    if (panel) {
                        const visiblePages = Array.from(panel.querySelectorAll('.example-page'))
                            .filter(p => p.style.display !== 'none');
                        
                        if (visiblePages.length > 0 && visiblePages[0] === page) {
                            panel.querySelectorAll('.example-page').forEach(p => p.classList.remove('active'));
                            page.classList.add('active');
                        }
                    }
                } else {
                    page.style.display = 'none';
                }
            });
            
            // Update pagination
            updateShowcasePagination();
        };
    };

    // Add active class to nav items based on scroll position
    const highlightNavOnScroll = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    };
    
    highlightNavOnScroll();
});