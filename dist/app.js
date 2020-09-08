function getConstants() {
    return {
        hands: [
            ['', 0],
            ['Fours or Better Pair', 1],
            ['Two Pair', 2],
            ['Three of a Kind', 3],
            ['Straight', 4],
            ['Flush', 6],
            ['Full House', 9],
            ['Four of a Kind', 12],
            ['Straight Flush', 15],
            ['Royal Flush', 18],
        ],
        ranks: [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            't',
            'j',
            'q',
            'k',
            'a',
        ],
        suits: ['s', 'h', 'c', 'd'],
        colors: {
            's': '#1F191B',
            'c': '#1F191B',
            'h': '#CB1728',
            'd': '#CB1728',
        },
        stringMap: {
            'as': '\ud83c\udca1',
            'ah': '\ud83c\udcb1',
            'ad': '\ud83c\udcc1',
            'ac': '\ud83c\udcd1',
            '2s': '\ud83c\udca2',
            '2h': '\ud83c\udcb2',
            '2d': '\ud83c\udcc2',
            '2c': '\ud83c\udcd2',
            '3s': '\ud83c\udca3',
            '3h': '\ud83c\udcb3',
            '3d': '\ud83c\udcc3',
            '3c': '\ud83c\udcd3',
            '4s': '\ud83c\udca4',
            '4h': '\ud83c\udcb4',
            '4d': '\ud83c\udcc4',
            '4c': '\ud83c\udcd4',
            '5s': '\ud83c\udca5',
            '5h': '\ud83c\udcb5',
            '5d': '\ud83c\udcc5',
            '5c': '\ud83c\udcd5',
            '6s': '\ud83c\udca6',
            '6h': '\ud83c\udcb6',
            '6d': '\ud83c\udcc6',
            '6c': '\ud83c\udcd6',
            '7s': '\ud83c\udca7',
            '7h': '\ud83c\udcb7',
            '7d': '\ud83c\udcc7',
            '7c': '\ud83c\udcd7',
            '8s': '\ud83c\udca8',
            '8h': '\ud83c\udcb8',
            '8d': '\ud83c\udcc8',
            '8c': '\ud83c\udcd8',
            '9s': '\ud83c\udca9',
            '9h': '\ud83c\udcb9',
            '9d': '\ud83c\udcc9',
            '9c': '\ud83c\udcd9',
            'ts': '\ud83c\udcaa',
            'th': '\ud83c\udcba',
            'td': '\ud83c\udcca',
            'tc': '\ud83c\udcda',
            'js': '\ud83c\udcab',
            'jh': '\ud83c\udcbb',
            'jd': '\ud83c\udccb',
            'jc': '\ud83c\udcdb',
            'qs': '\ud83c\udcad',
            'qh': '\ud83c\udcbd',
            'qd': '\ud83c\udccd',
            'qc': '\ud83c\udcdd',
            'ks': '\ud83c\udcae',
            'kh': '\ud83c\udcbe',
            'kd': '\ud83c\udcce',
            'kc': '\ud83c\udcde',
        },
    };
}

