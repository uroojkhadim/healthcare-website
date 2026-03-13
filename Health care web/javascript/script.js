// Typewriter Effect Class
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 200;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Accessibility Manager Class
class AccessibilityManager {
    constructor() {
        this.body = document.body;
        this.toggleBtn = document.getElementById('accToggle');
        this.panel = document.getElementById('accPanel');
        this.closeBtn = document.getElementById('accClose');
        this.themeBtns = document.querySelectorAll('[data-theme]');
        this.fontInc = document.getElementById('fontIncrease');
        this.fontDec = document.getElementById('fontDecrease');
        this.fontReset = document.getElementById('fontReset');
        
        this.fontScale = parseFloat(localStorage.getItem('fontScale')) || 1;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        // Apply saved settings
        this.setTheme(this.currentTheme);
        this.setFontScale(this.fontScale);
        
        // Toggle Panel
        this.toggleBtn?.addEventListener('click', () => this.togglePanel());
        this.closeBtn?.addEventListener('click', () => this.togglePanel(false));
        
        // Theme Selection
        this.themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.getAttribute('data-theme');
                this.setTheme(theme);
            });
        });
        
        // Font Scaling
        this.fontInc?.addEventListener('click', () => this.setFontScale(this.fontScale + 0.1));
        this.fontDec?.addEventListener('click', () => this.setFontScale(this.fontScale - 0.1));
        this.fontReset?.addEventListener('click', () => this.setFontScale(1));
        
        // Keyboard: Close on Escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('active')) {
                this.togglePanel(false);
            }
        });
    }

    togglePanel(force) {
        const isActive = force !== undefined ? force : !this.panel.classList.contains('active');
        this.panel.classList.toggle('active', isActive);
        this.toggleBtn.setAttribute('aria-expanded', isActive);
        
        if (isActive) {
            // Focus first button in panel for keyboard users
            this.panel.querySelector('button').focus();
        } else {
            this.toggleBtn.focus();
        }
    }

    setTheme(theme) {
        try {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update active class on buttons
            this.themeBtns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
            });
        } catch (e) {
            console.error('Failed to set theme:', e);
        }
    }

    setFontScale(scale) {
        try {
            // Limit scaling between 0.8 and 1.5
            this.fontScale = Math.min(Math.max(scale, 0.8), 1.5);
            document.documentElement.style.setProperty('--font-scale', this.fontScale);
            localStorage.setItem('fontScale', this.fontScale);
        } catch (e) {
            console.error('Failed to set font scale:', e);
        }
    }
}

// Security Manager Class
class SecurityManager {
    constructor() {
        this.captchaCode = '';
        this.loginModal = document.getElementById('loginModal');
        this.loginForm = document.getElementById('loginForm');
        this.userProfile = document.getElementById('userProfile');
        this.loginNavBtn = document.getElementById('loginNavBtn');
        this.alertEl = document.getElementById('securityAlert');
        this.alertMsg = document.getElementById('securityAlertMsg');
        
        this.rateLimit = {
            limit: 5,
            window: 60000, // 1 minute
            key: 'appointment_rate_limit'
        };

        this.init();
    }

    init() {
        this.generateCaptcha();
        document.getElementById('refreshCaptcha')?.addEventListener('click', () => this.generateCaptcha());
        
        // Login Modal Events
        this.loginNavBtn?.addEventListener('click', () => this.toggleLoginModal(true));
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
        
        // Window click to close modal
        window.addEventListener('click', (e) => {
            if (e.target === this.loginModal) this.toggleLoginModal(false);
            if (e.target === document.getElementById('addDoctorModal')) this.toggleDocModal(false);
        });

        // Forgot Password simulation
        document.getElementById('forgotPasswordBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            const user = document.getElementById('loginUser').value;
            if (!user) {
                this.showAlert('Please enter your username first.', 'error');
            } else {
                window.communicationManager?.simulateEmail('Password Reset Request', user);
                this.showAlert('Password reset link sent to your registered email.', 'success');
            }
        });

