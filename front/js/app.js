window.addEventListener('DOMContentLoaded', ()=>{
    if(document.querySelector('.flash')){
        let $flash = document.querySelector('.flash');

        $flash.addEventListener('click', (e)=>{
            $flash.parentNode.removeChild($flash);
        });

        setTimeout(()=>{
            $flash.parentNode.removeChild($flash);
        }, 3000)
    }
});
