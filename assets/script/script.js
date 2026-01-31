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
    .mask('+7 (999) 999 99 99', { autoclear: false })
    .on('click', function(e) {
        const value = $(this).val();

        const clean = value.replace(/[^0-9]/g, '');

        if (clean.length <= 3) {
        e.preventDefault();
        $(this).setCursorPosition(4);
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
    const menuServiceButton = document.querySelector('.header__menuJS')
    const menuServiceBlock = document.querySelector('.header__serviceJS')

    menuServiceButton.addEventListener('click', () => {
        menuServiceBlock.classList.toggle('active')
    })

    document.addEventListener('click', (e) => {
        const click = e.composedPath().includes(menuServiceBlock)

        if ( !click ) {
            menuServiceBlock.classList.remove('active')
        }
    })

    







    
})