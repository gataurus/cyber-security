/**
 * i18n — Multi-language support
 */
const I18n = {
    // Текущий язык
    current: 'ru',
    
    // Доступные языки
    languages: {
        ru: 'Русский',
        en: 'English',
        de: 'Deutsch',
        fr: 'Français',
        it: 'Italiano',
        es: 'Español',
        pt: 'Português',
        zh: '中文',
        ja: '日本語',
        ko: '한국어'
    },
    
    // Инициализация
    init: function() {
        // Определяем язык
        let lang = this.getSavedLanguage() || this.getBrowserLanguage();
        
        // Если язык не поддерживается — английский
        if (!this.languages[lang]) {
            lang = 'en';
        }
        
        // Применяем
        this.setLanguage(lang);
        this.renderSwitcher();
    },
    
    // Получить сохранённый язык
    getSavedLanguage: function() {
        return localStorage.getItem('cs_lang');
    },
    
    // Определить язык браузера
    getBrowserLanguage: function() {
        const lang = navigator.language || navigator.userLanguage || 'en';
        return lang.split('-')[0]; // ru-RU → ru
    },
    
    // Установить язык
    setLanguage: function(lang) {
        this.current = lang;
        localStorage.setItem('cs_lang', lang);
        document.documentElement.lang = lang;
        
        // Переводим все элементы с атрибутом data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (Translations[lang] && Translations[lang][key]) {
                // Для placeholder
                if (el.placeholder !== undefined && key.endsWith('_placeholder')) {
                    el.placeholder = Translations[lang][key];
                }
                // Для обычного текста
                else {
                    el.textContent = Translations[lang][key];
                }
            }
        });
        
        // Переводим все элементы с атрибутом data-i18n-html (HTML внутри)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (Translations[lang] && Translations[lang][key]) {
                el.innerHTML = Translations[lang][key];
            }
        });
        
        // Обновляем переключатель
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });
    },
    
    // Отрисовать переключатель языков
    renderSwitcher: function() {
        const container = document.getElementById('lang-switcher');
        if (!container) return;
        
        let html = '<div class="lang-current" onclick="I18n.toggleSwitcher()">' + 
                   this.languages[this.current] + ' ▼</div>';
        html += '<div class="lang-dropdown" id="lang-dropdown" style="display:none;">';
        
        for (let code in this.languages) {
            html += '<div class="lang-option' + (code === this.current ? ' active' : '') + 
                    '" data-lang="' + code + '" onclick="I18n.setLanguage(\'' + code + '\')">' + 
                    this.languages[code] + '</div>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    // Показать/скрыть выпадающий список
    toggleSwitcher: function() {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    }
};

// Закрывать выпадающий список при клике вне
document.addEventListener('click', function(e) {
    if (!e.target.closest('#lang-switcher')) {
        const dropdown = document.getElementById('lang-dropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    I18n.init();
});
