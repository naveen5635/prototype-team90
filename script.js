// ============================================
// Global State Management
// ============================================
const AppState = {
    currentScreen: 'welcomeScreen',
    selectedStall: null,
    gazeTimers: {},
    environmentImages: {
        entrance: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=1920',
        center: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1920',
        stage: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=1920'
    }
};

// ============================================
// Navigation Functions
// ============================================
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        AppState.currentScreen = screenId;
    }
}

function showWelcome() {
    showScreen('welcomeScreen');
}

function showMainMenu() {
    showScreen('mainMenuScreen');
}

function showDiscovery() {
    showScreen('discoveryScreen');
    populateStallList();
}

function showSchedule() {
    showScreen('scheduleScreen');
}

function showNavigation() {
    showScreen('navigationScreen');
}

function showFriends() {
    showScreen('friendsScreen');
}

// ============================================
// Discovery Screen Functions
// ============================================
const stallsData = [
    {
        id: 1,
        name: "Alpine Lodge Glühwein",
        category: "drinks",
        icon: "🍷",
        description: "Traditional mulled wine with secret spice blend from the Alps",
        waitTime: "5 min",
        distance: "120m",
        rating: "4.8",
        price: "€4.50"
    },
    {
        id: 2,
        name: "Sausage Haven",
        category: "food",
        icon: "🌭",
        description: "Authentic German bratwurst, currywurst, and rostbratwurst",
        waitTime: "8 min",
        distance: "210m",
        rating: "4.6",
        price: "€6.00"
    },
    {
        id: 3,
        name: "Christmas Craft Corner",
        category: "crafts",
        icon: "🎨",
        description: "Handmade glass ornaments and ceramic decorations",
        waitTime: "2 min",
        distance: "85m",
        rating: "4.9",
        price: "€8-25"
    },
    {
        id: 4,
        name: "Hot Chocolate Dreams",
        category: "drinks",
        icon: "☕",
        description: "Premium Belgian hot chocolate with whipped cream",
        waitTime: "3 min",
        distance: "145m",
        rating: "4.7",
        price: "€3.80"
    },
    {
        id: 5,
        name: "Gingerbread House",
        category: "food",
        icon: "🍪",
        description: "Fresh gingerbread, lebkuchen, and stollen from family recipe",
        waitTime: "4 min",
        distance: "95m",
        rating: "4.9",
        price: "€5.50"
    },
    {
        id: 6,
        name: "Wooden Toy Workshop",
        category: "crafts",
        icon: "🪀",
        description: "Traditional handcrafted wooden toys and nutcrackers",
        waitTime: "6 min",
        distance: "230m",
        rating: "4.5",
        price: "€12-45"
    },
    {
        id: 7,
        name: "Choir Performance",
        category: "events",
        icon: "🎭",
        description: "Live Christmas carol performance by St. Mary's Church Choir",
        waitTime: "Starts 20:00",
        distance: "340m",
        rating: "5.0",
        price: "Free"
    },
    {
        id: 8,
        name: "Craft Beer Stand",
        category: "drinks",
        icon: "🍺",
        description: "Local winter craft beers - IPA, Stout, and seasonal specials",
        waitTime: "7 min",
        distance: "175m",
        rating: "4.4",
        price: "€5.50"
    },
    {
        id: 9,
        name: "Raclette & Cheese Delights",
        category: "food",
        icon: "🧀",
        description: "Swiss raclette with potatoes and pickles, cheese platters",
        waitTime: "10 min",
        distance: "265m",
        rating: "4.7",
        price: "€7.50"
    },
    {
        id: 10,
        name: "Crêperie Française",
        category: "food",
        icon: "🥞",
        description: "Sweet and savory French crêpes with various fillings",
        waitTime: "6 min",
        distance: "180m",
        rating: "4.6",
        price: "€5.00"
    },
    {
        id: 11,
        name: "Candy Cane Lane",
        category: "food",
        icon: "🍬",
        description: "Handmade candy canes, rock candy, and Christmas sweets",
        waitTime: "3 min",
        distance: "110m",
        rating: "4.8",
        price: "€2-8"
    },
    {
        id: 12,
        name: "Winter Wine Cellar",
        category: "drinks",
        icon: "🍾",
        description: "Premium German wines - Riesling, Spätburgunder, ice wine",
        waitTime: "4 min",
        distance: "290m",
        rating: "4.9",
        price: "€6-15"
    },
    {
        id: 13,
        name: "Knitwear & Woolens",
        category: "crafts",
        icon: "🧶",
        description: "Hand-knitted scarves, mittens, and traditional wool sweaters",
        waitTime: "5 min",
        distance: "195m",
        rating: "4.6",
        price: "€15-60"
    },
    {
        id: 14,
        name: "Pottery & Ceramics Studio",
        category: "crafts",
        icon: "🏺",
        description: "Beautiful handmade pottery, mugs, and ceramic art pieces",
        waitTime: "3 min",
        distance: "155m",
        rating: "4.8",
        price: "€10-40"
    },
    {
        id: 15,
        name: "Christmas Light Show",
        category: "events",
        icon: "✨",
        description: "Spectacular synchronized light and music show every hour",
        waitTime: "Next: 19:00",
        distance: "380m",
        rating: "5.0",
        price: "Free"
    },
    {
        id: 16,
        name: "Maronen & Chestnuts",
        category: "food",
        icon: "🌰",
        description: "Freshly roasted chestnuts - a classic Christmas market treat",
        waitTime: "2 min",
        distance: "75m",
        rating: "4.5",
        price: "€3.50"
    },
    {
        id: 17,
        name: "Artisan Jewelry",
        category: "crafts",
        icon: "💎",
        description: "Unique handcrafted jewelry - silver, gold, and gemstones",
        waitTime: "4 min",
        distance: "220m",
        rating: "4.7",
        price: "€20-150"
    },
    {
        id: 18,
        name: "Punch & Feuerzangenbowle",
        category: "drinks",
        icon: "🔥",
        description: "Traditional rum punch with flaming sugar cone spectacle",
        waitTime: "9 min",
        distance: "245m",
        rating: "4.9",
        price: "€5.50"
    },
    {
        id: 19,
        name: "Santa's Photo Booth",
        category: "events",
        icon: "🎅",
        description: "Professional photos with Santa Claus - perfect for families",
        waitTime: "15 min",
        distance: "310m",
        rating: "4.8",
        price: "€8.00"
    },
    {
        id: 20,
        name: "Candle Making Workshop",
        category: "events",
        icon: "🕯️",
        description: "Create your own Christmas candles - workshops every 30 min",
        waitTime: "Next: 19:15",
        distance: "270m",
        rating: "4.7",
        price: "€12.00"
    },
    {
        id: 21,
        name: "Advent Wreath Station",
        category: "crafts",
        icon: "🌿",
        description: "Custom advent wreaths with fresh pine, candles, and ribbons",
        waitTime: "7 min",
        distance: "205m",
        rating: "4.6",
        price: "€18-35"
    },
    {
        id: 22,
        name: "Turkish Kebab Grill",
        category: "food",
        icon: "🥙",
        description: "Authentic döner kebab, falafel, and Turkish specialties",
        waitTime: "11 min",
        distance: "325m",
        rating: "4.5",
        price: "€7.00"
    },
    {
        id: 23,
        name: "Spiced Apple Cider",
        category: "drinks",
        icon: "🍎",
        description: "Hot apple cider with cinnamon - non-alcoholic option",
        waitTime: "3 min",
        distance: "130m",
        rating: "4.7",
        price: "€3.00"
    },
    {
        id: 24,
        name: "Music Box Collection",
        category: "crafts",
        icon: "🎵",
        description: "Vintage and new music boxes with Christmas melodies",
        waitTime: "4 min",
        distance: "240m",
        rating: "4.9",
        price: "€25-80"
    }
];

