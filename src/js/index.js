roundRectPolyfill();
const isMobile = 'ontouchstart' in window;
const keyboard = createKeyboard(isMobile);
const game = createGame(keyboard);
const help = createHelp();
let isLoaded = false;

const teapot1 = new Image();
teapot1.onload = init;
teapot1.src = 'assets/teapot_y.svg';

const teapot2 = new Image();
teapot2.onload = init;
teapot2.src = 'assets/teapot_p.svg';

function init() {
    if (isLoaded) {
        keyboard.subscribe(onKeyup);
        setTimeout(() => {
            game.init(teapot1, teapot2);
        }, 0);
    } else {
        isLoaded = true;
    }
}

function onKeyup(e) {
    if (e['isEscape']) {
        help.toggle();
    }
}
