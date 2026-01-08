// AR Christmas Market Navigator - Main Script

class ARNavigator {
    constructor() {
        this.currentView = 'home';
        this.favorites = [];
        this.activeNavigation = null;
        this.gazeDuration = 1000; // 1 second for eye-tracking
        this.gazeTimeout = null;
        this.shops = this.initializeShops();
        
        this.init();
    }

    initializeShops() {
        return {
            'burgers': {
                name: 'BURGERS',
                type: 'food',
                queue: 'red',
                menu: [
                    { item: 'HAMBURGER', price: '€12' },
                    { item: 'CHEESEBURG', price: '€15' },
                    { item: 'FRITES', price: '€7' }
                ],
                position: { left: '30%', top: '45%' }
            },
            'churros': {
                name: 'Churros',
                type: 'food',
                queue: 'green',
                menu: [
                    { item: 'CHURROS', price: '€5' },
                    { item: 'CHOCOLATE DIP', price: '€2' }
                ],
                position: { left: '65%', top: '35%' }
            },
            'wein': {
                name: 'Wein',
                type: 'drink',
                queue: 'yellow',
                menu: [
                    { item: 'RED WINE', price: '€8' },
                    { item: 'WHITE WINE', price: '€8' }
                ],
                position: { left: '15%', top: '25%' }
            },
            'gluhwein': {
                name: 'Glühwein',
                type: 'drink',
                queue: 'green',
                menu: [
                    { item: 'GLÜHWEIN', price: '€6' },
                    { item: 'KINDERPUNSCH', price: '€4' }
                ],
                position: { left: '50%', bottom: '10%' }
            },
            'schwenker': {
                name: 'Schwenker',
                type: 'food',
                queue: 'yellow',
                menu: [
                    { item: 'BRATWURST', price: '€7' },
                    { item: 'SCHWENKER', price: '€10' }
                ],
                position: { right: '10%', bottom: '10%' }
            }
        };
    }

    init() {
        this.setupEventListeners();
        this.showGestureHint();
    }