        // Check current session
        this.checkSession();
    }

    toggleDocModal(show) {
        const modal = document.getElementById('addDoctorModal');
        if (show) modal.classList.add('active');
        else modal.classList.remove('active');
    }

    // Phase 3: Telemedicine UI Logic
    startConsultation() {
        closeSuccessModal();
        const ui = document.getElementById('consultationUI');
        ui.classList.add('active');
        this.startCallTimer();
        this.showAlert('Virtual consultation started securely.', 'success');
    }

    endConsultation() {
        const ui = document.getElementById('consultationUI');
        ui.classList.remove('active');
        clearInterval(this.callTimer);
        this.showAlert('Consultation ended. A summary has been sent to your email.', 'success');
    }

    startCallTimer() {
        let seconds = 0;
        const timerEl = document.getElementById('callDuration');
        this.callTimer = setInterval(() => {
            seconds++;
            const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            timerEl.innerText = `${mins}:${secs}`;
        }, 1000);
    }

    // Input Sanitization
// ... (rest of SecurityManager methods)
    sanitize(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // CAPTCHA Implementation
    generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.captchaCode = result;
        const captchaEl = document.getElementById('captchaCode');
        if (captchaEl) captchaEl.innerText = result;
    }

    validateCaptcha(input) {
        return input.toUpperCase() === this.captchaCode;
    }

    // Rate Limiting Logic (Client-side simulation)
    checkRateLimit() {
        const now = Date.now();
        const data = JSON.parse(localStorage.getItem(this.rateLimit.key) || '[]');
        
        // Clean old timestamps
        const filtered = data.filter(ts => now - ts < this.rateLimit.window);
        
        if (filtered.length >= this.rateLimit.limit) {
            this.showAlert('Too many attempts. Please try again in a minute.', 'error');
            return false;
        }
        
        filtered.push(now);
        localStorage.setItem(this.rateLimit.key, JSON.stringify(filtered));
        return true;
    }

    // Session Management (Mock)
    toggleLoginModal(show) {
        if (show) this.loginModal.classList.add('active');
        else this.loginModal.classList.remove('active');
    }

    handleLogin(e) {
        e.preventDefault();
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        // Mock validation
        if (user === 'admin' && pass === 'admin123') {
            const userData = {
                username: 'Administrator',
                role: 'admin',
                initials: 'AD',
                loggedIn: true
            };
            localStorage.setItem('user_session', JSON.stringify(userData));
            this.checkSession();
            this.toggleLoginModal(false);
            this.showAlert('Admin Login Successful', 'success');
        } else if (user && pass.length >= 6) {
            const userData = {
                username: user,
                role: 'user',
                initials: user.substring(0, 2).toUpperCase(),
                loggedIn: true
            };
            localStorage.setItem('user_session', JSON.stringify(userData));
            this.checkSession();
            this.toggleLoginModal(false);
            this.showAlert(`Welcome back, ${user}!`, 'success');
            
            // Simulation: Welcome Email
            window.communicationManager?.simulateEmail('Welcome to CarePlus', user);
        } else {
            this.showAlert('Invalid credentials. Password must be at least 6 characters.', 'error');
        }
    }

    handleLogout() {
        localStorage.removeItem('user_session');
        this.checkSession();
        this.showAlert('You have been logged out securely.', 'success');
        // Redirect to home if on admin dashboard
        if (window.location.hash === '#adminDashboard') {
            window.location.hash = '#home';
        }
        document.getElementById('adminDashboard')?.classList.remove('active');
        document.getElementById('main-content')?.style.setProperty('display', 'block');
    }

    checkSession() {
        const session = JSON.parse(localStorage.getItem('user_session'));
        if (session && session.loggedIn) {
            this.loginNavBtn.style.display = 'none';
            this.userProfile.classList.add('active');
            document.getElementById('userInitials').innerText = session.initials;
            
            if (session.role === 'admin') {
                this.userProfile.style.border = '2px solid var(--primary)';
                // Auto-show dashboard if admin
                document.getElementById('adminDashboard')?.classList.add('active');
                document.getElementById('main-content')?.style.setProperty('display', 'none');
            }
        } else {
            this.loginNavBtn.style.display = 'block';
            this.userProfile.classList.remove('active');
            this.userProfile.style.border = 'none';
        }
    }

    // Utility: Show Security Alert
    showAlert(msg, type = 'error') {
        if (!this.alertEl) return;
        this.alertMsg.innerText = msg;
        this.alertEl.style.background = type === 'error' ? 'var(--accent)' : 'var(--primary)';
        this.alertEl.classList.add('active');
        setTimeout(() => this.alertEl.classList.remove('active'), 5000);
    }
}

