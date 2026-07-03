/**
 * i18n — Multi-language support
 */
const I18n = {
    current: 'ru',
    
    languages: {
        ru: { name: 'Русский', flag: '🇷🇺' },
        en: { name: 'English', flag: '🇬🇧' },
        de: { name: 'Deutsch', flag: '🇩🇪' },
        fr: { name: 'Français', flag: '🇫🇷' },
        it: { name: 'Italiano', flag: '🇮🇹' },
        es: { name: 'Español', flag: '🇪🇸' },
        pt: { name: 'Português', flag: '🇧🇷' },
        zh: { name: '中文', flag: '🇨🇳' },
        ja: { name: '日本語', flag: '🇯🇵' },
        ko: { name: '한국어', flag: '🇰🇷' }
    },
    
    init: function() {
        let lang = this.getSavedLanguage() || this.getBrowserLanguage();
        if (!this.languages[lang]) lang = 'en';
        this.setLanguage(lang);
        this.renderSwitcher();
    },
    
    getSavedLanguage: function() {
        return localStorage.getItem('cs_lang');
    },
    
    getBrowserLanguage: function() {
        const lang = navigator.language || navigator.userLanguage || 'en';
        return lang.split('-')[0];
    },
    
    setLanguage: function(lang) {
        this.current = lang;
        localStorage.setItem('cs_lang', lang);
        document.documentElement.lang = lang;
        
        // Переводим textContent
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (Translations[lang] && Translations[lang][key]) {
                el.textContent = Translations[lang][key];
            }
        });
        
        // Переводим innerHTML
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (Translations[lang] && Translations[lang][key]) {
                el.innerHTML = Translations[lang][key];
            }
        });
        
        // Переводим placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (Translations[lang] && Translations[lang][key]) {
                el.placeholder = Translations[lang][key];
            }
        });
        
        // Обновляем активный язык в переключателе
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });
        
        // Обновляем текущий язык в кнопке
        const currentBtn = document.querySelector('.lang-current span');
        if (currentBtn && this.languages[lang]) {
            currentBtn.textContent = this.languages[lang].flag + ' ' + this.languages[lang].name;
        }
        
        // Закрываем выпадающее окно
        this.closeDropdown();
    },
    
    renderSwitcher: function() {
        const container = document.getElementById('lang-switcher');
        if (!container) return;
        
        const current = this.languages[this.current] || this.languages['en'];
        
        let html = '<div class="lang-current" onclick="I18n.toggleSwitcher()">';
        html += '<span>' + current.flag + ' ' + current.name + '</span>';
        html += '<svg class="lang-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
        html += '</div>';
        html += '<div class="lang-dropdown" id="lang-dropdown" style="display:none;">';
        
        for (let code in this.languages) {
            const lang = this.languages[code];
            const active = code === this.current ? ' active' : '';
            html += '<div class="lang-option' + active + '" data-lang="' + code + '" onclick="I18n.selectLanguage(\'' + code + '\')">';
            html += '<span class="lang-flag">' + lang.flag + '</span>';
            html += '<span class="lang-name">' + lang.name + '</span>';
            html += '</div>';
        }
        
        html += '</div>';
        container.innerHTML = html;
    },
    
    selectLanguage: function(lang) {
        this.setLanguage(lang);
    },
    
    toggleSwitcher: function() {
        const dropdown = document.getElementById('lang-dropdown');
        const currentBtn = document.querySelector('.lang-current');
        if (dropdown) {
            const isOpen = dropdown.style.display === 'block';
            if (isOpen) {
                this.closeDropdown();
            } else {
                dropdown.style.display = 'block';
                if (currentBtn) currentBtn.classList.add('open');
            }
        }
    },
    
    closeDropdown: function() {
        const dropdown = document.getElementById('lang-dropdown');
        const currentBtn = document.querySelector('.lang-current');
        if (dropdown) dropdown.style.display = 'none';
        if (currentBtn) currentBtn.classList.remove('open');
    }
};

// Закрывать при клике вне
document.addEventListener('click', function(e) {
    if (!e.target.closest('#lang-switcher')) {
        I18n.closeDropdown();
    }
});

// Закрывать по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        I18n.closeDropdown();
    }
});

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    I18n.init();
});
