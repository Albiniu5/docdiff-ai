// UX Components for comparedocsai - vanilla JS implementations

// Social Proof Component
function createSocialProof() {
    const stats = getSocialProofStats();
    return `
        <div class="social-proof animate-in fade-in slide-in-from-bottom-2">
            <div class="social-proof-grid">
                <div class="social-proof-stat">
                    <div class="social-proof-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <div class="social-proof-value">${stats.totalUsers}</div>
                    <div class="social-proof-label">Total Visits</div>
                </div>
                <div class="social-proof-stat">
                    <div class="social-proof-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div class="social-proof-value">${stats.recentConversions}</div>
                    <div class="social-proof-label">Compared Today</div>
                </div>
                <div class="social-proof-stat">
                    <div class="social-proof-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="social-proof-value">${stats.successRate}</div>
                    <div class="social-proof-label">Accuracy Rate</div>
                </div>
            </div>
        </div>
    `;
}

// In-App Tips Component
const TIPS = [
    {
        id: 1,
        title: "Did you know?",
        message: "You can drag and drop files directly onto the upload area for faster comparison!"
    },
    {
        id: 2,
        title: "Pro Tip",
        message: "Paste text directly from your documents - no need to upload files if you already have the text!"
    },
    {
        id: 3,
        title: "Quick Tip",
        message: "Use the toggle switch to switch between file upload and text paste modes!"
    },
    {
        id: 4,
        title: "Helpful Hint",
        message: "Our AI understands context and meaning, not just text differences!"
    },
    {
        id: 5,
        title: "Did you know?",
        message: "You can compare PDF, DOCX, and TXT files side by side!"
    }
];

function showInAppTip(container) {
    const dismissedTips = getDismissedTips();
    const availableTips = TIPS.filter(tip => !dismissedTips.includes(tip.id));
    
    if (availableTips.length === 0) return null;
    
    const randomTip = availableTips[Math.floor(Math.random() * availableTips.length)];
    const tipHtml = `
        <div class="in-app-tip animate-in slide-in-from-top-2" id="inAppTip">
            <div class="in-app-tip-header">
                <div>
                    <div class="in-app-tip-title">${randomTip.title}</div>
                    <div class="in-app-tip-message">${randomTip.message}</div>
                </div>
                <button class="in-app-tip-close" onclick="dismissTip(${randomTip.id})" aria-label="Dismiss tip">×</button>
            </div>
        </div>
    `;
    
    if (container) {
        container.innerHTML = tipHtml;
        // Auto-dismiss after 8 seconds
        setTimeout(() => {
            dismissTip(randomTip.id);
        }, 8000);
    }
    
    return randomTip.id;
}

function getDismissedTips() {
    try {
        const saved = localStorage.getItem('comparedocsai_dismissedTips');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function dismissTip(tipId) {
    const dismissedTips = getDismissedTips();
    if (!dismissedTips.includes(tipId)) {
        dismissedTips.push(tipId);
        localStorage.setItem('comparedocsai_dismissedTips', JSON.stringify(dismissedTips));
    }
    const tipElement = document.getElementById('inAppTip');
    if (tipElement) {
        tipElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            tipElement.remove();
        }, 300);
    }
}

// Progress Animation Component
function showProgressAnimation(message = 'Processing...') {
    return `
        <div class="progress-animation">
            <div class="progress-spinner"></div>
            <p class="progress-message">${message}</p>
        </div>
    `;
}

// Post Conversion Feedback Component
function showPostConversionFeedback() {
    // Check if we should show feedback (not shown in last 24 hours)
    const lastFeedbackTime = localStorage.getItem('comparedocsai_lastFeedbackTime');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (lastFeedbackTime && (now - parseInt(lastFeedbackTime)) < oneDay) {
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'feedback-overlay';
    overlay.id = 'feedbackOverlay';
    overlay.innerHTML = `
        <div class="feedback-modal animate-in zoom-in">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">How was your experience?</h3>
                <button onclick="closeFeedback()" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 20px; padding: 4px; min-width: 24px; min-height: 24px;">×</button>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                Help us improve by rating your comparison experience.
            </p>
            <div class="feedback-stars" id="feedbackStars">
                ${[1, 2, 3, 4, 5].map(star => `
                    <button class="feedback-star" onclick="submitFeedback(${star})" aria-label="Rate ${star} stars">★</button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function submitFeedback(rating) {
    try {
        localStorage.setItem('comparedocsai_lastFeedbackTime', Date.now().toString());
        const feedbacks = JSON.parse(localStorage.getItem('comparedocsai_feedbackRatings') || '[]');
        feedbacks.push({ rating: rating, timestamp: Date.now() });
        localStorage.setItem('comparedocsai_feedbackRatings', JSON.stringify(feedbacks));
    } catch (e) {
        console.error('Failed to save feedback:', e);
    }
    
    // Show thank you message
    const overlay = document.getElementById('feedbackOverlay');
    if (overlay) {
        overlay.innerHTML = `
            <div class="feedback-modal animate-in zoom-in" style="text-align: center;">
                <div style="background: #d1fae5; border-radius: 50%; width: 64px; height: 64px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 32px;">✓</div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Thank you!</h3>
                <p style="color: var(--text-secondary);">Your feedback helps us improve.</p>
            </div>
        `;
        setTimeout(() => {
            closeFeedback();
        }, 2000);
    }
}

function closeFeedback() {
    const overlay = document.getElementById('feedbackOverlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Floating Action Button Component
function createFAB() {
    if (window.innerWidth >= 769) return; // Hide on desktop
    
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = '+';
    fab.id = 'mainFAB';
    fab.setAttribute('aria-label', 'Quick upload');
    
    const menu = document.createElement('div');
    menu.className = 'fab-menu';
    menu.id = 'fabMenu';
    menu.style.display = 'none';
    
    const browseItem = document.createElement('button');
    browseItem.className = 'fab-menu-item';
    browseItem.innerHTML = '📄';
    browseItem.setAttribute('aria-label', 'Browse files');
    browseItem.onclick = () => {
        const fileInput = document.getElementById('fileInputA') || document.getElementById('fileInputB');
        if (fileInput) fileInput.click();
        toggleFABMenu();
    };
    
    const cameraItem = document.createElement('button');
    cameraItem.className = 'fab-menu-item';
    cameraItem.innerHTML = '📷';
    cameraItem.setAttribute('aria-label', 'Take photo');
    cameraItem.onclick = () => {
        const fileInput = document.getElementById('fileInputA') || document.getElementById('fileInputB');
        if (fileInput) {
            const cameraInput = document.createElement('input');
            cameraInput.type = 'file';
            cameraInput.accept = 'image/*';
            cameraInput.capture = 'environment';
            cameraInput.onchange = (e) => {
                if (e.target.files[0]) {
                    fileInput.files = e.target.files;
                    fileInput.dispatchEvent(new Event('change'));
                }
            };
            cameraInput.click();
        }
        toggleFABMenu();
    };
    
    menu.appendChild(browseItem);
    menu.appendChild(cameraItem);
    
    fab.onclick = toggleFABMenu;
    
    document.body.appendChild(menu);
    document.body.appendChild(fab);
}

function toggleFABMenu() {
    const menu = document.getElementById('fabMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
    }
}

// Initialize FAB on page load
document.addEventListener('DOMContentLoaded', () => {
    createFAB();
});

// Make functions global
window.dismissTip = dismissTip;
window.submitFeedback = submitFeedback;
window.closeFeedback = closeFeedback;