// Communication Manager Class (Phase 2)
class CommunicationManager {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.init();
    }

    init() {
        this.form?.addEventListener('submit', (e) => this.handleSubscribe(e));
    }

    handleSubscribe(e) {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value;
        const safeEmail = window.securityManager.sanitize(email);
        this.simulateEmail('Newsletter Subscription Confirmed', safeEmail);
        window.securityManager.showAlert('Subscription successful!', 'success');
        this.form.reset();
    }

    simulateEmail(subject, recipient) {
        const timestamp = new Date().toLocaleString();
        console.log(`%c[EMAIL] To: ${recipient} | Sub: ${subject}`, 'color: #27ae60; font-weight: bold;');
        const logs = JSON.parse(localStorage.getItem('email_logs') || '[]');
        logs.unshift({ timestamp, recipient, subject });
        localStorage.setItem('email_logs', JSON.stringify(logs.slice(0, 50)));
    }
}

// Video Manager Class (Phase 3)
class VideoManager {
    constructor() {
        this.modal = document.getElementById('videoModal');
        this.container = document.getElementById('playerContainer');
    }

    openVideo(videoId) {
        this.modal.classList.add('active');
        this.container.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        `;
    }

    closeVideo() {
        this.modal.classList.remove('active');
        this.container.innerHTML = '';
    }
}

// Communication Manager Class (Phase 2)
// ... (existing code)

// Admin Manager Class (Phase 2 & 3)
class AdminManager {
    constructor() {
        this.body = document.getElementById('adminAppointmentBody');
        this.patientBody = document.getElementById('adminPatientBody');
        this.doctorBody = document.getElementById('adminDoctorBody');
        this.exportBtn = document.getElementById('exportReportBtn');
        this.search = document.getElementById('adminSearch');
        this.addDocBtn = document.getElementById('addDoctorBtn');
        this.addDocForm = document.getElementById('addDoctorForm');
        this.closeDocBtn = document.getElementById('closeDocModal');
        
        this.init();
    }

    init() {
        this.renderAppointments();
        this.renderPatients();
        this.renderDoctors();
        this.renderAnalytics();
        this.exportBtn?.addEventListener('click', () => this.exportPDF());
        this.search?.addEventListener('input', () => this.renderAppointments());
        
        // Doctor Management
        this.addDocBtn?.addEventListener('click', () => window.securityManager.toggleDocModal(true));
        this.closeDocBtn?.addEventListener('click', () => window.securityManager.toggleDocModal(false));
        this.addDocForm?.addEventListener('submit', (e) => this.handleAddDoctor(e));
    }

    switchTab(tabId, btn) {
        // Toggle tab buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle tab content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');

        if (tabId === 'analytics') this.renderAnalytics();
        if (tabId === 'doctors') this.renderDoctors();
    }

    getAppointments() {
        let apps = JSON.parse(localStorage.getItem('appointments_list') || '[]');
        if (apps.length === 0) {
            apps = [
                { id: 101, name: 'John Doe', email: 'john@example.com', doctor: 'Dr. Sarah Khan', date: '2024-03-20', time: '10:00 AM', status: 'Confirmed' },
                { id: 102, name: 'Jane Smith', email: 'jane@example.com', doctor: 'Dr. Ahmed Ali', date: '2024-03-21', time: '11:30 AM', status: 'Pending' }
            ];
            localStorage.setItem('appointments_list', JSON.stringify(apps));
        }
        return apps;
    }

    renderAppointments() {
        if (!this.body) return;
        const filter = this.search.value.toLowerCase();
        const apps = this.getAppointments().filter(a => 
            a.name.toLowerCase().includes(filter) || a.doctor.toLowerCase().includes(filter)
        );

        this.body.innerHTML = apps.map(app => `
            <tr>
                <td><strong>${app.name}</strong><br><small>${app.email}</small></td>
                <td>${app.doctor}</td>
                <td>${app.date}</td>
                <td>${app.time}</td>
                <td><span class="status-badge ${app.status === 'Confirmed' ? 'status-confirmed' : 'status-pending'}">${app.status}</span></td>
                <td class="admin-actions">
                    <button class="admin-btn edit" onclick="adminManager.sendReminder(${app.id})" title="Send Reminder"><i class="fas fa-bell"></i></button>
                    <button class="admin-btn edit" onclick="adminManager.sendFollowup(${app.id})" title="Send Follow-up"><i class="fas fa-comment-medical"></i></button>
                    <button class="admin-btn delete" onclick="adminManager.deleteAppointment(${app.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        document.getElementById('statBookings').innerText = apps.length;
        document.getElementById('statPatients').innerText = new Set(apps.map(a => a.name)).size;
    }

