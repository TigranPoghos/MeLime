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


    







    
})