function createGame(keyboard) {
    const world = createWorld(onUpdateLayout);
    const cardBlock = createCardBlock(onCardClick);
    const balanceTF = createTextView({
        fill: 'white',
        fontFamily: 'Fredoka One',
    });
    const winTF = createTextView({
        fill: 'white',
        textAlign: 'right',
    });
    const handTF = createTextView({
        fill: 'white',
        textAlign: 'left',
    });
    const actionButton = createActionButton(onAction);

    let bet = 1;
    let balance = 411;
    let isInit = true;
    let deck;
    let cardsToReplace;
    let isComplete;
    let lockKeyboard;
    let teapots, resultPanel;

    return { init };

    function onUpdateLayout(data) {
        const {
            cw,
            cardGap,
            cardBlockX,
            cardBlockW,
            infoTextY,
            balanceY,
            fs1,
            fs2,
        } = data;
        balanceTF.setPosition(cw / 2, balanceY);
        balanceTF.setFontSize(fs1);

        winTF.setPosition(cardBlockW + cardBlockX - cardGap, infoTextY);
        winTF.setFontSize(fs2);

        handTF.setPosition(cardBlockX, infoTextY);
        handTF.setFontSize(fs2);
    }

    function init(teapot1, teapot2) {
        teapots = createTeapots(teapot1, teapot2);
        resultPanel = createResultPanel(teapot1, teapot2, onRestart);
        world.add(
            cardBlock,
            winTF,
            handTF,
            actionButton,
            teapots,
            balanceTF,
            resultPanel
        );
        cardBlock.init();
        actionButton.setText('PLACE A BET');
        displayBalance();
        toNextRound();
        world.start();
    }

    function onRestart() {
        balance = 411;
        isInit = true;
        cardBlock.flipBack();
        handTF.setText('');
        winTF.setText('');
        displayBalance();
        toNextRound();
        resultPanel.hide();
    }

    function enableControls() {
        lockKeyboard = keyboard.subscribe(onKey);
        actionButton.setInteractive(true);
        cardBlock.setInteractive(true);
    }

    function disableControls() {
        lockKeyboard();
        actionButton.setInteractive(false);
        cardBlock.setInteractive(false);
    }

    function onLose() {
        resultPanel.show(false);
    }

    function onWin() {
        resultPanel.show(true);
    }

    function placeBet() {
        disableControls();
        isComplete = false;
        cardsToReplace = [];
        balance -= bet;
        deck = createDeck();
        const cards = deck.deal(5);
        cardBlock.setCards(cards, isInit).then(enableControls);
        if (isInit) {
            isInit = false;
        }
        displayBalance();
        handTF.setText('');
        winTF.setText('');
        actionButton.setText('SUBMIT');
    }

    function displayBalance() {
        balanceTF.setText(`BALANCE ${balance}`);
        const diff = balance - 404;
        const tn = diff > 14 ? 14 : diff > 0 ? diff : 0;
        teapots.setNumber(tn);
    }

    function adjustBalance(actualBalance) {
        if (actualBalance > 418) {
            return 418;
        }
        return actualBalance;
    }

    function confirmSelection() {
        const hand = cardBlock.getCards();
        const [name, win] = rateHand(hand);
        balance = adjustBalance(balance + win);
        displayBalance();
        handTF.setText(name);
        if (win) {
            winTF.setText(`Win ${win}`);
        } else {
            winTF.setText('Better luck next time');
        }
        if (balance === 418) {
            onWin();
        } else if (balance === 404) {
            onLose();
        } else {
            toNextRound();
        }
    }

    function onAction() {
        if (isComplete) {
            placeBet();
        } else {
            disableControls();
            replaceCards();
            confirmSelection();
        }
    }

    function toNextRound() {
        isComplete = true;
        enableControls();
        actionButton.setText('PLACE A BET');
    }

    function prepareDraw(index) {
        const i = cardsToReplace.indexOf(index);
        if (i === -1) {
            actionButton.setText('DEAL AND SUBMIT');
            cardsToReplace.push(index);
            cardBlock.selectCard(index);
        }
    }

    function replaceCards() {
        if (cardsToReplace.length) {
            const drawCards = deck.deal(cardsToReplace.length);
            const drawData = cardsToReplace.map((index, i) => [
                index,
                drawCards[i],
            ]);
            cardBlock.replaceCards(drawData);
        }
    }

    function onCardClick(i) {
        if (!isComplete && i >= 0 && i < 5) {
            prepareDraw(i);
        }
    }

    function onKey(e) {
        if (!isComplete && e.isDigit && e.digit > 0 && e.digit < 6) {
            prepareDraw(e.digit - 1);
        } else if (e.isSpace) {
            onAction();
        }
    }
}

function createHelp() {
    const help = document.querySelector('.help-outer');
    let isShown = true;

    return { toggle };

    function toggle() {
        isShown = !isShown;
        help.style.display = isShown ? 'table' : 'none';
    }
}

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

