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
    const openBtn = document.querySelector('.header__banner-button');
    const closeBtn = document.querySelector('.modal__close');
    const form = document.getElementById('applicationForm');
    const submitBtn = document.getElementById('submitButton');

    // Проверяем, что элементы найдены
    if (!modal || !openBtn || !closeBtn || !form) {
        console.error('Не найдены элементы модального окна');
        return;
    }

    // Открытие модального окна
    openBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
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
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = '+7' + (x[2] ? ' (' + x[2] : '') + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
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
            alert('Для отправки заявки необходимо согласие на обработку персональных данных');
            return;
        }
        
        // Показываем состояние загрузки
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        try {
            // Формируем сообщение для Telegram
            const message = `🎮 *НОВАЯ ЗАЯВКА С САЙТА PSHOME*\n\n👤 *Имя:* ${name}\n📱 *Телефон:* ${phone}\n✅ *Согласие на обработку:* получено\n⏰ *Время заявки:* ${new Date().toLocaleString('ru-RU')}\n🌐 *Источник:* сайт pshome.ru`;

            // Отправляем в Telegram
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
