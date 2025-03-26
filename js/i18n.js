document.addEventListener('DOMContentLoaded', () => {
    // Get language selector element
    const languageSelect = document.getElementById('language-select');
    
    // Default language
    let currentLanguage = 'en';

    // Function to load language data
    const loadLanguage = async (lang) => {
        try {
            const response = await fetch(`locale/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language: ${lang}`);
            }
            const langData = await response.json();
            return langData;
        } catch (error) {
            console.error(error);
            // Fallback to English if the requested language file isn't found
            if (lang !== 'en') {
                console.warn(`Falling back to English`);
                return loadLanguage('en');
            }
            // If even English fails, return an empty object to prevent further errors
            return {};
        }
    };

    // Function to update all text content based on language data
    const updateContent = (langData) => {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = getNestedProperty(langData, key);
            if (text) {
                element.textContent = text;
            }
        });

        // Update elements with data-i18n-placeholder attribute (for input placeholders)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const text = getNestedProperty(langData, key);
            if (text) {
                element.placeholder = text;
            }
        });

        // Update elements with data-i18n-title attribute (for tooltips/titles)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const text = getNestedProperty(langData, key);
            if (text) {
                element.title = text;
            }
        });

        // Update document title if specified in the language data
        if (langData.page && langData.page.title) {
            document.title = langData.page.title;
        }
    };

    // Helper function to get nested property from object using dot notation
    const getNestedProperty = (obj, path) => {
        return path.split('.').reduce((prev, curr) => {
            return prev && prev[curr] !== undefined ? prev[curr] : undefined;
        }, obj);
    };

    // Function to change the language
    const changeLanguage = async (lang) => {
        currentLanguage = lang;
        const langData = await loadLanguage(lang);
        updateContent(langData);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Store language preference
        localStorage.setItem('preferred-language', lang);
        
        // Update language selector
        if (languageSelect) {
            languageSelect.value = lang;
        }
    };

    // Set up language selector change event
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }

    // Initialize with the saved language or browser language
    const initLanguage = () => {
        // Check for saved preference
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang) {
            return changeLanguage(savedLang);
        }
        
        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        
        // Check if we support this language
        const supportedLanguages = ['en', 'zh', 'es', 'fr', 'de', 'ja'];
        if (supportedLanguages.includes(browserLang)) {
            return changeLanguage(browserLang);
        }
        
        // Fall back to English
        return changeLanguage('en');
    };

    // Initialize language
    initLanguage();
});