function createKeyboard(isMobile) {
    let listeners = {};
    let keys = [];
    let lastTouch;

    if (isMobile) {
        window.addEventListener('touchstart', onStart);
        window.addEventListener('touchend', onEnd);
    } else {
        window.addEventListener('keyup', handleKeyUp);
    }

    return {
        subscribe,
        reset,
    };

    function reset() {
        listeners = {};
        keys = [];
    }

    function handleKeyUp(e) {
        const dig = Number(e.key);
        const event = {};
        if (isSpace(e.key)) {
            event.isSpace = true;
        } else if (isDigit(dig)) {
            event.digit = dig;
            event.isDigit = true;
        } else {
            event[`is${e.key}`] = true;
        }
        keys.forEach((key) => {
            listeners[key](event);
        });
    }

    function onStart(e) {
        lastTouch = e.timeStamp;
    }
    function onEnd(e) {
        const diff = e.timeStamp - lastTouch;
        if (diff > 1000) {
            const event = {
                isEscape: true,
            };
            keys.forEach((key) => {
                listeners[key](event);
            });
        }
    }

    function subscribe(listener) {
        const key = Date.now();
        listeners[key] = listener;
        keys = Object.keys(listeners);

        return function () {
            delete listeners[key];
            keys = Object.keys(listeners);
        };
    }

    function isDigit(value) {
        return Number.isInteger(value);
    }

    function isSpace(value) {
        return value === ' ';
    }
}

function roundRectPolyfill() {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) {
            r = w / 2;
        }
        if (h < 2 * r) {
            r = h / 2;
        }
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
}

function createWorld(onUpdateLayout) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let objects = [];
    let dynamicObjects = [];
    let mouseListeners = [];
    let resizeObjects = [];
    let isStarted = false;

    // ctx.save();
    // ctx.fill();
    // ctx.font = `100px system`;
    // const back1 = '\ud83c\udcbf';
    // const back2 = '\uD83C\uDCA0';
    // const as = '\ud83c\udca1';
    // let { width } = ctx.measureText(as);
    // console.log(width);
    // ctx.restore();

    canvas.addEventListener('touchstart', onClick);
    canvas.addEventListener('click', onClick);

    window.addEventListener('resize', onResize);

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';

        const isLandscape = canvas.width > canvas.height;

        const cw = canvas.width;
        const ch = canvas.height;
        const buttonY = ch * 0.8;
        let factor = 0.6;
        let cardH = Math.round(ch * factor);
        let cardW = Math.round(cardH * 0.66);
        let cardGap = Math.round(cardH * 0.06);
        let cardBlockW = 5 * (cardW + cardGap);

        const fs1 = Math.round(ch * 0.045);
        const fs2 = Math.round(fs1 * 0.75);

        while (cardBlockW > cw) {
            factor -= 0.05;
            cardH = Math.round(ch * factor);
            cardW = Math.round(cardH * 0.66);
            cardGap = Math.round(cardH * 0.06);
            cardBlockW = 5 * (cardW + cardGap);
        }

        const cardBlockX = (cw - cardBlockW + cardGap) / 2;
        const cardBlockY = (ch - cardH) / 2;
        const infoTextY = cardBlockY - fs2;
        const balanceY = Math.min(cardBlockY - fs1 * 2, ch * 0.2);
        const buttonHFactor = isLandscape ? 0.2 : 0.4;
        const buttonH = Math.round(cardH * buttonHFactor);

        const data = {
            cw,
            ch,
            cardH,
            cardW,
            cardGap,
            cardBlockW,
            cardBlockX,
            cardBlockY,
            balanceY,
            buttonY,
            infoTextY,
            buttonH,
            fs1,
            fs2,
        };
        resizeObjects.forEach((obj) => obj.updateLayout(data));
        onUpdateLayout(data);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    requestAnimationFrame(loop);

    return {
        add,
        start,
        stop,
    };

    function start() {
        onResize();
        isStarted = true;
    }

    function stop() {
        isStarted = false;
    }

    function add(...args) {
        args.forEach((o) => addObj(o));
    }

    function addObj(obj) {
        objects.push(obj);
        if (typeof obj.mouseListener === 'function') {
            mouseListeners.push(obj.mouseListener);
        }
        if (typeof obj.update === 'function') {
            dynamicObjects.push(obj);
        }
        if (typeof obj.updateLayout === 'function') {
            resizeObjects.push(obj);
        }
    }

    function onClick(e) {
        const mouse = getMousePosition(e);
        mouseListeners.forEach((listener) => listener(mouse));
    }

    function getMousePosition(e) {
        const bcr = canvas.getBoundingClientRect();
        return {
            x: e.pageX - bcr.left,
            y: e.pageY - bcr.top,
        };
    }

    function loop(t) {
        if (isStarted) {
            update(t);
            clear();
            render();
        }
        requestAnimationFrame(loop);
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update(t) {
        dynamicObjects.forEach((obj) => obj.update(t));
    }

    function render() {
        objects.forEach((obj) => obj.render(ctx));
    }
}

