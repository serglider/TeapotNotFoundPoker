roundRectPolyfill();
const keyboard = createKeyboard();
const game = createGame(keyboard);
const help = createHelp();
let isFirstRun = true;
keyboard.subscribe(onKeyup);

function onKeyup(e) {
    if (e['isEscape']) {
        if (isFirstRun) {
            isFirstRun = false;
            game.init();
        }
        help.toggle();
    }
}
