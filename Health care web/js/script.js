document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');
    const navItems = document.querySelectorAll('.nav-item');

    // Page Content Data
    const pages = {
        home: `
            <div class="welcome-section card">
                <h1>Welcome to CarePlus Medical Center</h1>
                <p>Providing high-quality healthcare services with modern technology and expert doctors. Your health is our top priority.</p>
            </div>
            
            <div class="grid-3 stats-container">
                <div class="card text-center stat-card">
                    <i class="fas fa-user-md fa-3x mb-1" style="color: var(--primary-blue)"></i>
                    <h2 class="stat-number" data-target="50">0</h2>
                    <p>Expert Doctors</p>
                </div>
                <div class="card text-center stat-card">
                    <i class="fas fa-smile fa-3x mb-1" style="color: var(--primary-green)"></i>
                    <h2 class="stat-number" data-target="5000">0</h2>
                    <p>Happy Patients</p>
                </div>
                <div class="card text-center stat-card">
                    <i class="fas fa-award fa-3x mb-1" style="color: #f1c40f"></i>
                    <h2 class="stat-number" data-target="15">0</h2>
                    <p>Years Experience</p>
                </div>
            </div>
        `,
        about: `
            <div class="card">
                <h2 class="section-title">About Us</h2>
                <p>CarePlus has been at the forefront of medical excellence for over 20 years. We combine a passion for healing with the latest medical advancements to provide compassionate and effective care for our community.</p>
                
                <div class="grid-2 mt-1">
                    <div class="feature-item d-flex align-items-center gap-15 mb-1">
                        <div class="icon-box"><i class="fas fa-clock fa-2x"></i></div>
                        <div>
                            <h4>24/7 Service</h4>
                            <p>Round-the-clock medical assistance</p>
                        </div>
                    </div>
                    <div class="feature-item d-flex align-items-center gap-15 mb-1">
                        <div class="icon-box"><i class="fas fa-ambulance fa-2x"></i></div>
                        <div>
                            <h4>Emergency Care</h4>
                            <p>Immediate response for critical cases</p>
                        </div>
                    </div>
                    <div class="feature-item d-flex align-items-center gap-15 mb-1">
                        <div class="icon-box"><i class="fas fa-flask fa-2x"></i></div>
                        <div>
                            <h4>Modern Lab</h4>
                            <p>Advanced diagnostic facilities</p>
                        </div>
                    </div>
                    <div class="feature-item d-flex align-items-center gap-15 mb-1">
                        <div class="icon-box"><i class="fas fa-user-md fa-2x"></i></div>
                        <div>
                            <h4>Expert Team</h4>
                            <p>Highly qualified medical professionals</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        doctors: `
            <h2 class="section-title">Our Specialist Doctors</h2>
            <div class="grid-3">
                <div class="card doctor-card text-center">
                    <img src="img/dr_sarah_khan.png" alt="Dr. Sarah Khan" class="doctor-img">
                    <h3>Dr. Sarah Khan</h3>
                    <p class="specialty">Cardiologist</p>
                    <p>12 Years Experience</p>
                    <div class="rating"><i class="fas fa-star"></i> 4.8</div>
                    <button class="btn btn-primary mt-1">Book Now</button>
                </div>
                <div class="card doctor-card text-center">
                    <img src="img/dr_ahmed_ali.png" alt="Dr. Ahmed Ali" class="doctor-img">
                    <h3>Dr. Ahmed Ali</h3>
                    <p class="specialty">Neurologist</p>
                    <p>10 Years Experience</p>
                    <div class="rating"><i class="fas fa-star"></i> 5.0</div>
                    <button class="btn btn-primary mt-1">Book Now</button>
                </div>
                <div class="card doctor-card text-center">
                    <img src="img/dr_fatima_hassan.png" alt="Dr. Fatima Hassan" class="doctor-img">
                    <h3>Dr. Fatima Hassan</h3>
                    <p class="specialty">Pediatrician</p>
                    <p>8 Years Experience</p>
                    <div class="rating"><i class="fas fa-star"></i> 5.0</div>
                    <button class="btn btn-primary mt-1">Book Now</button>
                </div>
            </div>
        `,
        services: `
            <h2 class="section-title">Medical Services</h2>
            <div class="grid-3">
                ${['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Pulmonology', 'Ophthalmology'].map(service => `
                    <div class="flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front card">
                                <i class="fas fa-${getIconForService(service)} fa-3x mb-1" style="color: var(--primary-blue)"></i>
                                <h3>${service}</h3>
                                <p>Specialized care for ${service.toLowerCase()} related issues.</p>
                            </div>
                            <div class="flip-card-back card">
                                <h3>${service} Details</h3>
                                <ul>
                                    <li>Consultation</li>
                                    <li>Diagnostics</li>
                                    <li>Therapy</li>
                                    <li>Aftercare</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `,
        appointment: `
            <div class="card appointment-card">
                <h2 class="section-title">Book an Appointment</h2>
                <form id="appointment-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <input type="text" id="name" required placeholder=" ">
                            <label for="name">Full Name</label>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" required placeholder=" ">
                            <label for="email">Email Address</label>
                        </div>
                        <div class="form-group">
                            <input type="tel" id="phone" required placeholder=" ">
                            <label for="phone">Phone Number</label>
                        </div>
                        <div class="form-group">
                            <select id="doctor" required>
                                <option value="" disabled selected>Select Doctor</option>
                                <option>Dr. Sarah Khan</option>
                                <option>Dr. Ahmed Ali</option>
                                <option>Dr. Fatima Hassan</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input type="date" id="date" required>
                        </div>
                        <div class="form-group">
                            <input type="time" id="time" required>
                        </div>
                    </div>
                    <div class="form-group mt-1">
                        <textarea id="notes" rows="4" placeholder=" "></textarea>
                        <label for="notes">Additional Notes</label>
                    </div>
                    <button type="submit" class="btn btn-primary mt-1">
                        <i class="fas fa-paper-plane"></i> Book Appointment
                    </button>
                </form>
            </div>
        `,
        contact: `
            <h2 class="section-title">Contact Us</h2>
            <div class="grid-2">
                <div class="card">
                    <div class="contact-info">
                        <p><i class="fas fa-map-marker-alt"></i> 123 Healthcare Avenue, Medical City</p>
                        <p><i class="fas fa-phone"></i> (555) 123-4567</p>
                        <p><i class="fas fa-envelope"></i> info@careplus.com</p>
                    </div>
                </div>
                <div class="card">
                    <h3>Working Hours</h3>
                    <p>Mon-Fri: 8:00 AM - 8:00 PM</p>
                    <p>Sat-Sun: 9:00 AM - 5:00 PM</p>
                </div>
            </div>
        `
    };

    function getIconForService(service) {
        const icons = {
            'Cardiology': 'heart-circle-bolt',
            'Neurology': 'brain',
            'Pediatrics': 'child',
            'Orthopedics': 'bone',
            'Pulmonology': 'lungs',
            'Ophthalmology': 'eye'
        };
        return icons[service] || 'stethoscope';
    }

    // Mobile Navigation Logic
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function toggleSidebar(isOpen) {
        if (isOpen) {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', () => toggleSidebar(true));
    if (closeSidebar) closeSidebar.addEventListener('click', () => toggleSidebar(false));
    if (overlay) overlay.addEventListener('click', () => toggleSidebar(false));

    // Swipe to close functionality
    let touchStartX = 0;
    sidebar.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
    sidebar.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) toggleSidebar(false); // Swipe left
    });

    // Navigation Logic
    function loadPage(pageKey) {
        // Update content with fade effect
        contentContainer.style.opacity = '0';
        setTimeout(() => {
            contentContainer.innerHTML = pages[pageKey];
            contentContainer.style.opacity = '1';
            
            // Re-run specific initializations
            if (pageKey === 'home') startCountUp();
            if (pageKey === 'appointment') setupFormHandler();
            
            // Auto-scroll to top when page changes
            document.querySelector('.main-content').scrollTop = 0;
        }, 300);

        // Update active menu
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === pageKey) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            toggleSidebar(false);
        }
    }

    // Count Up Animation
    function startCountUp() {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const target = +num.getAttribute('data-target');
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    num.innerText = target + (num.parentElement.textContent.includes('Doctors') ? '+' : (num.parentElement.textContent.includes('Patients') ? '+' : '+'));
                    clearInterval(timer);
                } else {
                    num.innerText = Math.ceil(current);
                }
            }, 30);
        });
    }

    // Form Submission Handler
    function setupFormHandler() {
        const form = document.getElementById('appointment-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Appointment Booked Successfully! We will contact you soon.');
                form.reset();
            });
        }
    }

    // Event Listeners for Nav
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Initial Load
    loadPage('home');
});