function createCard(rank, suit) {
    const { stringMap, ranks, colors } = getConstants();
    return {
        rank,
        suit,
        value: ranks.indexOf(rank),
        string: stringMap[rank + suit],
        color: colors[suit],
    };
}

function createDeck() {
    const { suits, ranks } = getConstants();
    const cards = suits.reduce((result, suit) => {
        const cardsWithRank = ranks.map((rank) => createCard(rank, suit));
        return [...result, ...cardsWithRank];
    }, []);

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    function deal(num) {
        return cards.splice(num * -1);
    }

    return { deal };
}

function rateHand(cards) {
    const { hands } = getConstants();
    const pool = [...cards].sort(valueComparator);
    let isStraight = true;
    let isFlush = true;

    const kinds = pool.reduce((result, card, index) => {
        if (isStraight && index !== 0) {
            isStraight = card.value === pool[index - 1].value - 1;
        }
        if (isFlush && index !== 0) {
            isFlush = card.suit === pool[index - 1].suit;
        }
        if (result[card.rank]) {
            result[card.rank].push(card);
        } else {
            result[card.rank] = [card];
        }
        return result;
    }, {});

    let rate = hands[0];

    const isStraightFlush = isFlush && isStraight;
    const isRoyalFlush = isStraightFlush && kinds.a && kinds.a.length === 1;
    if (isRoyalFlush) {
        rate = hands[9];
    } else if (isStraightFlush) {
        rate = hands[8];
    } else if (isFlush) {
        rate = hands[5];
    } else if (isStraight) {
        rate = hands[4];
    } else {
        const rb /* repetition buckets*/ = Object.keys(kinds).reduce(
            (result, rank) => {
                const len = kinds[rank].length;
                result[len].push(kinds[rank]);
                return result;
            },
            { '1': [], '2': [], '3': [], '4': [] }
        );

        if (rb['4'].length === 1) {
            rate = hands[7];
        } else if (rb['2'].length === 1 && rb['3'].length === 1) {
            rate = hands[6];
        } else if (rb['3'].length === 1) {
            rate = hands[3];
        } else if (rb['2'].length === 2) {
            rate = hands[2];
        } else if (rb['2'].length === 1) {
            const isBetter = rb['2'][0].every((card) => card.value > 2);
            if (isBetter) {
                rate = hands[1];
            }
        }
    }

    return rate;

    function valueComparator(card1, card2) {
        if (card1.value < card2.value) {
            return 1;
        }
        if (card1.value > card2.value) {
            return -1;
        }
        return 0;
    }
}