    renderPatients() {
        if (!this.patientBody) return;
        const apps = this.getAppointments();
        const patients = Array.from(new Set(apps.map(p => p.email))).map(email => {
            const pApps = apps.filter(a => a.email === email);
            return {
                name: pApps[0].name,
                email: email,
                lastVisit: pApps[0].date,
                count: pApps.length
            };
        });

        this.patientBody.innerHTML = patients.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.email}</td>
                <td>${p.lastVisit}</td>
                <td>${p.count} Appointments</td>
                <td class="admin-actions">
                    <button class="admin-btn edit" onclick="window.securityManager.showAlert('Accessing encrypted records for ${p.name}', 'success')">
                        <i class="fas fa-file-medical-alt"></i> View
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderDoctors() {
        if (!this.doctorBody) return;
        this.doctorBody.innerHTML = DOCTORS_DATA.map(doc => `
            <tr>
                <td><strong>${doc.name}</strong></td>
                <td>${doc.specialty}</td>
                <td>${doc.experience} Years</td>
                <td><i class="fas fa-star" style="color: #f1c40f;"></i> ${doc.rating}</td>
                <td class="admin-actions">
                    <button class="admin-btn delete" onclick="adminManager.deleteDoctor(${doc.id})" title="Remove Specialist">
                        <i class="fas fa-user-minus"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderAnalytics() {
        const barsContainer = document.getElementById('analyticsBars');
        if (!barsContainer) return;
        
        // Mock analytics data based on 7 days
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = [40, 65, 50, 85, 70, 30, 45]; // Represent percentage heights

        barsContainer.innerHTML = days.map((day, i) => `
            <div class="bar-wrapper">
                <div class="bar" style="height: ${values[i]}%"></div>
                <span class="bar-label">${day}</span>
            </div>
        `).join('');
    }

    sendReminder(id) {
        const app = this.getAppointments().find(a => a.id === id);
        if (app) {
            window.communicationManager.simulateEmail(`Reminder: Your appointment with ${app.doctor}`, app.email);
            window.securityManager.showAlert(`Reminder sent to ${app.name}`, 'success');
        }
    }

    sendFollowup(id) {
        const app = this.getAppointments().find(a => a.id === id);
        if (app) {
            window.communicationManager.simulateEmail(`How was your visit with ${app.doctor}?`, app.email);
            window.securityManager.showAlert(`Follow-up sent to ${app.name}`, 'success');
        }
    }

    handleAddDoctor(e) {
        e.preventDefault();
        const name = document.getElementById('newDocName').value;
        const specialty = document.getElementById('newDocSpecialty').value;
        
        console.log(`[ADMIN] Adding specialist: ${name} (${specialty})`);
        window.securityManager.showAlert(`Specialist ${name} added to roster.`, 'success');
        this.addDocForm.reset();
        window.securityManager.toggleDocModal(false);
        
        const docStat = document.getElementById('statDoctors');
        docStat.innerText = parseInt(docStat.innerText) + 1;
        this.renderDoctors();
    }

    deleteDoctor(id) {
        if (confirm('Are you sure you want to remove this specialist from the roster?')) {
            const index = DOCTORS_DATA.findIndex(d => d.id === id);
            if (index !== -1) {
                const name = DOCTORS_DATA[index].name;
                DOCTORS_DATA.splice(index, 1);
                this.renderDoctors();
                window.doctorManager?.render(DOCTORS_DATA);
                const docStat = document.getElementById('statDoctors');
                docStat.innerText = DOCTORS_DATA.length;
                window.securityManager.showAlert(`Specialist ${name} removed from roster.`, 'success');
            }
        }
    }

    deleteAppointment(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            const apps = this.getAppointments().filter(a => a.id !== id);
            localStorage.setItem('appointments_list', JSON.stringify(apps));
            this.renderAppointments();
            this.renderPatients();
            window.securityManager.showAlert('Record deleted securely.', 'success');
        }
    }

    exportPDF() {
        // Simple simulation of PDF export by triggering print with a specialized title
        const originalTitle = document.title;
        document.title = `CarePlus_Activity_Report_${new Date().toISOString().split('T')[0]}`;
        window.print();
        document.title = originalTitle;
        window.securityManager.showAlert('PDF report generated successfully.', 'success');
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // 0. Security Manager (Base for other logic)
    window.securityManager = new SecurityManager();

    // 0.1 Communication & Admin Managers (Phase 2 & 3)
    window.communicationManager = new CommunicationManager();
    window.adminManager = new AdminManager();
    window.videoManager = new VideoManager();

    // 1. Accessibility Manager (Priority)
    window.accessibilityManager = new AccessibilityManager();

    // 2. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // 3. Initialize Typewriter
    const txtElement = document.querySelector('.typewriter');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // 4. Initialize Testimonial Slider
    if (typeof TestimonialSlider !== 'undefined') {
        window.testimonialSlider = new TestimonialSlider();
    }

    // 5. Initialize Doctor Manager
    if (typeof DoctorManager !== 'undefined') {
        window.doctorManager = new DoctorManager();
    }

    // 6. Statistics Section Animations
    initStatsAnimations();

    // 7. Appointment Form Logic
    initAppointmentForm();

    // 8. Mobile Optimizations
    initMobileOptimizations();
});

// Parallax Effect Logic
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX;
    const y = e.clientY;

    shapes.forEach(shape => {
        const speed = 0.05;
        const moveX = (window.innerWidth / 2 - x) * speed;
        const moveY = (window.innerHeight / 2 - y) * speed;
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Preloader Fade Out
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 1000); // Give it a second to feel the heartbeat
});

// Mobile Menu Toggle logic
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

const toggleMenu = () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenu.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
};

mobileMenu?.addEventListener('click', toggleMenu);

// Auto-close menu on nav-link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Back to Top Logic
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    // Navbar effect
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to Top Visibility
    if (window.scrollY > 300) {
        backToTopBtn?.classList.add('active');
    } else {
        backToTopBtn?.classList.remove('active');
    }

    // Scroll Spy Logic
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Hero Particle System
function createParticles() {
    const hero = document.querySelector('.hero-particles');
    if (!hero) return;
    
    const count = 30;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 10 + 5;
        
        // Random delay
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animation = `floating ${duration}s ease-in-out ${delay}s infinite`;
        
        hero.appendChild(particle);
    }
}
createParticles();

// Statistics Section Animations & Live Updates
function initStatsAnimations() {
    // 1. Progress Bars & Pie Chart Intersection Observer
    const statSection = document.querySelector('.stats-section');
    if (!statSection) return;

    const progressFills = document.querySelectorAll('.progress-fill');
    const pieChart = document.getElementById('successRateChart');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Progress Bars
                progressFills.forEach(fill => {
                    const width = fill.getAttribute('data-width');
                    fill.style.width = width;
                });

                // Animate Pie Chart (conic gradient)
                if (pieChart) {
                    pieChart.style.background = 'conic-gradient(var(--primary) 97%, #f0f0f0 0%)';
                }
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statSection);

    // 2. Live Data Simulation
    const liveCounters = document.querySelectorAll('.live-counter');
    
    function updateLiveStats() {
        liveCounters.forEach(counter => {
            const min = parseInt(counter.getAttribute('data-min'));
            const max = parseInt(counter.getAttribute('data-max'));
            const current = parseInt(counter.innerText);
            
            // Randomly increase/decrease by 1 or 2
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            let newValue = current + change;
            
            // Keep within bounds
            if (newValue < min) newValue = min;
            if (newValue > max) newValue = max;
            
            counter.innerText = newValue;
        });

        // Loop every 3-7 seconds
        const nextTime = Math.random() * 4000 + 3000;
        setTimeout(updateLiveStats, nextTime);
    }

    // Start live simulation after a delay
    setTimeout(updateLiveStats, 5000);
}

// Counter Animation Logic
const counters = document.querySelectorAll('.counter');
const speed = 200;

const startCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const count = +el.innerText;
    const inc = target / speed;

    if (count < target) {
        el.innerText = Math.ceil(count + inc);
        setTimeout(() => startCounter(el), 1);
    } else {
        el.innerText = target;
    }
};

const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

counters.forEach(counter => counterObserver.observe(counter));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        
        // Close mobile menu on click
        navMenu.classList.remove('active');
        const icon = mobileMenu.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// // Open appointment form with selected doctor
function openAppointment(doctorName) {
    const target = document.getElementById('appointment');
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    const doctorSelect = document.getElementById('doctor-select');
    if (doctorSelect) {
        for (let option of doctorSelect.options) {
            if (option.text.includes(doctorName)) {
                option.selected = true;
                // Trigger change/input event for floating labels
                doctorSelect.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
        }
    }
}

// Appointment Form Logic & Validation
function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (!appointmentForm) return;

    const timeSlots = document.querySelectorAll('.time-slot');
    const selectedTimeInput = document.getElementById('selectedTime');
    const successModal = document.getElementById('successModal');
    
    // Time Slot Selection logic
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            timeSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedTimeInput.value = slot.getAttribute('data-time');
        });
    });

    // Real-time Validation
    const inputs = appointmentForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(input);
        });
        
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });

    function validateField(input) {
        const group = input.parentElement;
        if (input.required && !input.value.trim()) {
            group.classList.add('invalid');
            return false;
        }
        
        if (input.type === 'email' && input.value) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(input.value)) {
                group.classList.add('invalid');
                return false;
            }
        }
        
        group.classList.remove('invalid');
        return true;
    }

    // Form Submission
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Rate Limiting Check
        if (!window.securityManager.checkRateLimit()) return;

        // 2. CAPTCHA Validation
        const captchaInput = document.getElementById('captchaInput');
        if (!window.securityManager.validateCaptcha(captchaInput.value)) {
            captchaInput.parentElement.classList.add('invalid');
            window.securityManager.showAlert('Security code is incorrect. Please try again.', 'error');
            window.securityManager.generateCaptcha();
            captchaInput.value = '';
            return;
        }

        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });

        if (!selectedTimeInput.value) {
            window.securityManager.showAlert('Please select a time slot.', 'error');
            isValid = false;
        }

        if (isValid) {
            // 3. Input Sanitization & Encryption Simulation
            const formData = {
                name: window.securityManager.sanitize(document.getElementById('name').value),
                email: window.securityManager.sanitize(document.getElementById('email').value),
                phone: window.securityManager.sanitize(document.getElementById('phone').value),
                doctor: document.getElementById('doctor-select').value,
                date: document.getElementById('date').value,
                time: selectedTimeInput.value,
                message: window.securityManager.sanitize(document.getElementById('message').value)
            };

            console.log('[SECURITY] Encrypting data for secure transmission...');
            const encryptedData = btoa(JSON.stringify(formData)); // Simple simulation of encryption
            console.log('[SECURITY] Encrypted Payload:', encryptedData);

            showSuccess(formData);
        }
    });

    function showSuccess(data) {
        // Save to localStorage for Admin Dashboard
        const apps = JSON.parse(localStorage.getItem('appointments_list') || '[]');
        const newApp = {
            id: Date.now(),
            ...data,
            status: 'Confirmed'
        };
        apps.unshift(newApp);
        localStorage.setItem('appointments_list', JSON.stringify(apps));

        // Populate modal data
        document.getElementById('confirmName').innerText = data.name;
        document.getElementById('confirmDoctor').innerText = data.doctor;
        document.getElementById('confirmDate').innerText = data.date;
        document.getElementById('confirmTime').innerText = data.time;

        // Show modal
        successModal.classList.add('active');
        
        // Simulation: Confirmation Email
        window.communicationManager?.simulateEmail('Appointment Confirmation - CarePlus', data.email);
        
        // Reset form & CAPTCHA
        appointmentForm.reset();
        timeSlots.forEach(s => s.classList.remove('selected'));
        if (selectedTimeInput) selectedTimeInput.value = '';
        window.securityManager.generateCaptcha();

        // Refresh admin view if open
        window.adminManager?.renderAppointments();
    }
}

// Modal Close Function
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// Testimonial Slider Implementation
class TestimonialSlider {
    constructor() {
        this.slider = document.getElementById('testimonialSlider');
        if (!this.slider) return;

        this.cards = this.slider.querySelectorAll('.testimonial-card');
        this.dotsContainer = document.getElementById('sliderDots');
        this.prevBtn = document.getElementById('prevTestimonial');
        this.nextBtn = document.getElementById('nextTestimonial');
        
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;

        this.init();
    }

    init() {
        // Generate dots
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Swipe support
        this.slider.addEventListener('touchstart', (e) => this.touchStart(e));
        this.slider.addEventListener('touchmove', (e) => this.touchMove(e));
        this.slider.addEventListener('touchend', () => this.touchEnd());

        // Mouse drag support (for desktop)
        this.slider.addEventListener('mousedown', (e) => this.dragStart(e));
        this.slider.addEventListener('mousemove', (e) => this.dragMove(e));
        this.slider.addEventListener('mouseup', () => this.dragEnd());
        this.slider.addEventListener('mouseleave', () => this.dragEnd());

        // Auto play
        this.startAutoPlay();
        
        // Pause auto play on hover
        this.slider.parentElement.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.parentElement.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    goToSlide(index) {
        this.currentIndex = index;
        const offset = -this.currentIndex * 100;
        this.slider.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToSlide(this.currentIndex);
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.goToSlide(this.currentIndex);
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    // Touch/Swipe Logic
    touchStart(e) {
        this.startX = e.touches[0].clientX;
        this.stopAutoPlay();
    }

    touchMove(e) {
        if (!this.startX) return;
        const currentX = e.touches[0].clientX;
        const diff = this.startX - currentX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) this.nextSlide();
            else this.prevSlide();
            this.startX = null;
        }
    }

    touchEnd() {
        this.startX = null;
        this.startAutoPlay();
    }

    // Drag Logic
    dragStart(e) {
        this.isDragging = true;
        this.startX = e.pageX;
        this.stopAutoPlay();
    }

    dragMove(e) {
        if (!this.isDragging) return;
        const currentX = e.pageX;
        const diff = this.startX - currentX;
        
        if (Math.abs(diff) > 100) {
            if (diff > 0) this.nextSlide();
            else this.prevSlide();
            this.dragEnd();
        }
    }

    dragEnd() {
        this.isDragging = false;
        this.startAutoPlay();
    }
}

// --- MOBILE OPTIMIZATIONS ---
function initMobileOptimizations() {
    let touchStartY = 0;
    let touchStartX = 0;
    const sections = ['home', 'about', 'stats', 'testimonials', 'services', 'doctors', 'appointment'];
    
    // Pull-to-refresh simulation
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const yDiff = touchEndY - touchStartY;
        const xDiff = touchEndX - touchStartX;

        // Pull down at top (simulation)
        if (window.scrollY === 0 && yDiff > 150) {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.remove('fade-out');
                setTimeout(() => preloader.classList.add('fade-out'), 1500);
            }
        }

        // Horizontal Swipe for Section Navigation
        if (Math.abs(xDiff) > 150 && Math.abs(yDiff) < 50) {
            const currentSectionId = window.location.hash.replace('#', '') || 'home';
            let currentIndex = sections.indexOf(currentSectionId);
            
            if (currentIndex !== -1) {
                if (xDiff < 0) { // Swipe Left (Next)
                    currentIndex = Math.min(currentIndex + 1, sections.length - 1);
                } else { // Swipe Right (Prev)
                    currentIndex = Math.max(currentIndex - 1, 0);
                }
                const targetId = sections[currentIndex];
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                window.location.hash = targetId;
            }
        }
    }, { passive: true });
}

// --- DOCTOR MANAGEMENT & INTERACTIVITY ---
const DOCTORS_DATA = [
    {
        id: 1,
        name: "Dr. Sarah Khan",
        specialty: "Cardiologist",
        experience: 12,
        rating: 4.8,
        image: "https://via.placeholder.com/400x500"
    },
    {
        id: 2,
        name: "Dr. Ahmed Ali",
        specialty: "Neurologist",
        experience: 10,
        rating: 5.0,
        image: "https://via.placeholder.com/400x500"
    },
    {
        id: 3,
        name: "Dr. Fatima Hassan",
        specialty: "Pediatrician",
        experience: 8,
        rating: 4.9,
        image: "https://via.placeholder.com/400x500"
    },
    {
        id: 4,
        name: "Dr. James Wilson",
        specialty: "Orthopedic",
        experience: 15,
        rating: 4.7,
        image: "https://via.placeholder.com/400x500"
    },
    {
        id: 5,
        name: "Dr. Maria Garcia",
        specialty: "Cardiologist",
        experience: 9,
        rating: 4.6,
        image: "https://via.placeholder.com/400x500"
    },
    {
        id: 6,
        name: "Dr. Robert Chen",
        specialty: "Neurologist",
        experience: 14,
        rating: 4.9,
        image: "https://via.placeholder.com/400x500"
    }
];

class DoctorManager {
    constructor() {
        this.grid = document.getElementById('doctorGrid');
        this.searchInput = document.getElementById('doctorSearch');
        this.specialtyFilter = document.getElementById('specialtyFilter');
        this.sortSelect = document.getElementById('doctorSort');
        this.favorites = JSON.parse(localStorage.getItem('favDoctors')) || [];
        
        this.init();
    }

    init() {
        if (!this.grid) return;
        
        this.render(DOCTORS_DATA);
        this.addEventListeners();
    }

    addEventListeners() {
        this.searchInput?.addEventListener('input', () => this.handleControls());
        this.specialtyFilter?.addEventListener('change', () => this.handleControls());
        this.sortSelect?.addEventListener('change', () => this.handleControls());
    }

    handleControls() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const specialty = this.specialtyFilter.value;
        const sortBy = this.sortSelect.value;

        let filtered = DOCTORS_DATA.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchTerm) || 
                                doc.specialty.toLowerCase().includes(searchTerm);
            const matchesSpecialty = specialty === 'all' || doc.specialty === specialty;
            return matchesSearch && matchesSpecialty;
        });

        if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'experience') {
            filtered.sort((a, b) => b.experience - a.experience);
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        this.render(filtered);
    }

    toggleFavorite(id, btn) {
        const index = this.favorites.indexOf(id);
        if (index === -1) {
            this.favorites.push(id);
            btn.classList.add('active');
        } else {
            this.favorites.splice(index, 1);
            btn.classList.remove('active');
        }
        localStorage.setItem('favDoctors', JSON.stringify(this.favorites));
    }

    async shareDoctor(name, specialty) {
        const shareData = {
            title: `Check out ${name}`,
            text: `Look at this amazing ${specialty} at CarePlus Medical Center!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                alert('Connection link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    }

    render(data) {
        this.grid.innerHTML = data.map(doc => `
            <div class="doctor-card" data-aos="zoom-in">
                <div class="doctor-image">
                    <img src="${doc.image}" alt="${doc.name}" loading="lazy">
                    <div class="experience-badge">${doc.experience}+ Years</div>
                    <div class="card-actions">
                        <button class="action-btn fav-btn ${this.favorites.includes(doc.id) ? 'active' : ''}" 
                                onclick="doctorManager.toggleFavorite(${doc.id}, this)">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn share-btn" 
                                onclick="doctorManager.shareDoctor('${doc.name}', '${doc.specialty}')">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="doctor-info">
                    <h3>${doc.name}</h3>
                    <p class="specialty">${doc.specialty}</p>
                    <div class="rating">
                        ${this.generateStars(doc.rating)}
                        <span>(${doc.rating})</span>
                    </div>
                    <button class="book-btn" onclick="openAppointment('${doc.name}')">
                        Book Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    generateStars(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 !== 0;
        let html = '';
        for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
        if (half) html += '<i class="fas fa-star-half-alt"></i>';
        return html;
    }
}

// Print Functionality for Appointment
const printAppointment = () => {
    window.print();
};

// Modal Close Function
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.classList.remove('active');
}

// End of script