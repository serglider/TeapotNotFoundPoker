roundRectPolyfill();
const isMobile = 'ontouchstart' in window;
const keyboard = createKeyboard(isMobile);
const game = createGame(keyboard);
const help = createHelp();
let isLoaded = false;

// const sum = (arr) => arr.reduce((acc, num) => acc + num, 0);
//
// let n = 100000;
// const res = [];
// const hands = {};
// for (let i = 0; i < n; i++) {
//     const deck = createDeck();
//     const hand = deck.deal(5);
//     const [name, win] = rateHand(hand);
//     res.push(win);
//     if (hands[name]) {
//         hands[name] += 1;
//     } else {
//         hands[name] = 1;
//     }
// }
//
// const av = sum(res) / res.length;
// console.log(av);
// Object.keys(hands).forEach((key) => {
//     hands[key] = hands[key] / n;
// });
// console.log(hands);

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

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function onKeyup(e) {
    if (e['isEscape']) {
        help.toggle();
        toggleFullScreen();
    }
}