function populateStallList() {
    const stallList = document.getElementById('stallList');
    if (!stallList) return;
    
    stallList.innerHTML = stallsData.map(stall => `
        <div class="stall-card" data-category="${stall.category}" onclick="selectStall(${stall.id})">
            <div class="stall-icon">${stall.icon}</div>
            <div class="stall-info">
                <h4>${stall.name}</h4>
                <p>${stall.description}</p>
                <div class="stall-meta">
                    <span class="wait-time">⏱ ${stall.waitTime}</span>
                    <span class="distance">📍 ${stall.distance}</span>
                    <span class="rating">⭐ ${stall.rating}</span>
                    <span class="price">💰 ${stall.price}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCategory(category) {
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => chip.classList.remove('active'));
    event.target.classList.add('active');
    
    const stallCards = document.querySelectorAll('.stall-card');
    stallCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectStall(stallId) {
    AppState.selectedStall = stallsData.find(s => s.id === stallId);
    if (!AppState.selectedStall) return;
    
    const stall = AppState.selectedStall;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'stall-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeStallModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeStallModal()">×</button>
            <div class="modal-header">
                <div class="modal-icon">${stall.icon}</div>
                <h2>${stall.name}</h2>
            </div>
            <div class="modal-body">
                <p class="modal-description">${stall.description}</p>
                <div class="modal-details">
                    <div class="detail-item">
                        <span class="detail-icon">📍</span>
                        <span class="detail-label">Distance:</span>
                        <span class="detail-value">${stall.distance}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">⏱</span>
                        <span class="detail-label">Wait Time:</span>
                        <span class="detail-value">${stall.waitTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">⭐</span>
                        <span class="detail-label">Rating:</span>
                        <span class="detail-value">${stall.rating} / 5.0</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">💰</span>
                        <span class="detail-label">Price Range:</span>
                        <span class="detail-value">${stall.price}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="primary-button" onclick="navigateToStall(${stall.id})">
                        <span>Navigate to ${stall.name}</span>
                    </button>
                    <button class="secondary-button" onclick="addToSchedule(${stall.id})">
                        <span>Add to Schedule</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeStallModal() {
    const modal = document.querySelector('.stall-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

function navigateToStall(stallId) {
    closeStallModal();
    showNavigation();
    showNotification(`🗺️ Starting navigation to stall`);
}

function addToSchedule(stallId) {
    const stall = stallsData.find(s => s.id === stallId);
    if (stall) {
        showNotification(`✓ Added ${stall.name} to your schedule`);
    }
}

// ============================================
// Schedule Functions
// ============================================
function showScheduleOptions() {
    alert('Schedule optimization feature would open a modal with options to:\n- Prioritize shortest wait times\n- Prioritize nearby locations\n- Add/remove items\n- Reorder manually');
}

function startNavToLocation(location) {
    showNavigation();
    console.log('Starting navigation to:', location);
}

// ============================================
// Navigation Functions
// ============================================
function cancelNavigation() {
    showMainMenu();
}

// ============================================
// Friends Functions
// ============================================
function locateFriend(friendId) {
    alert(`Locating ${friendId}... AR navigation would show their position and path to them.`);
}

function messageFriend(friendId) {
    alert(`Messaging ${friendId}... Voice-to-text or quick message interface would appear.`);
}

// ============================================
// Wizard Control Functions (AR Simulation)
// ============================================
function toggleWizard() {
    const wizardPanel = document.getElementById('wizardPanel');
    wizardPanel.classList.toggle('collapsed');
}

function simulateGazeSelect(target) {
    const gazeTimer = document.getElementById('gazeTimer');
    gazeTimer.classList.add('active');
    
    // Simulate 2-second gaze dwell
    setTimeout(() => {
        gazeTimer.classList.remove('active');
        
        // Trigger action based on current screen
        const currentElement = document.querySelector('.menu-card:hover, .primary-button:hover, .stall-card:hover');
        if (currentElement) {
            currentElement.click();
        }
        
        showNotification('✓ Gaze selection completed');
    }, 2000);
}

function simulateGesture(gestureType) {
    switch(gestureType) {
        case 'tap':
            showNotification('👆 Air-tap gesture detected');
            // Simulate clicking the focused element
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.click) {
                setTimeout(() => focusedElement.click(), 300);
            }
            break;
        case 'swipeLeft':
            showNotification('👈 Swipe left gesture detected');
            // Could navigate to previous screen or card
            break;
        case 'swipeRight':
            showNotification('👉 Swipe right gesture detected');
            // Could navigate to next screen or card
            break;
    }
}

function changeEnvironment(location) {
    const envImage = document.getElementById('envImage');
    const newImageUrl = AppState.environmentImages[location] || AppState.environmentImages.entrance;
    
    // Fade out
    envImage.style.opacity = '0';
    
    setTimeout(() => {
        envImage.src = newImageUrl;
        // Fade in
        envImage.style.opacity = '1';
        showNotification(`📍 Moved to ${location} area`);
    }, 500);
}

// ============================================
// Notification System
// ============================================
function showNotification(message) {
    // Remove existing notification
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(212, 175, 55, 0.95);
        color: #1A1A1A;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
        animation: slideDown 0.3s ease-out;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Keyboard Shortcuts for Testing
// ============================================
document.addEventListener('keydown', (e) => {
    // Quick navigation shortcuts for testing
    if (e.key === '1') showWelcome();
    if (e.key === '2') showMainMenu();
    if (e.key === '3') showDiscovery();
    if (e.key === '4') showSchedule();
    if (e.key === '5') showNavigation();
    if (e.key === '6') showFriends();
    
    // Wizard shortcuts
    if (e.key === 'g') simulateGazeSelect('current');
    if (e.key === 't') simulateGesture('tap');
});

// ============================================
// Initialize on Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('ChristMarket AR Prototype Loaded');
    console.log('Keyboard shortcuts: 1-6 for screens, G for gaze, T for tap');
    
    // Start with wizard panel visible but slightly collapsed
    const wizardPanel = document.getElementById('wizardPanel');
    if (wizardPanel) {
        wizardPanel.classList.add('collapsed');
    }
});

// ============================================
// Gaze Simulation Enhancement
// ============================================
let gazeTarget = null;
let gazeTimeout = null;

// Add hover listeners to interactive elements
function setupGazeSimulation() {
    const interactiveElements = document.querySelectorAll('.menu-card, .stall-card, .friend-card, .primary-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            gazeTarget = element;
            
            // Visual feedback for gaze focus
            element.style.outline = '2px solid rgba(212, 175, 55, 0.5)';
            element.style.outlineOffset = '4px';
            
            // Auto-trigger after 2 seconds of hover (simulating gaze dwell)
            gazeTimeout = setTimeout(() => {
                if (gazeTarget === element) {
                    element.click();
                    showNotification('👁 Auto-selected by gaze');
                }
            }, 2000);
        });
        
        element.addEventListener('mouseleave', (e) => {
            element.style.outline = 'none';
            if (gazeTimeout) {
                clearTimeout(gazeTimeout);
            }
            if (gazeTarget === element) {
                gazeTarget = null;
            }
        });
    });
}

// Call setup when screens change
const originalShowScreen = showScreen;
showScreen = function(screenId) {
    originalShowScreen(screenId);
    setTimeout(setupGazeSimulation, 100); // Setup after screen transition
};

// Initial setup
setTimeout(setupGazeSimulation, 500);