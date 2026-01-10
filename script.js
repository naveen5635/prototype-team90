function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


class ARNavigator {
    constructor() {
        this.currentView = 'home';
        this.favorites = [];
        this.activeNavigation = null;
        this.gazeDuration = 1000; // 1 second for eye-tracking
        this.gazeTimeout = null;
        this.shops = this.initializeShops();

        this.eyesClosed = false;

        this.init();

        // on mousedown, start blink. mouseup, end blink
        document.addEventListener('mousedown', (e) => {
            console.log(e)
            document.getElementById("blink").classList.remove("hidden");
            this.eyesClosed = true;
        });
        document.addEventListener("mouseup", () => {
            document.getElementById("blink").classList.add("hidden")
            this.eyesClosed = false;
        })

        // click + mouseshake = go home
        document.addEventListener("mouseshake",() => {
            console.log("shake", this.eyesClosed)
            if (this.eyesClosed) {
                console.log("eyes closed")
                this.returnHome();
            }
        });
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
            'souvenirs': {
                name: 'Souvenirs',
                type: 'shop',
                queue: 'green',
                menu: [
                    { item: 'MAGNET', price: '€5' },
                    { item: 'TOY', price: '€2' }
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

    async nod() {
        // move the background picture down for a bit for a bit then back up
        // before going to shop details screen
        document.getElementById("ar-background").style.transform = "translate(0px, 80px)"
        await delay(300)
        document.getElementById("ar-background").style.transform = "translate(0px, 0px)"
    }

    setupEventListeners() {
        // Menu options (home screen)
        document.querySelectorAll('.menu-option').forEach(option => {
            option.addEventListener('mouseenter', (e) => this.startGaze(e.currentTarget));
            option.addEventListener('mouseleave', () => this.cancelGaze());
        });

        // Shop labels
        document.querySelectorAll('.shop-label').forEach(btn => {
            document.addEventListener('keydown', async (e) => {
                if (e.key === 'n' || e.key === 'N') {
                    console.log(document.querySelectorAll(":hover"))
                    // uhh yea I'm hard coding this for now. this might be completely f'd but whatever
                    const label = document.querySelectorAll(":hover")[5];
                    if (label) {
                        // move the background picture down for a bit for a bit then back up
                        // before going to shop details screen
                        await this.nod();
                        const shopId = label.dataset.shop;
                        this.showShopDetail(shopId);
                    }
                }
            })
        });

        document.getElementById("hint-box").addEventListener("mouseover", () => {
            this.showGestureHint();
        })

        // Action buttons in shop detail
        // TODO: we need this to be gaze time (1sec?) not click based
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute("dataaction");
                this.handleActionButton(action);
            });
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
        const action = element.getAttribute("dataaction") ;
        this.handleMenuAction(action);
    }

    handleMenuAction(action) {
        this.hideAll();

        switch (action) {
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
        document.getElementById('compass').classList.remove('hidden');
    }

    showNavigation() {
        this.currentView = 'navigation';
        document.getElementById('navigation-mode').classList.remove('hidden');
        document.getElementById('compass').classList.remove('hidden');
        
        this.updateFavoritesList();
    }

    showRecommendations() {
        this.currentView = 'recommendations';
        document.getElementById('recommendations-mode').classList.remove('hidden');
    }

    showFriends() {
        this.currentView = 'friends';
        document.getElementById('friends-mode').classList.remove('hidden');
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
                this.handleMenuAction("nav")
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