    setupEventListeners() {
        // Menu options (home screen)
        document.querySelectorAll('.menu-option').forEach(option => {
            option.addEventListener('mouseenter', (e) => this.startGaze(e.currentTarget));
            option.addEventListener('mouseleave', () => this.cancelGaze());
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleMenuAction(action);
            });
        });

        // Shop labels
        document.addEventListener('click', (e) => {
            if (e.target.closest('.shop-label')) {
                const shopId = e.target.closest('.shop-label').dataset.shop;
                this.showShopDetail(shopId);
            }
        });

        // Action buttons in shop detail
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleActionButton(action);
            });
        });

        // Return home button
        document.getElementById('return-home')?.addEventListener('click', () => {
            this.returnHome();
        });

        // End navigation button
        document.getElementById('end-navigation')?.addEventListener('click', () => {
            this.endNavigation();
        });

        // Recommendation categories
        document.querySelectorAll('.rec-category').forEach(cat => {
            cat.addEventListener('mouseenter', (e) => this.startGaze(e.currentTarget));
            cat.addEventListener('mouseleave', () => this.cancelGaze());
            cat.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.handleRecommendationCategory(category);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.returnHome();
            }
            if (e.key === 'h' || e.key === 'H') {
                this.showGestureHint();
            }
        });

        // Simulate head shake gesture (double press 'S' key)
        let shakeCount = 0;
        let shakeTimer = null;
        document.addEventListener('keydown', (e) => {
            if (e.key === 's' || e.key === 'S') {
                shakeCount++;
                if (shakeCount === 1) {
                    shakeTimer = setTimeout(() => {
                        shakeCount = 0;
                    }, 500);
                } else if (shakeCount === 2) {
                    clearTimeout(shakeTimer);
                    shakeCount = 0;
                    this.returnHome();
                }
            }
        });
    }

    startGaze(element) {
        const eyeIcon = element.querySelector('.eye-icon');
        if (!eyeIcon) return;

        const eyeFill = eyeIcon.querySelector('.eye-fill');
        if (eyeFill) {
            eyeFill.style.transition = `width ${this.gazeDuration}ms linear`;
            eyeFill.style.width = '100%';
        }

        this.gazeTimeout = setTimeout(() => {
            this.triggerGazeAction(element);
        }, this.gazeDuration);
    }

    cancelGaze() {
        clearTimeout(this.gazeTimeout);
        document.querySelectorAll('.eye-fill').forEach(fill => {
            fill.style.width = '0';
        });
    }

    triggerGazeAction(element) {
        element.click();
    }

    handleMenuAction(action) {
        this.hideAll();
        
        switch(action) {
            case 'discovery':
                this.showDiscovery();
                break;
            case 'nav':
                this.showNavigation();
                break;
            case 'our-recs':
                this.showRecommendations();
                break;
            case 'friends':
                this.showFriends();
                break;
        }
    }

    showDiscovery() {
        this.currentView = 'discovery';
        document.getElementById('discovery-mode').classList.remove('hidden');
        document.getElementById('return-home').classList.remove('hidden');
        document.getElementById('compass').classList.remove('hidden');
    }

    showNavigation() {
        this.currentView = 'navigation';
        document.getElementById('navigation-mode').classList.remove('hidden');
        document.getElementById('return-home').classList.remove('hidden');
        document.getElementById('compass').classList.remove('hidden');
        
        this.updateFavoritesList();
    }

    showRecommendations() {
        this.currentView = 'recommendations';
        document.getElementById('recommendations-mode').classList.remove('hidden');
        document.getElementById('return-home').classList.remove('hidden');
    }

    showFriends() {
        this.currentView = 'friends';
        document.getElementById('friends-mode').classList.remove('hidden');
        document.getElementById('return-home').classList.remove('hidden');
    }

    showShopDetail(shopId) {
        const shop = this.shops[shopId];
        if (!shop) return;

        this.currentShop = shopId;

        // Update shop detail content
        document.getElementById('detail-shop-name').textContent = shop.name;
        
        const menuSection = document.querySelector('.menu-section');
        const menuItems = menuSection.querySelectorAll('.menu-item');
        
        // Update menu items
        shop.menu.forEach((item, index) => {
            if (menuItems[index]) {
                menuItems[index].innerHTML = `
                    <span>${index + 1}. ${item.item}</span>
                    <span>${item.price}</span>
                `;
            }
        });

        // Update queue indicator
        const queueIndicator = document.getElementById('detail-queue');
        queueIndicator.className = 'queue-indicator ' + shop.queue;

        // Check if already favorited
        const favoriteBtn = document.getElementById('favorite-btn');
        const starIcon = favoriteBtn.querySelector('.star-icon');
        if (this.favorites.includes(shopId)) {
            starIcon.textContent = '★';
            starIcon.classList.add('filled');
        } else {
            starIcon.textContent = '☆';
            starIcon.classList.remove('filled');
        }

        // Hide discovery labels, show detail
        document.querySelector('.shop-labels').style.opacity = '0';
        document.getElementById('shop-detail').classList.remove('hidden');
    }

    handleActionButton(action) {
        switch(action) {
            case 'favorite':
                this.toggleFavorite();
                break;
            case 'navigate':
                this.startNavigation();
                break;
            case 'share':
                this.shareLocation();
                break;
        }
    }

    toggleFavorite() {
        const shopId = this.currentShop;
        const favoriteBtn = document.getElementById('favorite-btn');
        const starIcon = favoriteBtn.querySelector('.star-icon');

        if (this.favorites.includes(shopId)) {
            // Remove from favorites
            this.favorites = this.favorites.filter(id => id !== shopId);
            starIcon.textContent = '☆';
            starIcon.classList.remove('filled');
        } else {
            // Add to favorites
            this.favorites.push(shopId);
            starIcon.textContent = '★';
            starIcon.classList.add('filled');
        }

        this.updateFavoritesList();
    }

    updateFavoritesList() {
        const favoritesContent = document.getElementById('favorites-content');
        
        if (this.favorites.length === 0) {
            favoritesContent.innerHTML = `
                <p class="empty-message">use the Discovery tab to add locations!</p>
                <div class="discover-hint">
                    <span class="arrow-hint">→</span>
                    <span>discovery</span>
                </div>
            `;
        } else {
            favoritesContent.innerHTML = this.favorites.map(shopId => {
                const shop = this.shops[shopId];
                return `
                    <div class="favorite-item" data-shop="${shopId}">
                        <span>${shop.name}</span>
                        <div class="favorite-progress"></div>
                    </div>
                `;
            }).join('');

            // Add click handlers to favorite items
            document.querySelectorAll('.favorite-item').forEach(item => {
                item.addEventListener('mouseenter', (e) => {
                    const progress = e.currentTarget.querySelector('.favorite-progress');
                    progress.style.width = '100%';
                });
                item.addEventListener('mouseleave', (e) => {
                    const progress = e.currentTarget.querySelector('.favorite-progress');
                    progress.style.width = '0';
                });
                item.addEventListener('click', (e) => {
                    const shopId = e.currentTarget.dataset.shop;
                    this.startNavigationTo(shopId);
                });
            });
        }
    }

    startNavigation() {
        this.startNavigationTo(this.currentShop);
    }

    startNavigationTo(shopId) {
        this.activeNavigation = shopId;
        const shop = this.shops[shopId];

        // Hide other elements
        document.getElementById('favorites-list').classList.add('hidden');
        document.getElementById('shop-detail').classList.add('hidden');
        
        // Show active navigation
        document.getElementById('active-nav').classList.remove('hidden');
        document.getElementById('end-navigation').classList.remove('hidden');
        
        // Update navigation card
        document.getElementById('nav-shop-name').textContent = shop.name;
        
        // Start progress animation
        const progress = document.getElementById('nav-progress');
        progress.style.animation = 'progress 3s infinite';

        // Show breadcrumbs
        this.showBreadcrumbs();

        // Update holographic marker position (simulate)
        this.updateHoloMarker();
    }

    showBreadcrumbs() {
        const trail = document.getElementById('breadcrumb-trail');
        trail.innerHTML = '';
        
        let count = 0;
        const breadcrumbInterval = setInterval(() => {
            if (count >= 5) {
                clearInterval(breadcrumbInterval);
                return;
            }
            
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'breadcrumb';
            trail.appendChild(breadcrumb);
            count++;
        }, 600);
    }

    updateHoloMarker() {
        const marker = document.getElementById('holo-marker');
        marker.style.display = 'block';
    }

    endNavigation() {
        this.activeNavigation = null;
        document.getElementById('active-nav').classList.add('hidden');
        document.getElementById('end-navigation').classList.add('hidden');
        document.getElementById('favorites-list').classList.remove('hidden');
        
        // Clear breadcrumbs
        document.getElementById('breadcrumb-trail').innerHTML = '';
    }

    shareLocation() {
        // Simulate sharing
        alert(`Shared ${this.shops[this.currentShop].name} with friends!`);
    }

    handleRecommendationCategory(category) {
        if (category === 'quick-eats') {
            document.getElementById('recs-categories').classList.add('hidden');
            document.getElementById('quick-eats-results').classList.remove('hidden');
        }
        // Add other categories as needed
    }

    returnHome() {
        this.hideAll();
        document.getElementById('home-menu').classList.remove('hidden');
        this.currentView = 'home';
        this.currentShop = null;
        
        // Reset shop labels opacity
        document.querySelectorAll('.shop-labels').forEach(labels => {
            labels.style.opacity = '1';
        });
    }

    hideAll() {
        const views = [
            'home-menu',
            'discovery-mode',
            'shop-detail',
            'navigation-mode',
            'recommendations-mode',
            'friends-mode',
            'return-home',
            'end-navigation',
            'compass',
            'active-nav',
            'quick-eats-results'
        ];

        views.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
            }
        });

        // Show home menu if returning to home
        if (this.currentView === 'home') {
            document.getElementById('home-menu').classList.remove('hidden');
        }

        // Reset recommendation categories
        document.getElementById('recs-categories')?.classList.remove('hidden');
    }

    showGestureHint() {
        const hint = document.getElementById('gesture-hint');
        hint.style.display = 'block';
        
        setTimeout(() => {
            hint.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            hint.style.opacity = '0';
            setTimeout(() => {
                hint.style.display = 'none';
            }, 300);
        }, 5000);
    }
}

// Initialize the AR Navigator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigator = new ARNavigator();
    
    // Make it globally accessible for debugging
    window.arNavigator = navigator;
    
    console.log('AR Christmas Market Navigator initialized!');
    console.log('Press "H" to show gesture hints');
    console.log('Press "S" twice quickly to simulate head shake (return home)');
    console.log('Press "Escape" to return home');
});
