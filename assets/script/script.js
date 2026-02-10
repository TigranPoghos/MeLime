document.addEventListener('DOMContentLoaded', function() {



    //маска для телефона
    $.fn.setCursorPosition = function (pos) {
    const el = this.get(0);
    if (!el) return this;

    if (el.setSelectionRange) {
        el.setSelectionRange(pos, pos);
    } else if (el.createTextRange) {
        const range = el.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
    return this;
    };
    $(function () {

    const PHONE_DIGITS = 13; // +358 + 8 цифр

    // маска
    const $phones = $('input[type="tel"]');
    $phones.mask('+358 (999) 999 99 99', { autoclear: false });

    // фикс курсора при клике
    $phones.on('click', function (e) {
        const value = this.value;
        const digits = value.replace(/\D/g, '');

        if (digits.length <= 3) {
        e.preventDefault();
        $(this).setCursorPosition(6);
        }
    });

    // убираем ошибку при вводе
    $phones.on('input', function () {
        const digits = this.value.replace(/\D/g, '');
        if (digits.length >= PHONE_DIGITS) {
        $(this).removeClass('error');
        }
    });

    // запрет отправки формы
    $('form').on('submit', function (e) {
        const $tel = $(this).find('input[type="tel"]');
        if (!$tel.length) return;

        const value = $tel.val();
        const digits = value.replace(/\D/g, '');

        if (digits.length < PHONE_DIGITS) {
        e.preventDefault();

        $tel.addClass('error').focus();

        // курсор на первое незаполненное место
        const emptyPos = value.indexOf('_');
        if (emptyPos !== -1) {
            $tel.setCursorPosition(emptyPos);
        }
        }
    });

    });






    // переключение языков
    const langButtons = document.querySelectorAll('.header__lang-item');

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });





    //шапка-услуги
    const serviceBlocks = document.querySelectorAll('.header__serviceJS');

    serviceBlocks.forEach(block => {
        const button = block.querySelector('.header__menuJS');

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            block.classList.toggle('active');
        });
    });

    document.addEventListener('click', (e) => {
        serviceBlocks.forEach(block => {
            if (!e.composedPath().includes(block)) {
                block.classList.remove('active');
            }
        });
    });



    //бургер 
    const burger = document.querySelector('.burger')
    const burgerButton = document.querySelector('.header__burger')
    const burgerClose = document.querySelector('.burger__close')
    const body = document.querySelector('body')
    const opacite = document.querySelector('.opacite')

    function openBurger() {
        burger.classList.add('active');
        opacite.classList.add('active');
        body.classList.add('hidden');
    }

    function closeBurger() {
        burger.classList.remove('active');
        opacite.classList.remove('active');
        body.classList.remove('hidden');
    }

    burgerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openBurger();
    });

    burgerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeBurger();
    });

    document.addEventListener('click', (e) => {
        const clickInsideBurger = e.composedPath().includes(burger);
        const clickOnButton = e.composedPath().includes(burgerButton);

        if (!clickInsideBurger && !clickOnButton) {
            closeBurger();
        }
    });





    //футер услуги
    const footerServiceButton = document.querySelector('.footer__menu-service-mob');
    const footerService = document.querySelector('.footer__menu-mini');
    const footerSvg = document.querySelector('.footer__svg');

    if (footerServiceButton && footerService && footerSvg) {
    footerServiceButton.addEventListener('click', (e) => {
        e.stopPropagation();

        footerService.classList.toggle('active');
        footerSvg.classList.toggle('active');
    });

    footerService.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        const isClickInside =
        footerServiceButton.contains(e.target) ||
        footerService.contains(e.target);

        if (!isClickInside) {
        footerService.classList.remove('active');
        footerSvg.classList.remove('active');
        }
    });
    }


    //услуги
    (() => {
        const turnAccLists = document.querySelectorAll('.turn__item-right');
        if (!turnAccLists.length) return;

        const TURN_ACC_BTN_ACTIVE = 'turnAcc-btn';
        const TURN_ACC_CONTENT_OPEN = 'turnAcc-open';

        // закрыть все аккордеоны на странице (чтобы при клике в одном закрывать другие — опционально)
        const closeAllAccordions = () => {
            turnAccLists.forEach((list) => {
            list.querySelectorAll('.turn__item-content').forEach(c => c.classList.remove(TURN_ACC_CONTENT_OPEN));
            list.querySelectorAll('.turn__item-open').forEach(b => b.classList.remove(TURN_ACC_BTN_ACTIVE));
            });
        };

        turnAccLists.forEach((turnAccList) => {
            const turnAccButtons = turnAccList.querySelectorAll('.turn__item-open');
            const turnAccContents = turnAccList.querySelectorAll('.turn__item-content');

            if (!turnAccButtons.length || !turnAccContents.length) return;

            const turnAccCloseThis = () => {
            turnAccContents.forEach((c) => c.classList.remove(TURN_ACC_CONTENT_OPEN));
            turnAccButtons.forEach((b) => b.classList.remove(TURN_ACC_BTN_ACTIVE));
            };

            // клики внутри конкретного списка
            turnAccList.addEventListener('click', (e) => {
            const btn = e.target.closest('.turn__item-open');
            if (!btn || !turnAccList.contains(btn)) return;

            const li = btn.closest('li');
            if (!li) return;

            const content = li.querySelector('.turn__item-content');
            if (!content) return;

            const wasOpen = content.classList.contains(TURN_ACC_CONTENT_OPEN);

            // если хочешь, чтобы открытие в одном списке закрывало все остальные — включи:
            closeAllAccordions();

            // если нужно закрывать только внутри текущего списка — замени строку выше на:
            // turnAccCloseThis();

            if (!wasOpen) {
                content.classList.add(TURN_ACC_CONTENT_OPEN);
                btn.classList.add(TURN_ACC_BTN_ACTIVE);
            }
            });

            // клик вне — закрыть только этот список
            document.addEventListener('click', (e) => {
            const clickedInside = turnAccList.contains(e.target);
            if (!clickedInside) turnAccCloseThis();
            });
        });
    })();



    //вопросы
    (() => {
        const questionAccItems = document.querySelectorAll('.question__list-item');
        if (!questionAccItems.length) return;

        const questionAccCloseAll = () => {
            questionAccItems.forEach((item) => {
            const content = item.querySelector('.question__content');
            const svg = item.querySelector('svg');

            if (content) content.classList.remove('active');
            if (svg) svg.classList.remove('active');
            });
        };

        questionAccItems.forEach((questionAccItem) => {
            const questionAccButton = questionAccItem.querySelector('button.service__text');
            const questionAccContent = questionAccItem.querySelector('.question__content');
            const questionAccSvg = questionAccItem.querySelector('svg');

            if (!questionAccButton || !questionAccContent || !questionAccSvg) return;

            questionAccButton.addEventListener('click', (e) => {
            e.stopPropagation();

            const wasOpen = questionAccContent.classList.contains('active');

            // закрываем все
            questionAccCloseAll();

            // если кликнули по уже открытому — оставляем закрытым, иначе открываем текущий
            if (!wasOpen) {
                questionAccContent.classList.add('active');
                questionAccSvg.classList.add('active');
            }
            });
        });

        // клик вне области вопросов — закрыть всё
        document.addEventListener('click', (e) => {
            const clickedInside = Array.from(questionAccItems).some(item => item.contains(e.target));
            if (!clickedInside) questionAccCloseAll();
        });
    })();





    //специализация
    (() => {
        const spFilter = document.querySelector('.special__filter');
        if (!spFilter) return;

        const spChips = spFilter.querySelectorAll('.special__chip');
        const spMobileContents = spFilter.querySelectorAll('.special__content-mob');
        const spDeskContents = spFilter.querySelectorAll('.special__content .text');

        if (!spChips.length) return;

        // deactivate all
        const spDeactivateAll = () => {
            spChips.forEach(ch => ch.classList.remove('active'));
            spMobileContents.forEach(mc => mc.classList.remove('active'));
            spDeskContents.forEach(dc => dc.classList.remove('active'));
        };

        // activate tab (desktop)
        const spActivateDesktop = (idx) => {
            spDeactivateAll();
            spChips[idx].classList.add('active');

            if (spDeskContents[idx]) {
            spDeskContents[idx].classList.add('active');
            }
        };

        // activate accordion (mobile)
        const spActivateMobile = (idx) => {
            // toggle: if already active — close, else open
            const isOpen = spMobileContents[idx]?.classList.contains('active');

            spDeactivateAll();

            if (!isOpen) {
            spChips[idx].classList.add('active');
            spMobileContents[idx].classList.add('active');
            }
        };

        const spHandleClick = (index) => {
            const isMobile = window.innerWidth <= 767;
            if (isMobile) {
            spActivateMobile(index);
            } else {
            spActivateDesktop(index);
            }
        };

        spChips.forEach((chip, i) => {
            chip.addEventListener('click', () => spHandleClick(i));
        });

        // init: desktop default — show first
        if (window.innerWidth > 767) {
            spActivateDesktop(0);
        }
    })();



    //слайдер
    const swiperEl = document.querySelector(".mySwiper");
    if (swiperEl) {
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: "auto",
            spaceBetween: 20,
            loop: true,
            navigation: {
            nextEl: ".swiper__left",
            prevEl: ".swiper__right",
            },
        });
    }






    (() => {
        const BODY_HIDDEN_CLASS = 'hidden';
        const POPUP_ACTIVE_CLASS = 'active';

        const isAnyPopupOpen = () =>
            !!document.querySelector(`[data-popup].${POPUP_ACTIVE_CLASS}`);

        const syncBodyLock = () => {
            if (isAnyPopupOpen()) {
            document.body.classList.add(BODY_HIDDEN_CLASS);
            } else {
            document.body.classList.remove(BODY_HIDDEN_CLASS);
            }
        };

        const openPopup = (name) => {
            const popup = document.querySelector(`[data-popup="${name}"]`);
            if (!popup) return;

            closeAllPopups();
            popup.classList.add(POPUP_ACTIVE_CLASS);

            syncBodyLock();
        };

        const closePopup = (popup) => {
            if (!popup) return;

            popup.classList.remove(POPUP_ACTIVE_CLASS);
            syncBodyLock();
        };

        const closeAllPopups = () => {
            document.querySelectorAll(`[data-popup].${POPUP_ACTIVE_CLASS}`)
            .forEach(p => p.classList.remove(POPUP_ACTIVE_CLASS));

            syncBodyLock();
        };

        // Открытие
        document.addEventListener('click', (e) => {
            const openBtn = e.target.closest('[data-popup-open]');
            if (!openBtn) return;

            e.preventDefault();
            openPopup(openBtn.dataset.popupOpen);
        });

        // Закрытие (только по [data-popup-close])
        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('[data-popup-close]');
            if (!closeBtn) return;

            const popup = closeBtn.closest('[data-popup]');
            closePopup(popup);
        });

        // Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeAllPopups();
        });

        // Если какой-то другой код снимает body.hidden — возвращаем обратно, пока открыт попап
        const mo = new MutationObserver(() => {
            if (isAnyPopupOpen() && !document.body.classList.contains(BODY_HIDDEN_CLASS)) {
            document.body.classList.add(BODY_HIDDEN_CLASS);
            }
        });
        mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // на всякий случай при старте
        syncBodyLock();
    })();







    //аккордеон
    (() => {
    const ACTIVE_CLASS = 'active';

    document.addEventListener('click', (e) => {
        const subtitle = e.target.closest('.history__subtitle');
        if (!subtitle) return;

        const text = subtitle.nextElementSibling;

        if (!text || !text.classList.contains('history__text')) return;

        subtitle.classList.toggle(ACTIVE_CLASS);
        text.classList.toggle(ACTIVE_CLASS);
    });
    })();


    
})