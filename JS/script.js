document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const gamesContainer = document.querySelector('.games__container');
    const allGames = document.querySelectorAll('.games__game');
    const hiddenGames = document.querySelectorAll('.games__game--hidden');
    
    // Определяем, сколько игр показывать в зависимости от ширины экрана
    function getVisibleCount() {
        return window.innerWidth <= 768 ? 6 : 5; // На мобилке 6 (2 ряда по 3), на десктопе 5
    }
    
    // Функция для обновления видимости игр
    function updateGamesVisibility(showAll = false) {
        const visibleCount = getVisibleCount();
        
        allGames.forEach((game, index) => {
            if (index < visibleCount) {
                // Первые N игр всегда видны
                game.style.display = ''; // Возвращаем к CSS-правилам
                game.classList.remove('games__game--hidden');
            } else {
                // Остальные скрыты, если showAll = false
                if (showAll) {
                    game.style.display = ''; // Показываем все
                    game.classList.remove('games__game--hidden');
                } else {
                    game.style.display = 'none'; // Скрываем
                    game.classList.add('games__game--hidden');
                }
            }
        });
        
        // Меняем текст кнопки
        if (showAll) {
            showMoreBtn.textContent = 'Скрыть';
        } else {
            showMoreBtn.textContent = 'Показать еще';
        }
    }
    
    // При загрузке показываем первые 6 (на мобилке) или 5 (на десктопе)
    updateGamesVisibility(false);
    
    // При изменении размера окна пересчитываем
    window.addEventListener('resize', function() {
        // Проверяем, не нажата ли кнопка "Показать еще"
        const isShowingAll = showMoreBtn.textContent === 'Скрыть';
        
        if (!isShowingAll) {
            updateGamesVisibility(false);
        } else {
            // Если показаны все, просто обновляем отображение без скрытия
            const visibleCount = getVisibleCount();
            allGames.forEach((game, index) => {
                if (index < visibleCount) {
                    game.style.display = '';
                    game.classList.remove('games__game--hidden');
                } else {
                    // Оставляем как есть
                }
            });
        }
    });
    
    // Обработчик клика по кнопке
    showMoreBtn.addEventListener('click', function() {
        const isShowingAll = this.textContent === 'Скрыть';
        updateGamesVisibility(!isShowingAll);
    });
});
// Конфигурация Telegram бота
const TELEGRAM_CONFIG = {
    token: '8249863570:AAFENmrMrcjt9_qZ36iKMfcUWZZ59FqsYhU',
    chatId: '527400841'
};

// Функция для модального окна заявки
function initApplicationModal() {
    const modal = document.getElementById('applicationModal');

    // Находим ВСЕ кнопки "ОСТАВИТЬ ЗАЯВКУ"
    const openBtns = document.querySelectorAll('.header__banner-button');

    const closeBtn = document.querySelector('.modal__close');
    const form = document.getElementById('applicationForm');
    const submitBtn = document.getElementById('submitButton');

    // Проверяем, что элементы найдены
    if (!modal || openBtns.length === 0 || !closeBtn || !form) {
        console.error('Не найдены элементы модального окна');
        return;
    }

    // Открытие модального окна
    // Теперь обработчик устанавливается на КАЖДУЮ кнопку
    openBtns.forEach(function(openBtn) {
        openBtn.addEventListener('click', function(event) {
            event.preventDefault();

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        form.reset();
    });

    // Закрытие при клике вне окна
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            form.reset();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            form.reset();
        }
    });

    // Маска для телефона
    const phoneInput = document.getElementById('userPhone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value
                .replace(/\D/g, '')
                .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

            e.target.value =
                '+7' +
                (x[2] ? ' (' + x[2] : '') +
                (x[3] ? ') ' + x[3] : '') +
                (x[4] ? '-' + x[4] : '') +
                (x[5] ? '-' + x[5] : '');
        });
    }

    // Обработка отправки формы
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('userName').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const agreement = document.getElementById('userAgreement').checked;

        // Валидация
        if (!name) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }

        if (!phone || phone.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }

        if (!agreement) {
            alert(
                'Для отправки заявки необходимо согласие на обработку персональных данных'
            );
            return;
        }

        // Показываем состояние загрузки
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        try {
            // Формируем сообщение для Telegram
            const message =
                `🎮 *НОВАЯ ЗАЯВКА С САЙТА PSHOME*\n\n` +
                `👤 *Имя:* ${name}\n` +
                `📱 *Телефон:* ${phone}\n` +
                `✅ *Согласие на обработку:* получено\n` +
                `⏰ *Время заявки:* ${new Date().toLocaleString('ru-RU')}\n` +
                `🌐 *Источник:* сайт pshome.ru`;

            // Отправляем в Telegram
            const response = await sendToTelegram(message);

            if (response.ok) {
                alert(
                    `Спасибо, ${name}! Ваша заявка принята. ` +
                    `Мы свяжемся с вами в ближайшее время.`
                );

                modal.style.display = 'none';
                document.body.style.overflow = '';
                form.reset();
            } else {
                throw new Error('Ошибка отправки в Telegram');
            }

        } catch (error) {
            console.error('Ошибка отправки:', error);

            alert(
                'Произошла ошибка при отправке заявки. ' +
                'Пожалуйста, позвоните нам напрямую по номеру ' +
                '8 (904) 027-12-40'
            );

        } finally {
            // Восстанавливаем кнопку
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    });
}

