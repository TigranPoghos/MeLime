document.addEventListener('DOMContentLoaded', function() {



    //маска для телефона
    $.fn.setCursorPosition = function(pos) {
    const el = $(this).get(0);
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

    $('input[type="tel"]')
    .mask('+358 (999) 999 99 99', { autoclear: false })
    .on('click', function(e) {
        const value = $(this).val();

        const clean = value.replace(/[^0-9]/g, '');

        if (clean.length <= 3) {
        e.preventDefault();
        $(this).setCursorPosition(6);
        }
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



    //показать еще проекты
    (() => {
        const prjRoot = document.querySelector('.Project');
        if (!prjRoot) return;

        const prjFiltersEl = prjRoot.querySelector('.Project__filters');
        const prjMosaicWrap = prjRoot.querySelector('.Project__grids');
        const prjResultsWrap = prjRoot.querySelector('.Project__filtered');
        const prjButton = prjRoot.querySelector('.Project__buttonJS');

        const prjAllCards = prjRoot.querySelectorAll('.project__grid-item');
        const prjAllGrids = prjMosaicWrap ? prjMosaicWrap.querySelectorAll('.project__grid') : null;

        if (
            !prjFiltersEl ||
            !prjMosaicWrap ||
            !prjResultsWrap ||
            !prjButton ||
            !prjAllCards.length ||
            !prjAllGrids ||
            !prjAllGrids.length
        ) return;

        const prjCardsArr = Array.from(prjAllCards);
        const prjGridsArr = Array.from(prjAllGrids);

        const RESULTS_LIMIT = 14;

        // состояния
        let prjMosaicExpanded = false;   // раскрыли ли все гриды
        let prjResultsExpanded = false;  // раскрыли ли все результаты (после 14)

        // якоря — чтобы вернуть карточки на места в мозаике
        const prjAnchors = new Map();
        prjCardsArr.forEach((card) => {
            const anchor = document.createComment('card-anchor');
            card.parentNode.insertBefore(anchor, card);
            prjAnchors.set(card, anchor);
        });

        const prjGetDisplayModeForGrid = () => (window.innerWidth <= 766 ? 'flex' : 'grid');

        const prjGetActiveFilters = () => {
            return Array.from(prjFiltersEl.querySelectorAll('.project__button.is-active[data-filter]'))
            .map(btn => (btn.dataset.filter || '').trim().toLowerCase())
            .filter(Boolean);
        };

        const prjParseTags = (cardEl) => {
            return (cardEl.dataset.tags || '')
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);
        };

        const prjMoveAllCardsBackToMosaic = () => {
            prjCardsArr.forEach((card) => {
            const anchor = prjAnchors.get(card);
            if (anchor && anchor.parentNode) {
                anchor.parentNode.insertBefore(card, anchor.nextSibling);
            }
            card.hidden = false;
            });
        };

        const prjSetMode = (isFiltering) => {
            prjRoot.classList.toggle('is-filtering', isFiltering);
            prjMosaicWrap.style.display = isFiltering ? 'none' : '';
            prjResultsWrap.hidden = !isFiltering;
        };

        // ---------- MOSAIC (гриды) ----------
        const prjRenderMosaic = () => {
            const displayMode = prjGetDisplayModeForGrid();

            prjGridsArr.forEach((grid, idx) => {
            // свернуто: показываем только 2 грида
            if (!prjMosaicExpanded && idx >= 2) {
                grid.style.display = 'none';
            } else {
                grid.style.display = displayMode;
            }
            });

            // кнопка нужна, если гридов > 2 и они ещё не раскрыты
            prjButton.hidden = prjMosaicExpanded || prjGridsArr.length <= 2;
        };

        // ---------- RESULTS (карточки) ----------
        const prjGetMatchedCards = (activeFilters) => {
            return prjCardsArr.filter((card) => {
            const tags = prjParseTags(card);
            return activeFilters.some(f => tags.includes(f)); // OR-логика
            });
        };

        const prjRenderResults = (activeFilters) => {
            prjResultsWrap.innerHTML = '';

            const matched = prjGetMatchedCards(activeFilters);

            if (matched.length === 0) {
            prjResultsWrap.innerHTML = '<div class="Project__empty">Nothing found</div>';
            prjButton.hidden = true;
            return;
            }

            const showCount = prjResultsExpanded ? matched.length : Math.min(RESULTS_LIMIT, matched.length);

            const frag = document.createDocumentFragment();
            matched.forEach((card, idx) => {
            card.hidden = idx >= showCount; // ВАЖНО: мы не удаляем, а скрываем лишние
            frag.appendChild(card);         // переносим в results
            });

            prjResultsWrap.appendChild(frag);

            // кнопка нужна, если есть ещё что показать и мы ещё не раскрыли
            prjButton.hidden = prjResultsExpanded || matched.length <= RESULTS_LIMIT;
        };

        // ---------- APPLY ----------
        const prjApply = () => {
            const active = prjGetActiveFilters();

            if (active.length === 0) {
            // мозаика
            prjSetMode(false);
            prjResultsWrap.innerHTML = '';
            prjResultsExpanded = false;

            prjMoveAllCardsBackToMosaic();
            prjRenderMosaic();
            return;
            }

            // результаты
            prjSetMode(true);

            // при изменении фильтров — снова начинаем с 14
            prjRenderResults(active);
        };

        // ---------- EVENTS ----------
        prjFiltersEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.project__button');
            if (!btn) return;

            // reset
            if (btn.hasAttribute('data-reset')) {
            prjFiltersEl
                .querySelectorAll('.project__button.is-active[data-filter]')
                .forEach(b => b.classList.remove('is-active'));

            prjResultsExpanded = false;
            prjApply();
            return;
            }

            // toggle filter
            if (!btn.hasAttribute('data-filter')) return;

            btn.classList.toggle('is-active');

            prjResultsExpanded = false; // важный сброс
            prjApply();
        });

        // одна и та же кнопка, но в разных режимах делает разное
        prjButton.addEventListener('click', () => {
            const active = prjGetActiveFilters();

            if (active.length === 0) {
            // раскрываем гриды
            prjMosaicExpanded = true;
            prjRenderMosaic();
            } else {
            // раскрываем результаты (показать всё подходящее)
            prjResultsExpanded = true;
            prjRenderResults(active);
            }
        });

        // при ресайзе обновим display grid/flex в мозаике
        window.addEventListener('resize', () => {
            const active = prjGetActiveFilters();
            if (active.length === 0) prjRenderMosaic();
        });

        // старт
        prjApply();
    })();





    //статьи
    (() => {
        const artRoot = document.querySelector('.Article');
        if (!artRoot) return;

        const artFiltersEl = artRoot.querySelector('.Article__filters');
        const artWrapper = artRoot.querySelector('.Article__wrapper');
        const artCardsNodeList = artWrapper ? artWrapper.querySelectorAll('.article__big') : null;
        const artLoadMoreBtn = artRoot.querySelector('.Project__buttonJS');

        if (!artFiltersEl || !artWrapper || !artCardsNodeList || artCardsNodeList.length === 0) return;

        const INITIAL_COUNT = 6;
        const artCardsArr = Array.from(artCardsNodeList);

        let artIsExpanded = false;

        const artGetActiveFilters = () => {
            return Array.from(artFiltersEl.querySelectorAll('.project__button.is-active[data-filter]'))
            .map(btn => (btn.dataset.filter || '').trim().toLowerCase())
            .filter(Boolean);
        };

        const artParseTags = (cardEl) => {
            return (cardEl.dataset.tags || '')
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);
        };

        const artGetMatchedCards = (activeFilters) => {
            // если активных фильтров нет — подходят все
            if (activeFilters.length === 0) return artCardsArr;

            // OR-логика: подходит, если совпал хотя бы один тег
            return artCardsArr.filter(card => {
            const tags = artParseTags(card);
            return activeFilters.some(f => tags.includes(f));
            });
        };

        const artRender = () => {
            const active = artGetActiveFilters();
            const matched = artGetMatchedCards(active);

            // Сначала скрываем всё
            artCardsArr.forEach(card => (card.hidden = true));

            // Определяем, сколько показываем
            const visibleCount = (artIsExpanded || matched.length <= INITIAL_COUNT)
            ? matched.length
            : INITIAL_COUNT;

            // Показываем нужное количество подходящих
            matched.slice(0, visibleCount).forEach(card => (card.hidden = false));

            // Кнопка:
            if (artLoadMoreBtn) {
            const shouldShowBtn = !artIsExpanded && matched.length > INITIAL_COUNT;
            artLoadMoreBtn.hidden = !shouldShowBtn;
            }
        };

        // Клики по фильтрам
        artFiltersEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.project__button');
            if (!btn) return;

            // Reset
            if (btn.hasAttribute('data-reset')) {
            artFiltersEl
                .querySelectorAll('.project__button.is-active[data-filter]')
                .forEach(b => b.classList.remove('is-active'));

            artIsExpanded = false;
            artRender();
            return;
            }

            // Toggle filter
            if (!btn.hasAttribute('data-filter')) return;

            btn.classList.toggle('is-active');
            artIsExpanded = false; // при изменении фильтра — снова показываем первые 6
            artRender();
        });

        // Кнопка "Lataa lisää"
        if (artLoadMoreBtn) {
            artLoadMoreBtn.addEventListener('click', () => {
            artIsExpanded = true;
            artRender();

            // Если ты хочешь, чтобы кнопка именно исчезала навсегда:
            // artLoadMoreBtn.remove();
            // Тогда просто закомментируй artLoadMoreBtn.hidden выше и оставь remove() здесь.
            });
        }

        // стартовое состояние
        artRender();
    })();



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








    
})