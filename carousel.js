var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
script.onload = function () {
    (function () {
        let STORAGE_KEY = 'favoriteProducts';
        let PRODUCTS_STORAGE_KEY = 'carouselProducts';
        let API_URL = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';

        let init = async () => {
            let products = await getProducts();
            if (products.length > 0) {
                buildHTML(products);
                buildCSS();
                manageEvents();
            }
        };

        let getProducts = async () => {
            let storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
            if (storedProducts) {
                return JSON.parse(storedProducts);
            }

            try {
                let response = await fetch(API_URL);
                let data = await response.json();
                localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(data));
                return data;
            } catch (error) {
                console.error('Error loading products:', error);
                return [];
            }
        };

        let buildHTML = (products) => {
            let html = `
                <div class="product-carousel">
                    <h2>You Might Also Like</h2>
                    <div class="carousel-wrapper">
                        <button class="nav-btn prev" disabled>&lt;</button>
                        <div class="carousel-container">
                            <div class="carousel-track">
                                ${products.map(product => `
                                    <div class="carousel-item">
                                        <a href="${product.url || '#'}" target="_blank" class="product-card">
                                            <div class="image-container">
                                                <img src="${product.img || 'https://via.placeholder.com/200x266'}" alt="${product.name}">
                                                <button class="favorite-btn" data-id="${product.id}">
                                                    <svg viewBox="0 0 24 24" class="heart-icon">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div class="product-info">
                                                <h3 class="product-name">${product.name}</h3>
                                                <span class="price">${product.price} TRY</span>
                                            </div>
                                        </a>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <button class="nav-btn next">&gt;</button>
                    </div>
                </div>
            `;

            $('.product-detail').append(html);
        };

        let buildCSS = () => {
            let css = `
                .product-carousel {
                    margin: 40px auto;
                    padding: 0;
                    max-width: 1200px;
                }

                .product-carousel h2 {
                    text-align: center;
                    margin-bottom: 24px;
                    font-size: 24px;
                    font-weight: 600;
                    color: #333;
                }

                .carousel-wrapper {
                    position: relative;
                    margin: 0 auto;
                }

                .carousel-container {
                    overflow: hidden;
                    margin: 0 40px;
                }

                .carousel-track {
                    display: flex;
                    transition: transform 0.3s ease-out;
                }

                .carousel-item {
                    flex: 0 0 calc(100% / 6.5);
                    padding: 0 10px;
                    box-sizing: border-box;
                }

                .product-card {
                    display: block;
                    text-decoration: none;
                    color: inherit;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    overflow: hidden;
                    background: white;
                    height: 100%;
                    transition: box-shadow 0.2s ease;
                }

                .product-card:hover {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .image-container {
                    position: relative;
                    padding-top: 133%;
                }

                .image-container img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .favorite-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 1;
                    padding: 6px;
                }

                .heart-icon {
                    width: 100%;
                    height: 100%;
                    fill: none;
                    stroke: #666;
                    stroke-width: 2;
                }

                .favorite-btn.active .heart-icon {
                    fill: #0066FF;
                    stroke: #0066FF;
                }

                .product-info {
                    padding: 12px;
                }

                .product-name {
                    font-size: 14px;
                    margin: 0 0 8px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    line-height: 1.4;
                    height: 2.8em;
                }

                .price {
                    display: block;
                    font-weight: bold;
                    color: #0066FF;
                    font-size: 16px;
                }

                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    border: 1px solid #e0e0e0;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 2;
                    transition: all 0.2s ease;
                }

                .nav-btn:disabled {
                    opacity: 0.5;
                    cursor: default;
                }

                .nav-btn:not(:disabled):hover {
                    background: #f5f5f5;
                }

                .nav-btn.prev {
                    left: 0;
                }

                .nav-btn.next {
                    right: 0;
                }

                @media (max-width: 1200px) {
                    .carousel-item {
                        flex: 0 0 calc(100% / 4.5);
                    }
                }

                @media (max-width: 992px) {
                    .carousel-item {
                        flex: 0 0 calc(100% / 3.5);
                    }
                }

                @media (max-width: 768px) {
                    .carousel-item {
                        flex: 0 0 calc(100% / 2.5);
                    }
                }

                @media (max-width: 576px) {
                    .carousel-item {
                        flex: 0 0 calc(100% / 1.5);
                    }
                }
            `;

            $('<style>').html(css).appendTo('head');
        };

        let manageEvents = () => {
            let $track = $('.carousel-track');
            let $container = $('.carousel-container');
            let currentIndex = 0;
            let itemWidth;
            let totalItems;
            let itemsPerView;

            function updateCarouselDimensions() {
                let containerWidth = $container.width();
                let $items = $('.carousel-item');
                totalItems = $items.length;
                
                if (window.innerWidth > 1200) itemsPerView = 6.5;
                else if (window.innerWidth > 992) itemsPerView = 4.5;
                else if (window.innerWidth > 768) itemsPerView = 3.5;
                else if (window.innerWidth > 576) itemsPerView = 2.5;
                else itemsPerView = 1.5;

                itemWidth = containerWidth / itemsPerView;
                $items.css('flex-basis', `${itemWidth}px`);
            }

            function updateNavigation() {
                let maxIndex = totalItems - itemsPerView;
                $('.nav-btn.prev').prop('disabled', currentIndex <= 0);
                $('.nav-btn.next').prop('disabled', currentIndex >= maxIndex);
            }

            function slideToIndex(index) {
                currentIndex = Math.max(0, Math.min(index, totalItems - itemsPerView));
                let translateX = -currentIndex * itemWidth;
                $track.css('transform', `translateX(${translateX}px)`);
                updateNavigation();
            }

            $('.nav-btn.prev').on('click', () => {
                slideToIndex(currentIndex - 1);
            });

            $('.nav-btn.next').on('click', () => {
                slideToIndex(currentIndex + 1);
            });

            $('.favorite-btn').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).toggleClass('active');
                
                let id = $(this).data('id');
                let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                
                if ($(this).hasClass('active')) {
                    if (!favorites.includes(id)) {
                        favorites.push(id);
                    }
                } else {
                    favorites = favorites.filter(favId => favId !== id);
                }
                
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            });

            let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            favorites.forEach(id => {
                $(`.favorite-btn[data-id="${id}"]`).addClass('active');
            });

            updateCarouselDimensions();
            updateNavigation();
            
            let resizeTimeout;
            $(window).on('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    updateCarouselDimensions();
                    slideToIndex(currentIndex);
                }, 250);
            });
        };

        init();
    })();
};