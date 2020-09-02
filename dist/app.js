function getConstants() {
    return {
        // errors: {
        //     '400': 'Bad Request',
        //     '401': 'Unauthorized',
        //     '402': 'Payment Required',
        //     '403': 'Forbidden',
        //     '404': 'Not Found',
        //     '405': 'Method Not Allowed',
        //     '406': 'Not Acceptable',
        //     '407': 'Proxy Authentication Required',
        //     '408': 'Request Timeout',
        //     '409': 'Conflict',
        //     '410': 'Gone',
        //     '411': 'Length Required',
        //     '412': 'Precondition Failed',
        //     '413': 'Payload Too Large',
        //     '414': 'URI Too Long',
        //     '415': 'Unsupported Media Type',
        //     '416': 'Range Not Satisfiable',
        //     '417': 'Expectation Failed',
        //     '418': "I'm a teapot",
        // },
        hands: [
            ['', 0],
            ['Jacks or Better Pair', 1],
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
    const world = createWorld();
    const [cw, ch] = world.getBounds();
    const buttonY = ch * 0.8;
    let factor = 0.6;
    let cardH = Math.round(ch * factor);
    let cardW = Math.round(cardH * 0.66);
    let cardGap = Math.round(cardH * 0.06);
    let cardBlockW = 5 * (cardW + cardGap);
    const balanceY = ch * 0.2;

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
    const infoTextY = cardBlockY - cardGap * 1.5;
    const buttonH = Math.round(cardH * 0.2);

    const cardBlock = createCardBlock(
        cardW,
        cardH,
        cardBlockX,
        cardBlockY,
        cardGap,
        onCardClick
    );
    world.add(cardBlock);

    const balanceTF = createTextView('', cw / 2, balanceY, {
        fill: 'white',
        fontSize: fs1,
        fontFamily: 'Fredoka One',
    });
    world.add(balanceTF);

    const winTF = createTextView(
        '',
        cardBlockW + cardBlockX - cardGap,
        infoTextY,
        {
            fill: 'white',
            fontSize: fs2,
            textAlign: 'right',
        }
    );
    world.add(winTF);

    const handTF = createTextView('', cardBlockX, infoTextY, {
        fill: 'white',
        fontSize: fs2,
        textAlign: 'left',
    });
    world.add(handTF);

    const actionButton = createButton(
        cardBlockX,
        buttonY,
        cw / 2,
        buttonY + buttonH / 2,
        cardBlockW - cardGap,
        buttonH,
        'PLACE A BET',
        onAction
    );
    world.add(actionButton);

    let bet = 1;
    let balance = 411;
    let isInit = true;
    let deck;
    let cardsToReplace;
    let isComplete;
    let lockKeyboard;
    let teapots, resultPanel;

    return { init };

    function init(teapot1, teapot2) {
        teapots = createTeapots(cw, teapot1, teapot2);
        resultPanel = createResultPanel(cw, ch, teapot1, teapot2);
        world.add(teapots);
        world.add(resultPanel);
        cardBlock.init();
        displayBalance();
        toNextRound();
    }

    function enableControls() {
        lockKeyboard = keyboard.subscribe(onKey);
        actionButton.setInteractive(true);
    }

    function disableControls() {
        lockKeyboard();
        actionButton.setInteractive(false);
    }

    function onLose() {
        console.log('balance not found');
    }

    function onWin() {
        console.log('you win');
    }

    function placeBet() {
        disableControls();
        if (balance === 404) {
            return onLose();
        }
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

// TODO resize

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

function createWorld() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let objects = [];
    let dynamicObjects = [];
    let mouseListeners = [];
    let resizeObjects = [];

    canvas.addEventListener('touchstart', onClick);
    canvas.addEventListener('click', onClick);

    window.addEventListener('resize', onResize);

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';

        const cw = canvas.width;
        const ch = canvas.height;
        const buttonY = ch * 0.8;
        let factor = 0.6;
        let cardH = Math.round(ch * factor);
        let cardW = Math.round(cardH * 0.66);
        let cardGap = Math.round(cardH * 0.06);
        let cardBlockW = 5 * (cardW + cardGap);
        const balanceY = ch * 0.2;

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
        const infoTextY = cardBlockY - cardGap * 1.5;
        const buttonH = Math.round(cardH * 0.2);

        const data = {
            orientation:
                canvas.width > canvas.height ? 'landscape' : 'portrait',
            cw,
            ch,
            cardH,
            cardW,
            cardGap,
            cardBlockX,
            cardBlockY,
        };
        resizeObjects.forEach((obj) => obj.updateLayout(data));
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    requestAnimationFrame(loop);

    return {
        getBounds,
        add,
        // reset,
    };

    function getBounds() {
        return [canvas.width, canvas.height];
    }

    function add(obj) {
        obj.setContext(ctx);
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

    // function reset() {
    //     objects = [];
    //     dynamicObjects = [];
    //     mouseListeners = [];
    // }

    function loop(t) {
        update(t);
        clear();
        render();
        requestAnimationFrame(loop);
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update(t) {
        dynamicObjects.forEach((obj) => obj.update(t));
    }

    function render() {
        objects.forEach((obj) => obj.render());
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
            const isBetter = rb['2'][0].every((card) => card.value > 8);
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

function createButton(x, y, cx, cy, w, h, text, listener) {
    let ctx;
    let isInteractive = false;
    const r = Math.round(h * 0.1);
    const fs = Math.round(h * 0.66);

    return {
        render,
        setContext,
        setText,
        mouseListener,
        setInteractive,
    };

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

    function render() {
        ctx.save();
        ctx.fillStyle = '#C35B68';
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
        ctx.fillStyle = '#DCB600';
        ctx.font = `${fs}px "Fredoka One"`;
        ctx.fillText(text, cx, cy);
        ctx.restore();
    }

    function setContext(c) {
        ctx = c;
    }
}

function createCardBlock(cardWidth, cardHeight, x, y, cardGap, onCardClick) {
    let ctx;
    let cardViews = [];

    return {
        setContext,
        render,
        selectCard,
        replaceCards,
        getCards,
        setCards,
        init,
        mouseListener,
        update,
        updateLayout,
    };

    function updateLayout({ cardH, cardW, cardGap, cardBlockX, cardBlockY }) {
        cardViews.forEach((view, i) => {
            const cx = cardBlockX + i * (cardWidth + cardGap);
            view.updateLayout({
                cx,
                cardH,
                cardW,
                cardGap,
                cardBlockY,
            });
        });
    }

    function mouseListener(mouse) {
        let i = 0;
        for (; i < 5; i++) {
            if (cardViews[i].isPointInside(mouse)) {
                break;
            }
        }
        onCardClick(i);
    }

    function init() {
        cardViews = Array.from({ length: 5 }, (_, i) => {
            const cx = x + i * (cardWidth + cardGap);
            const view = createCardView(cx, y, cardWidth, cardHeight, cardGap);
            view.setContext(ctx);
            return view;
        });
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
            // if (isInit) {
            //     return Promise.resolve();
            // }
            return cardViews.reduce((accumulatorPromise, view) => {
                return accumulatorPromise.then(() => {
                    return view.flip(0.24);
                });
            }, Promise.resolve());
        });
    }

    function render() {
        cardViews.forEach((view) => view.render());
    }

    function setContext(c) {
        ctx = c;
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

function createCardView(x, y, w, h, margin) {
    let ctx;
    let card;
    let halfMargin = margin / 2;
    const back = '\ud83c\udcbf';

    let isFlipped = true;
    let isSwap = false;
    let scaleX = 1;
    let add = -0.16;
    let flipResolver = () => {};

    return {
        render,
        setContext,
        flip,
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
        margin = cardGap;
        halfMargin = margin / 2;
    }

    function isPointInside(point) {
        return inRange(point.x, x, x + w) && inRange(point.y, y, y + h);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    function render() {
        ctx.save();
        const shiftX = w / 2;
        ctx.translate(x + shiftX, y);
        ctx.scale(scaleX, 1);
        ctx.fillStyle = 'white';
        ctx.roundRect(shiftX * -1, 0, w, h - halfMargin, halfMargin);
        ctx.fill();
        ctx.font = `${h}px sans-serif`;
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

    function setContext(c) {
        ctx = c;
    }
}

function createResultPanel(cw, ch, img1, img2) {
    let ctx, w, h, scale, origX, origY;
    let isWin = false;
    let isShown = false;

    const tf1 = createTextView('Balance Not Found.', 0, 0, {
        fill: 'white',
        fontSize: 42,
    });

    const tf2 = createTextView('You lose', 0, 0, {
        fill: 'white',
        fontSize: 42,
    });

    updateLayout({ cw, ch });

    return {
        render,
        setContext,
        show,
        updateLayout,
    };

    function updateLayout({ cw, ch }) {
        scale = 1;
        const minSide = Math.min(cw, ch);

        w = img1.width * scale;
        h = img1.height * scale;
        while (w > minSide * 1.08) {
            scale -= 0.002;
            w = img1.width * scale;
            h = img1.height * scale;
        }

        origX = (cw - w) / 2;
        origY = (ch - h) / 2;

        tf1.setPosition(cw / 2, ch / 2);
        tf2.setPosition(cw / 2, ch / 2 + 42);
    }

    function show(isW) {
        isShown = true;
        isWin = isW;
        if (isWin) {
            tf1.setText('You are a Teapot.');
            tf2.setText('You won.');
        }
    }

    function render() {
        if (isShown) {
            ctx.save();
            ctx.fillStyle = '#668706';
            ctx.fillRect(0, 0, cw, ch);
            ctx.save();
            ctx.translate(origX, origY);
            ctx.scale(scale, scale);
            let img = isWin ? img1 : img2;
            ctx.drawImage(img, 0, 0);
            ctx.restore();
            tf1.render();
            tf2.render();
            ctx.restore();
        }
    }

    function setContext(c) {
        ctx = c;
        tf1.setContext(c);
        tf2.setContext(c);
    }
}

function createTeapots(cw, img1, img2) {
    let ctx, num, dx, scale, w;
    updateLayout({ cw });

    return {
        render,
        setContext,
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

    function render() {
        ctx.save();
        ctx.scale(scale, scale);
        for (let i = 0; i < 14; i++) {
            const f = dx / 2 - w / 2;
            let img = i < num ? img1 : img2;
            ctx.drawImage(img, (dx * i + f) / scale, 0);
        }
        ctx.restore();
    }

    function setContext(c) {
        ctx = c;
    }
}

function createTextView(text, x, y, style) {
    let ctx;
    const { fontSize, fill, stroke, textAlign, fontFamily = 'system' } = style;

    return {
        render,
        setContext,
        setText,
        setPosition,
    };

    function setText(t) {
        text = t;
    }

    function setPosition(nx, ny) {
        x = nx;
        y = ny;
    }

    function render() {
        ctx.save();
        ctx.font = `${fontSize}px ${fontFamily}`;
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
        ctx = c;
    }
}
