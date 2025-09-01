document.addEventListener('DOMContentLoaded', function() {
    // Notification system
    function showNotification(type, title, message, duration = 5000) {
        const notificationContainer = document.getElementById('notificationContainer');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let iconClass = '';
        switch(type) {
            case 'success':
                iconClass = 'fas fa-check-circle';
                break;
            case 'error':
                iconClass = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-triangle';
                break;
            case 'info':
                iconClass = 'fas fa-info-circle';
                break;
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Trigger reflow to enable animation
        void notification.offsetWidth;
        
        // Show notification
        notification.classList.add('show');
        
        // Close button event
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
        
        // Auto hide if duration is set
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    hideNotification(notification);
                }
            }, duration);
        }
        
        return notification;
    }
    
    function hideNotification(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Success Modal functions
    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('show');
        
        // Reset animation
        const checkmarkCircle = document.querySelector('.checkmark__circle');
        const checkmarkCheck = document.querySelector('.checkmark__check');
        
        // Trigger reflow to restart animations
        checkmarkCircle.style.animation = 'none';
        checkmarkCheck.style.animation = 'none';
        
        setTimeout(() => {
            checkmarkCircle.style.animation = '';
            checkmarkCheck.style.animation = '';
        }, 10);
    }
    
    function hideSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
    }
    
    // Modal event listeners
    document.getElementById('modalCloseBtn').addEventListener('click', hideSuccessModal);
    
    // Close modal when clicking outside content
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideSuccessModal();
        }
    });
    
    // Generate CAPTCHA
    function generateCaptcha() {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return captcha;
    }
    
    // Display CAPTCHA
    let currentCaptcha = generateCaptcha();
    document.getElementById('captchaText').textContent = currentCaptcha;
    
    // Refresh CAPTCHA
    document.getElementById('refreshCaptcha').addEventListener('click', function() {
        currentCaptcha = generateCaptcha();
        document.getElementById('captchaText').textContent = currentCaptcha;
        document.getElementById('captcha').value = '';
        
        // Add animation effect
        this.classList.add('rotating');
        setTimeout(() => {
            this.classList.remove('rotating');
        }, 500);
        
        showNotification('info', 'CAPTCHA Refreshed', 'A new security code has been generated.');
    });
    
    // Form validation
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const captcha = document.getElementById('captcha').value.trim();
        
        // Simple validation
        if (!name) {
            showNotification('error', 'Validation Error', 'Please enter your name.');
            return false;
        }
        
        if (!email) {
            showNotification('error', 'Validation Error', 'Please enter your email address.');
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('error', 'Validation Error', 'Please enter a valid email address.');
            return false;
        }
        
        if (!subject) {
            showNotification('error', 'Validation Error', 'Please enter a subject for your message.');
            return false;
        }
        
        if (!message) {
            showNotification('error', 'Validation Error', 'Please enter your message.');
            return false;
        }
        
        if (!captcha) {
            showNotification('error', 'Validation Error', 'Please enter the security code.');
            return false;
        }
        
        if (captcha !== currentCaptcha) {
            showNotification('error', 'Security Error', 'The security code you entered is incorrect.');
            return false;
        }
        
        return true;
    }
    
    // Form submission handler
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = document.querySelector('.btn-text');
        const btnLoader = document.querySelector('.btn-loader');
        
        btnText.textContent = 'Processing...';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
            // In a real application, you would send the form data to the server here
            
            // Show success modal instead of notification
            showSuccessModal();
            
            // Reset form and generate new CAPTCHA
            this.reset();
            currentCaptcha = generateCaptcha();
            document.getElementById('captchaText').textContent = currentCaptcha;
            
            // Reset button state
            btnText.textContent = 'Send Message';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
        }, 1500);
    });
    
    // TEST FUNCTION - Fill form with sample data
    document.getElementById('testBtn').addEventListener('click', function() {
        document.getElementById('name').value = 'John Doe';
        document.getElementById('email').value = 'john.doe@example.com';
        document.getElementById('subject').value = 'Test Inquiry';
        document.getElementById('message').value = 'This is a test message to check the contact form functionality.';
        document.getElementById('captcha').value = currentCaptcha;
        
        // Show notification
        showNotification('info', 'Test Data Loaded', 'The form has been filled with sample data for testing.', 3000);
        
        // Add visual feedback
        this.style.background = 'var(--success)';
        this.style.color = 'white';
        
        setTimeout(() => {
            this.style.background = '';
            this.style.color = '';
        }, 1000);
        
        console.log('Form filled with test data. You can remove this function later.');
    });
    
    // Add input animations
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Demo notifications on page load
    setTimeout(() => {
        showNotification('info', 'Welcome!', 'Feel free to test our contact form.', 4000);
    }, 1000);
});