// Функция отправки в Telegram
async function sendToTelegram(message) {
    console.log('Отправка сообщения в Telegram:', message);
    
    return await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.chatId,
            text: message,
            parse_mode: 'Markdown'
        })
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем модальное окно');
    initApplicationModal();
});
// Функция для инициализации всех форм аренды
function initRentalModals() {
    // PS4 форма
    initRentalModal('ps4', 'PlayStation 4');
    
    // PS5 форма  
    initRentalModal('ps5', 'PlayStation 5');
    
    // PS VR2 форма
    initRentalModal('vr2', 'PS VR2');
}

// Универсальная функция для создания формы аренды
function initRentalModal(deviceType, deviceName) {
    const modal = document.getElementById(`${deviceType}Modal`);
    const openButtons = document.querySelectorAll(`.price__card:nth-child(${getCardIndex(deviceType)}) .price__button`);
    const closeBtn = modal.querySelector('.modal__close');
    const form = document.getElementById(`${deviceType}Form`);
    const submitBtn = form.querySelector('.form__button');

    // Открытие модального окна при нажатии на кнопку
    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        form.reset();
    });

    // Закрытие при клике вне окна
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            form.reset();
        }
    });

    // Маска для телефона
    const phoneInput = document.getElementById(`${deviceType}Phone`);
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = '+7' + (x[2] ? ' (' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }

    // Обработка отправки формы
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const name = document.getElementById(`${deviceType}Name`).value.trim();
        const phone = document.getElementById(`${deviceType}Phone`).value.trim();
        const agreement = document.getElementById(`${deviceType}Agreement`).checked;
        
        // Валидация
        if (!name) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }
        
        if (!phone || phone.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        if (!agreement) {
            alert('Для бронирования необходимо согласие на обработку персональных данных');
            return;
        }
        
        // Показываем состояние загрузки
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Формируем сообщение для Telegram с указанием устройства
            const message = `🎮 *ЗАЯВКА НА АРЕНДУ ${deviceName.toUpperCase()}*\n\n👤 *Имя:* ${name}\n📱 *Телефон:* ${phone}\n🎯 *Устройство:* ${deviceName}\n✅ *Согласие на обработку:* получено\n⏰ *Время заявки:* ${new Date().toLocaleString('ru-RU')}\n🌐 *Источник:* сайт pshome.ru`;

            // Отправляем в Telegram
            const response = await sendToTelegram(message);
            
            if (response.ok) {
                alert(`Спасибо, ${name}! Ваша заявка на аренду ${deviceName} принята. Мы свяжемся с вами в ближайшее время.`);
                modal.style.display = 'none';
                document.body.style.overflow = '';
                form.reset();
            } else {
                throw new Error('Ошибка отправки в Telegram');
            }
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, позвоните нам напрямую по номеру 8 (904) 027-12-40');
        } finally {
            // Восстанавливаем кнопку
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Функция для определения индекса карточки
function getCardIndex(deviceType) {
    const cardIndexes = {
        'ps4': 1,
        'ps5': 2, 
        'vr2': 3
    };
    return cardIndexes[deviceType] || 1;
}

// Обновите инициализацию
document.addEventListener('DOMContentLoaded', function() {
    initApplicationModal();    // Главная форма
    initRentalModals();        // Формы аренды
});
```js
```js
// ===== СМАРТ-СЛАЙДЕР =====
document.addEventListener('DOMContentLoaded', function () {

    const slider = {
        track: document.getElementById('sliderTrack'),
        slides: document.querySelectorAll('.slider__slide'),
        prevBtn: document.querySelector('.slider__btn--prev'),
        nextBtn: document.querySelector('.slider__btn--next'),
        dotsContainer: document.getElementById('sliderDots'),

        currentIndex: 0,
        totalSlides: 0,
        interval: null,
        autoplayDelay: 12000,
        isTransitioning: false,

        init() {
            // Проверяем, что слайдер существует
            if (!this.track || this.slides.length === 0) {
                console.error('Слайдер не найден');
                return;
            }

            this.totalSlides = this.slides.length;

            // Предзагрузка фоновых изображений
            this.preloadImages();

            // Создаём клон ПЕРВОГО слайда
            // Было:
            // [1] [2]
            //
            // Станет:
            // [1] [2] [1-клон]
            const firstClone = this.slides[0].cloneNode(true);
            this.track.appendChild(firstClone);

            // Создаём точки
            this.createDots();
            this.updateDots();

            // Кнопка НАЗАД
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.prev();
                });
            }

            // Кнопка ВПЕРЁД
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.next();
                });
            }

            // Автоплей
            this.startAutoplay();

            // Пауза при наведении
            this.track.addEventListener('mouseenter', () => {
                this.stopAutoplay();
            });

            this.track.addEventListener('mouseleave', () => {
                this.startAutoplay();
            });

            // Клавиатура
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') {
                    this.next();
                }

                if (e.key === 'ArrowLeft') {
                    this.prev();
                }
            });

            // Свайп
            this.initSwipe();

            console.log(
                `Слайдер запущен. Слайдов: ${this.totalSlides}`
            );
        },

        // =====================================================
        // ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ
        // =====================================================
        preloadImages() {

            this.slides.forEach(slide => {

                const background =
                    getComputedStyle(slide).backgroundImage;

                if (!background || background === 'none') {
                    return;
                }

                const match =
                    background.match(/url\(["']?(.*?)["']?\)/);

                if (match && match[1]) {

                    const image = new Image();

                    image.src = match[1];

                    // Если картинка уже в кэше,
                    // браузер сразу её использует
                    image.onload = () => {
                        console.log(
                            'Изображение загружено:',
                            match[1]
                        );
                    };
                }
            });
        },

        // =====================================================
        // СОЗДАНИЕ ТОЧЕК
        // =====================================================
        createDots() {

            if (!this.dotsContainer) {
                return;
            }

            this.dotsContainer.innerHTML = '';

            for (let i = 0; i < this.totalSlides; i++) {

                const dot = document.createElement('button');

                dot.className = 'slider__dot';

                dot.setAttribute(
                    'aria-label',
                    `Перейти к слайду ${i + 1}`
                );

                dot.dataset.index = i;

                dot.addEventListener('click', () => {
                    this.goTo(i);
                });

                this.dotsContainer.appendChild(dot);
            }
        },

        // =====================================================
        // ОБНОВЛЕНИЕ ТОЧЕК
        // =====================================================
        updateDots() {

            if (!this.dotsContainer) {
                return;
            }

            const dots =
                this.dotsContainer.querySelectorAll(
                    '.slider__dot'
                );

            dots.forEach((dot, index) => {

                dot.classList.toggle(
                    'active',
                    index === this.currentIndex
                );

            });
        },

        // =====================================================
        // ПЕРЕХОД К СЛАЙДУ
        // =====================================================
        goTo(index) {

            // Не разрешаем запускать второй переход,
            // пока первый ещё идёт
            if (this.isTransitioning) {
                return;
            }

            // Защита от неправильного индекса
            if (index < 0 || index > this.totalSlides) {
                return;
            }

            this.isTransitioning = true;

            // Плавная анимация
            this.track.style.transition =
                'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            // Двигаем трек
            this.track.style.transform =
                `translateX(-${index * 100}%)`;

            // =================================================
            // ОБЫЧНЫЙ СЛАЙД
            // =================================================
            if (index < this.totalSlides) {

                this.currentIndex = index;

                this.updateDots();

                setTimeout(() => {
                    this.isTransitioning = false;
                }, 600);

                return;
            }

            // =================================================
            // ПОСЛЕДНИЙ ПЕРЕХОД
            //
            // [1] [2] [1-клон]
            //          ↑
            //      сюда плавно едем
            //
            // После показа клона незаметно возвращаемся
            // на настоящий первый слайд.
            // =================================================
            setTimeout(() => {

                // Выключаем анимацию
                this.track.style.transition = 'none';

                // Возвращаемся на настоящий первый слайд
                this.track.style.transform =
                    'translateX(0)';

                this.currentIndex = 0;

                this.updateDots();

                // Даём браузеру применить положение
                requestAnimationFrame(() => {

                    this.track.style.transition =
                        'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

                    this.isTransitioning = false;

                });

            }, 600);
        },

        // =====================================================
        // ВПЕРЁД
        // =====================================================
        next() {

            if (this.isTransitioning) {
                return;
            }

            // 1 → 2
            // 2 → 1-клон
            this.goTo(this.currentIndex + 1);
        },

        // =====================================================
        // НАЗАД
        // =====================================================
        prev() {

            if (this.isTransitioning) {
                return;
            }

            // Если сейчас первый слайд,
            // переходим на последний настоящий
            if (this.currentIndex === 0) {

                this.isTransitioning = true;

                this.track.style.transition = 'none';

                // Ставим трек на клон первого слайда
                this.track.style.transform =
                    `translateX(-${this.totalSlides * 100}%)`;

                requestAnimationFrame(() => {

                    // Теперь плавно двигаемся назад
                    this.track.style.transition =
                        'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

                    this.track.style.transform =
                        `translateX(-${(this.totalSlides - 1) * 100}%)`;

                    this.currentIndex =
                        this.totalSlides - 1;

                    this.updateDots();

                    setTimeout(() => {
                        this.isTransitioning = false;
                    }, 600);

                });

                return;
            }

            // Обычный переход назад
            this.goTo(this.currentIndex - 1);
        },

        // =====================================================
        // АВТОПЛЕЙ
        // =====================================================
        startAutoplay() {

            this.stopAutoplay();

            this.interval = setInterval(() => {

                this.next();

            }, this.autoplayDelay);
        },

        // =====================================================
        // ОСТАНОВКА АВТОПЛЕЯ
        // =====================================================
        stopAutoplay() {

            if (this.interval !== null) {

                clearInterval(this.interval);

                this.interval = null;
            }
        },

        // =====================================================
        // СВАЙП
        // =====================================================
        initSwipe() {

            let startX = 0;
            let isSwiping = false;

            this.track.addEventListener(
                'touchstart',
                (e) => {

                    startX = e.touches[0].clientX;

                    isSwiping = true;

                    this.stopAutoplay();

                },
                { passive: true }
            );

            this.track.addEventListener(
                'touchend',
                (e) => {

                    if (!isSwiping) {
                        return;
                    }

                    isSwiping = false;

                    const endX =
                        e.changedTouches[0].clientX;

                    const diff =
                        startX - endX;

                    // Минимальная длина свайпа
                    if (Math.abs(diff) > 50) {

                        if (diff > 0) {

                            // Свайп влево → следующий
                            this.next();

                        } else {

                            // Свайп вправо → предыдущий
                            this.prev();

                        }
                    }

                    this.startAutoplay();

                },
                { passive: true }
            );
        }
    };

    // Запускаем слайдер
    slider.init();

});
