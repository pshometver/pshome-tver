// ============================================================
// 1. ИГРЫ — ПОКАЗАТЬ / СКРЫТЬ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const gamesContainer = document.querySelector('.games__container');
    const allGames = document.querySelectorAll('.games__game');
    const hiddenGames = document.querySelectorAll('.games__game--hidden');
    
    function getVisibleCount() {
        return window.innerWidth <= 768 ? 6 : 5;
    }
    
    function updateGamesVisibility(showAll = false) {
        const visibleCount = getVisibleCount();
        
        allGames.forEach((game, index) => {
            if (index < visibleCount) {
                game.style.display = '';
                game.classList.remove('games__game--hidden');
            } else {
                if (showAll) {
                    game.style.display = '';
                    game.classList.remove('games__game--hidden');
                } else {
                    game.style.display = 'none';
                    game.classList.add('games__game--hidden');
                }
            }
        });
        
        if (showAll) {
            showMoreBtn.textContent = 'Скрыть';
        } else {
            showMoreBtn.textContent = 'Показать еще';
        }
    }
    
    updateGamesVisibility(false);
    
    window.addEventListener('resize', function() {
        const isShowingAll = showMoreBtn.textContent === 'Скрыть';
        if (!isShowingAll) {
            updateGamesVisibility(false);
        }
    });
    
    showMoreBtn.addEventListener('click', function() {
        const isShowingAll = this.textContent === 'Скрыть';
        updateGamesVisibility(!isShowingAll);
    });
});

// ============================================================
// 2. КОНФИГУРАЦИЯ TELEGRAM
// ============================================================
const TELEGRAM_CONFIG = {
    token: '8249863570:AAFENmrMrcjt9_qZ36iKMfcUWZZ59FqsYhU',
    chatId: '527400841'
};

// ============================================================
// 3. ОТПРАВКА В TELEGRAM
// ============================================================
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

// ============================================================
// 4. МОДАЛЬНОЕ ОКНО — ГЛАВНАЯ ЗАЯВКА
// ============================================================
function initApplicationModal() {
    const modal = document.getElementById('applicationModal');
    const openBtns = document.querySelectorAll('.header__banner-button');
    const closeBtn = document.querySelector('.modal__close');
    const form = document.getElementById('applicationForm');
    const submitBtn = document.getElementById('submitButton');

    if (!modal || openBtns.length === 0 || !closeBtn || !form) {
        console.error('Не найдены элементы модального окна');
        return;
    }

    openBtns.forEach(function(openBtn) {
        openBtn.addEventListener('click', function(event) {
            event.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        form.reset();
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            form.reset();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            form.reset();
        }
    });

    const phoneInput = document.getElementById('userPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = '+7' + (x[2] ? ' (' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('userName').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const agreement = document.getElementById('userAgreement').checked;

        if (!name) {
            alert('Пожалуйста, введите ваше имя');
            return;
        }
        if (!phone || phone.length < 10) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        if (!agreement) {
            alert('Для отправки заявки необходимо согласие на обработку персональных данных');
            return;
        }

        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        try {
            const message = `🎮 *НОВАЯ ЗАЯВКА С САЙТА PSHOME*\n\n👤 *Имя:* ${name}\n📱 *Телефон:* ${phone}\n✅ *Согласие на обработку:* получено\n⏰ *Время заявки:* ${new Date().toLocaleString('ru-RU')}\n🌐 *Источник:* сайт pshome.ru`;

            const response = await sendToTelegram(message);

            if (response.ok) {
                alert(`Спасибо, ${name}! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.`);
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
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    });
}

// ============================================================
// 5. МОДАЛЬНЫЕ ОКНА — АРЕНДА (PS4, PS5, VR2)
// ============================================================
function initRentalModals() {
    initRentalModal('ps4', 'PlayStation 4');
    initRentalModal('ps5', 'PlayStation 5');
    initRentalModal('vr2', 'PS VR2');
}

function getCardIndex(deviceType) {
    const cardIndexes = {
        'ps4': 1,
        'ps5': 2,
        'vr2': 3
    };
    return cardIndexes[deviceType] || 1;
}

function initRentalModal(deviceType, deviceName) {
    const modal = document.getElementById(`${deviceType}Modal`);
    const openButtons = document.querySelectorAll(`.price__card:nth-child(${getCardIndex(deviceType)}) .price__button`);
    const closeBtn = modal ? modal.querySelector('.modal__close') : null;
    const form = document.getElementById(`${deviceType}Form`);
    const submitBtn = form ? form.querySelector('.form__button') : null;

    if (!modal || !closeBtn || !form || !submitBtn) {
        console.error(`Модальное окно ${deviceType} не найдено`);
        return;
    }

    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        form.reset();
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            form.reset();
        }
    });

    const phoneInput = document.getElementById(`${deviceType}Phone`);
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = '+7' + (x[2] ? ' (' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const name = document.getElementById(`${deviceType}Name`).value.trim();
        const phone = document.getElementById(`${deviceType}Phone`).value.trim();
        const agreement = document.getElementById(`${deviceType}Agreement`).checked;
        
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
        
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const message = `🎮 *ЗАЯВКА НА АРЕНДУ ${deviceName.toUpperCase()}*\n\n👤 *Имя:* ${name}\n📱 *Телефон:* ${phone}\n🎯 *Устройство:* ${deviceName}\n✅ *Согласие на обработку:* получено\n⏰ *Время заявки:* ${new Date().toLocaleString('ru-RU')}\n🌐 *Источник:* сайт pshome.ru`;

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
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// SWIPER ИНИЦИАЛИЗАЦИЯ (С ВАШИМИ КНОПКАМИ И ТОЧКАМИ)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mainSlider')) {
        const swiper = new Swiper('#mainSlider', {
            loop: true,
            autoplay: {
                delay: 12000,
                disableOnInteraction: false,
            },
            // ВАШИ КНОПКИ
            navigation: {
                nextEl: '.slider__btn--next',
                prevEl: '.slider__btn--prev',
            },
            // ВАШИ ТОЧКИ — ДОБАВЛЯЕМ renderBullet
            pagination: {
    el: '.swiper-pagination',
    clickable: true,
},
            speed: 600,
        });
        console.log('✅ Swiper запущен!');
    }
});

// 7. ЗАПУСК ВСЕХ ФУНКЦИЙ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем всё');
    initApplicationModal();
    initRentalModals();
});
