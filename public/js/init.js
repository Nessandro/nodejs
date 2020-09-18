

function init(){
    console.log('init app...');
    M.AutoInit();

    CKEDITOR.replace('body', {
        plugins: 'wysiwygarea, toolbar, basicstyles, link'
    })
}


init();

