// Configuration file for DesignAI
export const config = {
    // API endpoints
    api: {
        generateDesign: '/api/generate',
        exportDesign: '/api/export'
    },
    
    // Design templates
    templates: {
        dashboard: "Create a modern dashboard with a dark theme, navigation sidebar on the left, and statistics cards at the top.",
        landing: "Design a clean, minimal landing page with a hero section, features grid, and pricing table.",
        mobile: "Create a mobile app interface with bottom navigation, profile screen with user stats and activity feed.",
        form: "Design a multi-step form with progress indicator, form fields, and submit button."
    },
    
    // Default generation settings
    defaults: {
        style: 'minimal',
        theme: 'light'
    },
    
    // Export options
    exportFormats: [
        { id: 'html', label: 'HTML/CSS' },
        { id: 'svg', label: 'SVG' },
        { id: 'figma', label: 'Figma' },
        { id: 'react', label: 'React' }
    ],
    
    // Demo UI designs for placeholder content
    demoDesigns: [
        {
            name: 'Dashboard',
            preview: 'dashboard-preview.png',
            svgCode: ''  // Will be populated with SVG content
        },
        {
            name: 'Landing Page',
            preview: 'landing-preview.png',
            svgCode: ''  // Will be populated with SVG content
        }
    ]
};

