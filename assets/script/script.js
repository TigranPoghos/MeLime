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




    //показать еще проекты
    (() => {
        const gridsWrapper = document.querySelector('.Project__grids');
        if (!gridsWrapper) return;

        const projectGrids = gridsWrapper.querySelectorAll('.project__grid');
        const projectButton = gridsWrapper.querySelector('.Project__buttonJS');

        if (!projectGrids.length || !projectButton) return;

        const getDisplayMode = () => {
            return window.innerWidth <= 766 ? 'flex' : 'grid';
        };

        projectButton.addEventListener('click', () => {
            const displayMode = getDisplayMode();

            projectGrids.forEach(grid => {
            grid.style.display = displayMode;
            });

            projectButton.remove();
        });
    })();


    



    //фильтры
    (() => {
        const prjRoot = document.querySelector('.Project');
        if (!prjRoot) return;

        const prjFiltersEl = prjRoot.querySelector('.Project__filters');
        const prjMosaicWrap = prjRoot.querySelector('.Project__grids');
        const prjResultsWrap = prjRoot.querySelector('.Project__filtered');

        const prjAllCards = prjRoot.querySelectorAll('.project__grid-item');

        // многостраничник: нет нужных узлов — выходим
        if (!prjFiltersEl || !prjMosaicWrap || !prjResultsWrap || prjAllCards.length === 0) return;

        const prjCardsArr = Array.from(prjAllCards);

        // "якоря", чтобы можно было переносить DOM-ноды туда-сюда и возвращать на место
        // (важно: так мы не ломаем события/ленивую загрузку/видео и т.п.)
        const prjAnchors = new Map();
        prjCardsArr.forEach((card) => {
            const anchor = document.createComment('card-anchor');
            card.parentNode.insertBefore(anchor, card);
            prjAnchors.set(card, anchor);
        });

        const prjGetActiveFilters = () => {
            return Array.from(prjFiltersEl.querySelectorAll('.project__button.is-active[data-filter]'))
            .map((btn) => (btn.dataset.filter || '').trim().toLowerCase())
            .filter(Boolean);
        };

        const prjParseTags = (cardEl) => {
            return (cardEl.dataset.tags || '')
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);
        };

        const prjMoveAllCardsBackToMosaic = () => {
            prjCardsArr.forEach((card) => {
            const anchor = prjAnchors.get(card);
            if (anchor && anchor.parentNode) {
                anchor.parentNode.insertBefore(card, anchor.nextSibling);
            }
            card.hidden = false; // на всякий
            });
        };

        const prjRenderResults = (activeFilters) => {
            // очистить контейнер результатов
            prjResultsWrap.innerHTML = '';

            // собрать подходящие карточки
            const matched = prjCardsArr.filter((card) => {
            const tags = prjParseTags(card);
            return activeFilters.some((f) => tags.includes(f)); // OR-логика
            });

            // если ничего не найдено — можно показать заглушку
            if (matched.length === 0) {
            prjResultsWrap.innerHTML = '<div class="Project__empty">Nothing found</div>';
            return;
            }

            // переносим подходящие карточки в результаты
            // важно: при переносе из мозаики они исчезнут оттуда — это то, что нужно в режиме фильтра
            const frag = document.createDocumentFragment();
            matched.forEach((card) => {
            card.hidden = false;
            frag.appendChild(card);
            });

            prjResultsWrap.appendChild(frag);
        };

        const prjSetMode = (isFiltering) => {
            prjRoot.classList.toggle('is-filtering', isFiltering);

            // скрываем/показываем контейнеры
            prjMosaicWrap.style.display = isFiltering ? 'none' : '';
            prjResultsWrap.hidden = !isFiltering;
        };

        const prjApply = () => {
            const active = prjGetActiveFilters();

            if (active.length === 0) {
            // режим мозаики
            prjSetMode(false);
            prjResultsWrap.innerHTML = '';
            prjMoveAllCardsBackToMosaic();
            return;
            }

            // режим результатов
            prjSetMode(true);
            prjRenderResults(active);
        };

        prjFiltersEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.project__button');
            if (!btn) return;

            // Reset
            if (btn.hasAttribute('data-reset')) {
            prjFiltersEl
                .querySelectorAll('.project__button.is-active[data-filter]')
                .forEach((b) => b.classList.remove('is-active'));

            prjApply();
            return;
            }

            // Toggle filter
            if (!btn.hasAttribute('data-filter')) return;

            btn.classList.toggle('is-active');
            prjApply();
        });

        // старт
        prjApply();
    })();









    
})