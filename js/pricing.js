document.addEventListener('DOMContentLoaded', () => {
    const billingToggle = document.getElementById('billing-toggle');
    const monthlyPrices = document.querySelectorAll('.price.monthly');
    const annualPrices = document.querySelectorAll('.price.annual');

    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            if (billingToggle.checked) {
                // Annual pricing
                monthlyPrices.forEach(price => {
                    price.style.display = 'none';
                });
                annualPrices.forEach(price => {
                    price.style.display = 'inline';
                });
            } else {
                // Monthly pricing
                monthlyPrices.forEach(price => {
                    price.style.display = 'inline';
                });
                annualPrices.forEach(price => {
                    price.style.display = 'none';
                });
            }
        });
    }
});

