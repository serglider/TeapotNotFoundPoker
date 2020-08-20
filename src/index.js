roundRectPolyfill();
const keyboard = createKeyboard();
const game = createGame(keyboard);
const help = createHelp();
keyboard.subscribe(onKey);

let isFirstRun = true;

function onKey(e) {
    if (e.isEscape) {
        if (isFirstRun) {
            isFirstRun = false;
            game.init();
        }
        help.toggle();
    }
}
