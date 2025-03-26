document.addEventListener('DOMContentLoaded', () => {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let interval;

    // Function to show a specific slide
    const showSlide = (index) => {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        sliderDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the selected slide and activate corresponding dot
        testimonialSlides[index].classList.add('active');
        sliderDots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    };

    // Function to show the next slide
    const nextSlide = () => {
        let newIndex = currentSlide + 1;
        if (newIndex >= testimonialSlides.length) {
            newIndex = 0;
        }
        showSlide(newIndex);
    };

    // Set up click handlers for the slider dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });

    // Function to start the auto-rotation
    const startInterval = () => {
        interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };

    // Function to reset the interval (used after manual navigation)
    const resetInterval = () => {
        clearInterval(interval);
        startInterval();
    };

    // Initialize the slider
    if (testimonialSlides.length > 0) {
        showSlide(0);
        startInterval();
    }
});