function createActionButton(listener) {
    let isInteractive = false;
    let x,
        y,
        cx,
        cy,
        w,
        h,
        r,
        fs,
        text = '';

    return {
        render,
        setText,
        mouseListener,
        setInteractive,
        updateLayout,
    };

    function updateLayout({
        cardBlockX,
        buttonY,
        buttonH,
        cw,
        cardBlockW,
        cardGap,
    }) {
        x = cardBlockX;
        y = buttonY;
        cx = cw / 2;
        cy = buttonY + buttonH / 2;
        w = cardBlockW - cardGap;
        h = buttonH;
        r = Math.round(h * 0.1);
        fs = Math.round(h * 0.66);
    }

    function setInteractive(isActive) {
        isInteractive = isActive;
    }

    function setText(t) {
        text = t;
    }

    function mouseListener(point) {
        if (isInteractive && isPointInside(point)) {
            listener();
        }
    }

    function isPointInside(point) {
        return inRange(point.x, x, x + w) && inRange(point.y, y, y + h);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    function render(ctx) {
        ctx.save();
        ctx.fillStyle = '#C35B68';
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.fillStyle = '#DCB600';
        ctx.font = `${fs}px "Fredoka One"`;
        ctx.fillText(text, cx, cy);
        ctx.restore();
    }
}

function createCardBlock(onCardClick) {
    let cardViews = [];
    let isInteractive = false;

    return {
        render,
        selectCard,
        replaceCards,
        getCards,
        setCards,
        flipBack,
        init,
        mouseListener,
        setInteractive,
        update,
        updateLayout,
    };

    function updateLayout({ cardH, cardW, cardGap, cardBlockX, cardBlockY }) {
        cardViews.forEach((view, i) => {
            const cx = cardBlockX + i * (cardW + cardGap);
            view.updateLayout({
                cx,
                cardH,
                cardW,
                cardGap,
                cardBlockY,
            });
        });
    }

    function setInteractive(isActive) {
        isInteractive = isActive;
    }

    function mouseListener(mouse) {
        if (isInteractive) {
            let i = 0;
            for (; i < 5; i++) {
                if (cardViews[i].isPointInside(mouse)) {
                    break;
                }
            }
            onCardClick(i);
        }
    }

    function init() {
        cardViews = Array.from({ length: 5 }, () => createCardView());
    }

    function update() {
        cardViews.forEach((view) => view.update());
    }

    function setCards(cards, isInit) {
        if (isInit) {
            return cardViews.reduce((accumulatorPromise, view, i) => {
                return accumulatorPromise.then(() => {
                    view.setCard(cards[i]);
                    return view.flip(0.24);
                });
            }, Promise.resolve());
        }
        const tasks = cardViews.map((view, i) => {
            view.setCard(cards[i]);
            return view.flip(0.16);
        });
        return Promise.all(tasks).then(() => {
            return cardViews.reduce((accumulatorPromise, view) => {
                return accumulatorPromise.then(() => {
                    return view.flip(0.24);
                });
            }, Promise.resolve());
        });
    }

    function flipBack() {
        cardViews.forEach((view) => view.flipBack());
    }

    function render(ctx) {
        cardViews.forEach((view) => view.render(ctx));
    }

    function selectCard(index) {
        cardViews[index].flip(0.16);
    }

    function replaceCards(drawData) {
        drawData.forEach(([index, card]) => {
            cardViews[index].setCard(card);
            cardViews[index].flip(0.16);
        });
    }

    function getCards() {
        return cardViews.map((view) => view.getCard());
    }
}

function createCardView() {
    let card, x, y, w, h, margin, halfMargin;
    // const back = '\ud83c\udcbf';
    const back = '\uD83C\uDCA0';

    let isFlipped = true;
    let isSwap = false;
    let scaleX = 1;
    let add = -0.16;
    let flipResolver = () => {};
    const isFF = navigator.userAgent.includes('Firefox');

    return {
        render,
        flip,
        flipBack,
        setCard,
        getCard,
        isPointInside,
        update,
        updateLayout,
    };

    function updateLayout({ cx, cardH, cardW, cardGap, cardBlockY }) {
        y = cardBlockY;
        x = cx;
        w = cardW;
        h = cardH;
        margin = isFF ? cardGap / 2 : cardGap;
        halfMargin = cardGap / 2;
    }

    function isPointInside(point) {
        return inRange(point.x, x, x + w) && inRange(point.y, y, y + h);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    function render(ctx) {
        ctx.save();
        const shiftX = w / 2;
        ctx.translate(x + shiftX, y);
        ctx.scale(scaleX, 1);
        ctx.fillStyle = 'white';
        ctx.roundRect(shiftX * -1, 0, w, h - halfMargin, halfMargin);
        ctx.fill();
        ctx.font = `${h}px system`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillStyle = isFlipped ? '#DCB600' : card.color;
        const text = isFlipped ? back : card.string;
        ctx.fillText(text, shiftX * -1, margin);

        ctx.restore();
    }

    function update() {
        if (isSwap) {
            scaleX += add;
            if (scaleX <= 0) {
                scaleX = 0;
                add *= -1;
                isFlipped = !isFlipped;
            } else if (scaleX >= 1) {
                scaleX = 1;
                add *= -1;
                isSwap = false;
                flipResolver();
            }
        }
    }

    function setCard(cd) {
        card = cd;
    }

    function getCard() {
        return card;
    }

    function flip(dt) {
        add = -1 * dt;
        isSwap = true;
        return new Promise((resolve) => {
            flipResolver = resolve;
        });
    }

    function flipBack() {
        isFlipped = true;
    }
}

function createResultPanel(winTexture, loseTexture, onRestart) {
    let w, h, fs, centerW, centerH, scale, origX, origY;
    let isWin = false;
    let isShown = false;
    let isShowing = false;
    let alpha = 0;
    let teapotAlpha = 0;
    let showResolver = () => {};
    // show(true);
    return {
        render,
        show,
        hide,
        updateLayout,
        update,
        mouseListener,
    };

    function mouseListener() {
        if (teapotAlpha === 1) {
            onRestart();
        }
    }

    function updateLayout({ cw, ch }) {
        const minSide = Math.min(cw, ch);
        fs = Math.round(minSide * 0.12);
        centerW = cw;
        centerH = ch;
        scale = 1;
        w = winTexture.width * scale;
        h = winTexture.height * scale;
        while (w > minSide * 1.08) {
            scale -= 0.002;
            w = winTexture.width * scale;
            h = winTexture.height * scale;
        }

        origX = (cw - w) / 2;
        origY = (ch - h) / 2;
    }

    function show(isW) {
        isWin = isW;
        return new Promise((resolve) => {
            showResolver = resolve;
            setTimeout(() => {
                isShown = true;
                isShowing = true;
            }, 1000);
        });
    }

    function hide() {
        return new Promise((resolve) => {
            showResolver = resolve;
            isShowing = false;
        });
    }

    function update() {
        if (isShown) {
            if (isShowing) {
                if (alpha === 1) {
                    teapotAlpha += 0.01;
                    if (teapotAlpha >= 1) {
                        teapotAlpha = 1;
                        showResolver();
                    }
                } else {
                    alpha += 0.02;
                    if (alpha >= 1) {
                        alpha = 1;
                    }
                }
            } else {
                if (teapotAlpha === 0) {
                    alpha -= 0.02;
                    if (alpha <= 0) {
                        alpha = 0;
                        showResolver();
                    }
                } else {
                    teapotAlpha -= 0.01;
                    if (teapotAlpha <= 0) {
                        teapotAlpha = 0;
                    }
                }
            }
        }
    }

    function render(ctx) {
        if (isShown) {
            const color = isWin ? '#668706' : '#DCB600';
            const text = isWin ? 'YOU WON' : 'YOU LOSE';
            const texture = isWin ? winTexture : loseTexture;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, centerW, centerH);
            ctx.save();
            ctx.translate(origX, origY);
            ctx.scale(scale, scale);
            ctx.globalAlpha = teapotAlpha;
            ctx.drawImage(texture, 0, 0);
            ctx.restore();
            if (alpha === 1) {
                ctx.font = `${fs}px "Fredoka One"`;
                ctx.fillText(text, centerW / 2, centerH / 2 + fs / 2);
            }
            ctx.restore();
        }
    }
}

function createTeapots(img1, img2) {
    let num, dx, scale, w;

    return {
        render,
        setNumber,
        updateLayout,
    };

    function updateLayout({ cw }) {
        dx = cw / 14;
        scale = 0.06;
        w = img1.width * scale;
        while (w > dx) {
            scale -= 0.002;
            w = img1.width * scale;
        }
    }

    function setNumber(n) {
        num = n;
    }

    function render(ctx) {
        ctx.save();
        ctx.scale(scale, scale);
        for (let i = 0; i < 14; i++) {
            const f = dx / 2 - w / 2;
            let img = i < num ? img1 : img2;
            ctx.drawImage(img, (dx * i + f) / scale, 0);
        }
        ctx.restore();
    }
}

function createTextView(style) {
    let text = '',
        x,
        y,
        fs;
    let { fill, stroke, textAlign, fontFamily = 'system' } = style;

    return {
        render,
        setText,
        setPosition,
        setFontSize,
        setContext,
    };

    function setText(t) {
        text = t;
    }

    function setPosition(nx, ny) {
        x = nx;
        y = ny;
    }

    function setFontSize(fontSize) {
        fs = fontSize;
    }

    function render(ctx) {
        ctx.save();
        ctx.font = `${fs}px ${fontFamily}`;
        ctx.fillStyle = fill;
        if (textAlign) {
            ctx.textAlign = textAlign;
        }
        ctx.fillText(text, x, y);
        if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.strokeText(text, x, y);
        }
        ctx.restore();
    }

    function setContext(c) {
        // ctx = c;
    }
}
