function createGame(keyboard) {
    const world = createWorld();
    const [cw, ch] = world.getBounds();
    const cardH = Math.round(ch * 0.3);
    const cardW = Math.round(cardH * 0.66);
    const cardGap = Math.round(cardH * 0.06);
    const fs = cardGap * 2;
    const cardBlockW = 5 * (cardW + cardGap);
    const cardBlockX = (cw - cardBlockW) / 2;
    const infoTextY = cardH - cardGap * 2;

    const cardBlock = createCardBlock(
        cardW,
        cardH,
        cardBlockX,
        cardH,
        cardGap,
        onCardClick
    );
    world.add(cardBlock);

    const balanceTF = createTextView('', cw / 2, cardH / 3, {
        fill: 'white',
        fontSize: fs,
        fontFamily: window.ff,
    });
    world.add(balanceTF);

    const errorTF = createTextView('', cw / 2, cardH / 3 + fs * 2, {
        fill: '#DCB600',
        fontSize: fs,
        fontFamily: 'monospace',
    });
    world.add(errorTF);

    const winTF = createTextView(
        '',
        cardBlockW + cardBlockX - cardGap,
        infoTextY,
        {
            fill: 'white',
            fontSize: fs,
            textAlign: 'right',
        }
    );
    world.add(winTF);

    const handTF = createTextView('', cardBlockX, infoTextY, {
        fill: 'white',
        fontSize: fs,
        textAlign: 'left',
    });
    world.add(handTF);

    const bw = 80;
    const actionButton = createButton(
        cardBlockX,
        cardH * 2.5,
        cw / 2,
        cardH * 2.5 + bw / 2,
        cardBlockW - cardGap,
        bw,
        'PLACE A BET',
        onAction
    );
    world.add(actionButton);

    let bet = 1;
    let balance = 404;
    let isInit = true;
    let deck;
    let cardsToReplace;
    let isComplete;
    let lockKeyboard;

    return { init };

    function init() {
        cardBlock.init();
        setBalanceText();
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
        setBalanceText();
        handTF.setText('');
        winTF.setText('');
        actionButton.setText('SUBMIT');
    }

    function setBalanceText() {
        const { errors } = getConstants();
        const err = errors[balance] || '';
        // const add = err ? ` (${err})` : '';
        errorTF.setText(err);
        balanceTF.setText(`BALANCE ${balance}`);
    }

    function adjustBalance(actualBalance) {
        if (actualBalance < 404) {
            return 404;
        }
        if (actualBalance < 418) {
            return actualBalance;
        }
        return 404 + ((actualBalance - 418) % 14);
    }

    function confirmSelection() {
        const hand = cardBlock.getCards();
        const [name, win] = rateHand(hand);
        balance += win;
        setBalanceText();
        handTF.setText(name);
        if (win) {
            winTF.setText(`Win ${win}`);
        } else {
            winTF.setText('Better luck next time');
        }
        setTimeout(onComplete, 1000);
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

    function onComplete() {
        if (balance !== 418) {
            balance = adjustBalance(balance);
            setBalanceText();
            toNextRound();
        } else {
            // infoTF.setText('You won');
        }
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
