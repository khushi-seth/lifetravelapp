/* ==========================================================================
   SKYVOYAGE - INTERACTIVE LOGIC & EFFECTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Starry Space Particle Background
    // ==========================================
    const canvas = document.getElementById('stars-canvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const starCount = 120;
    
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                twinkleSpeed: 0.01 + Math.random() * 0.02,
                alpha: Math.random(),
                color: Math.random() > 0.8 ? '#00f3ff' : (Math.random() > 0.8 ? '#bd00ff' : '#ffffff')
            });
        }
    }
    
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw space glow background
        const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
        gradient.addColorStop(0, '#0d0b2b');
        gradient.addColorStop(0.5, '#060512');
        gradient.addColorStop(1, '#020107');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.alpha += star.twinkleSpeed;
            if (star.alpha > 1 || star.alpha < 0) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = Math.max(0.1, star.alpha);
            ctx.shadowBlur = star.size * 4;
            ctx.shadowColor = star.color;
            ctx.fill();
        });
        
        ctx.shadowBlur = 0; // reset shadow
        ctx.globalAlpha = 1.0;
        requestAnimationFrame(animateStars);
    }

    initCanvas();
    animateStars();

    window.addEventListener('resize', () => {
        initCanvas();
    });

    // ==========================================
    // 2. Sticky Navbar & Active Section Tracker
    // ==========================================
    const navbar = document.getElementById('main-nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky check
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
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

    // ==========================================
    // 3. Mobile Navigation Drawer Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 4. Testimonials Slider
    // ==========================================
    const testimonialTrack = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let activeSlideIndex = 0;
    let testimonialInterval;

    function showSlide(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
        activeSlideIndex = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTestimonialTimer();
        });
    });

    function startTestimonialTimer() {
        testimonialInterval = setInterval(() => {
            let nextIndex = (activeSlideIndex + 1) % dots.length;
            showSlide(nextIndex);
        }, 6000);
    }

    function resetTestimonialTimer() {
        clearInterval(testimonialInterval);
        startTestimonialTimer();
    }

    startTestimonialTimer();

    // ==========================================
    // 5. Booking Modal & Wizard System
    // ==========================================
    const bookingModal = document.getElementById('booking-modal');
    const closeBookingBtn = document.getElementById('close-booking-modal');
    const openBookingTriggers = document.querySelectorAll('.open-booking-wizard, #nav-book-btn');
    
    // Form selections
    const bookDestination = document.getElementById('book-destination');
    const bookClass = document.getElementById('book-class');
    const bookPassengers = document.getElementById('book-passengers');
    const bookDate = document.getElementById('book-date');
    const bookGravity = document.getElementById('book-gravity');
    const priceDisplay = document.getElementById('wizard-price-display');

    // Steps
    const steps = document.querySelectorAll('.wizard-step');
    const stepDots = document.querySelectorAll('.step-dot');
    const stepLines = document.querySelectorAll('.step-line');
    
    // Base pricing system
    const destinationPrices = {
        'Sky Haven Island': 4999,
        'Neo Cloud City': 7200,
        'Aurora Floating Resort': 9500,
        'Gravity Zero Paradise': 12900
    };

    const classMultipliers = {
        'Cruiser Class': 1.0,
        'Quantum First Class': 1.5,
        'Cosmos Presidential': 2.5
    };

    // Initialize Launch date input with tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    bookDate.setAttribute('min', dateString);
    bookDate.value = dateString;

    // Calculate Price Dynamically
    function updateWizardPrice() {
        const dest = bookDestination.value;
        const cls = bookClass.value;
        const passengers = parseInt(bookPassengers.value) || 1;

        if (!dest) {
            priceDisplay.textContent = '--';
            return;
        }

        const basePrice = destinationPrices[dest] || 0;
        const multiplier = classMultipliers[cls] || 1.0;
        const total = Math.round(basePrice * multiplier * passengers);
        priceDisplay.textContent = `$${total.toLocaleString()}`;
    }

    [bookDestination, bookClass, bookPassengers].forEach(elem => {
        elem.addEventListener('change', updateWizardPrice);
    });
    bookPassengers.addEventListener('input', updateWizardPrice);

    // Modal display triggers
    function openModal(destName = '', packageName = '') {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetWizard();

        if (destName) {
            bookDestination.value = destName;
        }
        if (packageName) {
            bookClass.value = packageName;
        }
        updateWizardPrice();
    }

    function closeModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openBookingTriggers.forEach(btn => {
        btn.addEventListener('click', () => openModal());
    });

    closeBookingBtn.addEventListener('click', closeModal);
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeModal();
    });

    // Card details clicks
    document.querySelectorAll('.dest-card').forEach(card => {
        const title = card.getAttribute('data-destination');
        card.querySelector('.card-book-btn').addEventListener('click', () => {
            openModal(title, '');
        });
    });

    // Package selects
    document.querySelectorAll('.select-package').forEach(btn => {
        const pkg = btn.getAttribute('data-package');
        btn.addEventListener('click', () => {
            openModal('', pkg);
        });
    });

    // Wizard navigation controls
    function goToStep(stepNum) {
        steps.forEach(s => s.classList.remove('active'));
        document.getElementById(`wizard-step-${stepNum}`).classList.add('active');

        stepDots.forEach((dot, idx) => {
            const dotStep = parseInt(dot.getAttribute('data-step'));
            dot.classList.remove('active', 'completed');
            if (dotStep === stepNum) {
                dot.classList.add('active');
            } else if (dotStep < stepNum) {
                dot.classList.add('completed');
            }
        });

        stepLines.forEach((line, idx) => {
            if (idx < stepNum - 1) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        });
    }

    // Step 1 Validation & Next
    document.querySelector('.next-step-btn').addEventListener('click', () => {
        if (!bookDestination.value) {
            alert('Please select your destination planet/island first.');
            bookDestination.focus();
            return;
        }
        if (!bookDate.value) {
            alert('Please select a launch vector date.');
            bookDate.focus();
            return;
        }
        goToStep(2);
    });

    // Back buttons
    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prev = parseInt(btn.getAttribute('data-prev'));
            goToStep(prev);
        });
    });

    // Step 2 Submission (Compile Flight codes)
    const detailsForm = document.getElementById('booking-details-form');
    detailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const passengerName = document.getElementById('passenger-name').value;
        const passengerPassport = document.getElementById('passenger-passport').value;
        const waiverAccepted = document.getElementById('passenger-waiver').checked;

        if (!passengerName || !passengerPassport) {
            alert('Please complete all explorer identity values.');
            return;
        }

        if (!waiverAccepted) {
            alert('You must accept the spatial health waiver before flight vector allocation.');
            return;
        }

        // Generate Boarding Pass dynamic information
        const selectedDest = bookDestination.value;
        const selectedClass = bookClass.value;
        const selectedDate = bookDate.value;
        
        let gravityText = 'DEFAULTG';
        const gravVal = bookGravity.value;
        if (gravVal === 'custom') {
            gravityText = selectedDest === 'Sky Haven Island' ? '0.2G MODE' :
                          selectedDest === 'Neo Cloud City' ? '0.5G MODE' :
                          selectedDest === 'Aurora Floating Resort' ? '0.3G MODE' : '0.0G MODE';
        } else if (gravVal === 'earth') {
            gravityText = '1.0G EMULATED';
        } else {
            gravityText = '0.0G WEIGHTLESS';
        }

        // Seating pod random assignment
        const seatLetter = ['A', 'B', 'C', 'D', 'Z'][Math.floor(Math.random() * 5)];
        const seatNum = Math.floor(1 + Math.random() * 45);
        const seatCode = selectedClass === 'Cosmos Presidential' ? `SUITE 0${Math.floor(1+Math.random()*4)}${seatLetter}` : `POD ${seatNum}${seatLetter}`;

        // Unique barcode simulation
        const randomHex = Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
        const ticketCode = `SV-${selectedClass.slice(0,3).toUpperCase()}-${passengerPassport.slice(-4)}-${randomHex}`;

        // Populate Boarding Pass DOM
        document.getElementById('bp-class-badge').textContent = selectedClass.toUpperCase();
        document.getElementById('bp-name').textContent = passengerName.toUpperCase();
        document.getElementById('bp-id').textContent = passengerPassport.toUpperCase();
        document.getElementById('bp-destination').textContent = selectedDest.toUpperCase();
        document.getElementById('bp-date').textContent = selectedDate;
        document.getElementById('bp-gravity').textContent = gravityText;
        document.getElementById('bp-seat').textContent = seatCode;
        document.getElementById('bp-code').textContent = ticketCode;

        // Animate Step 3
        goToStep(3);
    });

    // Reset Wizard parameters
    function resetWizard() {
        detailsForm.reset();
        document.getElementById('booking-config-form').reset();
        bookDate.value = dateString;
        goToStep(1);
    }

    // Finish / Close
    document.getElementById('finish-booking-btn').addEventListener('click', () => {
        closeModal();
    });

    // Print Simulation
    document.getElementById('print-pass-btn').addEventListener('click', () => {
        window.print();
    });

    // ==========================================
    // 6. Contact Form Processing
    // ==========================================
    const inquiryForm = document.getElementById('inquiry-form');
    const contactStatus = document.getElementById('contact-status');

    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = inquiryForm.querySelector('button[type="submit"]');
        const origText = submitBtn.textContent;
        
        // Show transmission state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Hologram...';
        contactStatus.textContent = '';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
            
            contactStatus.className = 'form-status success';
            contactStatus.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> Message successfully beamed to Port Stratos! Our crew will transmit back soon.';
            
            inquiryForm.reset();
        }, 2200);
    });

    // ==========================================
    // 7. AI Travel Assistant (NOVA Chatbot Simulator)
    // ==========================================
    const chatTrigger = document.getElementById('chat-trigger');
    const chatContainer = document.getElementById('chat-container');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Toggle Chat visibility
    chatTrigger.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active')) {
            chatInput.focus();
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    // Close chat if clicking outside the widget
    document.addEventListener('click', (e) => {
        if (!chatContainer.contains(e.target) && chatContainer.classList.contains('active')) {
            chatContainer.classList.remove('active');
        }
    });

    // Auto chatbot response simulation engine
    function appendMessage(sender, text) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender === 'user' ? 'user-message' : 'bot-message'} animate-slide-in`;
        
        msgDiv.innerHTML = `
            <div class="message-text">${text}</div>
            <span class="message-time">${time}</span>
        `;
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showThinkingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot-message thinking-indicator animate-slide-in';
        indicator.id = 'chat-thinking';
        indicator.innerHTML = `
            <div class="message-text" style="padding: 10px 16px; opacity:0.6;">
                <i class="fa-solid fa-spinner fa-spin"></i> NOVA is calculating vector...
            </div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeThinkingIndicator() {
        const indicator = document.getElementById('chat-thinking');
        if (indicator) indicator.remove();
    }

    // Keyword matching response parser
    function getNovaResponse(input) {
        const query = input.toLowerCase();

        // Greeting
        if (query.includes('hi') || query.includes('hello') || query.includes('greetings') || query.includes('hey')) {
            return "Greetings, space farer! How can I assist you with your trajectory planning today?";
        }

        // Destinations specifics
        if (query.includes('sky haven') || query.includes('haven') || (query.includes('low') && query.includes('gravity') && query.includes('relax'))) {
            return "<strong>Sky Haven Island</strong> is one of our most peaceful locations. Hovering at 12km altitude, it boasts lush micro-gardens and floating waterfalls at 0.2g gravity. Highly recommended for couples and researchers! Packages start at $4,999.";
        }

        if (query.includes('neo cloud') || query.includes('cloud city') || query.includes('cyberpunk') || query.includes('city')) {
            return "<strong>Neo Cloud City</strong> is a high-altitude cyberpunk metropolis hovering at 18km. It is famous for neon glass highways, luxury flying yacht bays, and a thrilling anti-gravity nightlife (0.5g). Cruises start from $7,200.";
        }

        if (query.includes('aurora') || query.includes('resort') || query.includes('spa') || query.includes('lights')) {
            return "The <strong>Aurora Floating Resort</strong> floats at 25km right inside the ionosphere aurora curtains. It offers zero-g cosmic thermal pools and private glass domes to watch planetary auroras. A supreme luxury escape at $9,500.";
        }

        if (query.includes('zero paradise') || query.includes('gravity zero') || query.includes('weightless') || query.includes('zero gravity')) {
            return "<strong>Gravity Zero Paradise</strong> is a fully-domed theme park orbiting at 40km. With absolute 0.0g gravity, you can float inside liquid spheres, play zero-g sports, or enjoy orbital skydiving. Starts at $12,900.";
        }

        // Packages general
        if (query.includes('package') || query.includes('pricing') || query.includes('price') || query.includes('cost')) {
            return "We offer three classes of voyage: <br>1. <strong>Cruiser Class</strong> ($4,999): Base entry to Sky Haven Island.<br>2. <strong>Quantum First Class</strong> ($8,500): Access to all destinations, private sleeping pod, space cuisine buffet.<br>3. <strong>Cosmos Presidential</strong> ($15,000): Double-Decker Glass Dome Suite, personal butler, and infinite orbital VIP access.";
        }

        // Booking guide
        if (query.includes('book') || query.includes('reserve') || query.includes('ticket') || query.includes('buy')) {
            return "Booking is simple! You can click the 'Reserve Cabin' button on the hero section or 'Book Flight' on the top navbar to launch our flight configuration wizard. I can also help you look at gravity requirements!";
        }

        if (query.includes('gravity') || query.includes('g-force') || query.includes('safety')) {
            return "All passengers are provided with quantum gravity adjusters (belts or suits) based on their cabin class. Destinational gravity parameters range from 0.5g down to absolute 0.0g weightlessness. Medical screening is conducted automatically during the wizard step.";
        }

        // Fallback default response
        return "Fascinating query! My databanks recommend checking out the <strong>Aurora Floating Resort</strong> for luxury or <strong>Gravity Zero Paradise</strong> for weightless sports. If you're ready to fly, type 'book' or click 'Book Flight' above!";
    }

    function processChatInput(text) {
        if (!text.trim()) return;
        
        // User message
        appendMessage('user', text);
        chatInput.value = '';

        // Show bot thinking state
        showThinkingIndicator();

        // Simulate network latency (1 to 1.5 seconds)
        setTimeout(() => {
            removeThinkingIndicator();
            const botReply = getNovaResponse(text);
            appendMessage('bot', botReply);
        }, 1200);
    }

    // Submit triggers
    chatSend.addEventListener('click', () => {
        processChatInput(chatInput.value);
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processChatInput(chatInput.value);
        }
    });

    // Suggestion chips clicks
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const queryText = chip.textContent;
            processChatInput(queryText);
        });
    });

});
