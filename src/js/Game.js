function createGame(keyboard) {
    const world = createWorld();
    const [cw, ch] = world.getBounds();
    const cardH = Math.round(ch * 0.3);
    const cardBlock = createCardBlock(cardH, cw, cardH, onCardClick);
    world.add(cardBlock);
    const balanceTF = createTextView('', cw / 2, cardH / 3, {
        fill: 'white',
        fontSize: 42,
    });
    world.add(balanceTF);

    const infoTF = createTextView('', cw / 2, cardH / 1.5, {
        fill: 'white',
        fontSize: 42,
    });
    world.add(infoTF);

    const actionButton = createButton(
        cw / 2,
        cardH * 2.5,
        400,
        80,
        'Place a bet',
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
        infoTF.setText('');
        actionButton.setText('Play');
    }

    function setBalanceText() {
        const { errors } = getConstants();
        const err = errors[balance];
        const add = err ? ` (${err})` : '';
        balanceTF.setText(`Balance: ${balance}${add}`);
    }

    function adjustBalance(actual) {
        return 404 + ((actual - 418) % 14);
    }

    function confirmSelection() {
        const hand = cardBlock.getCards();
        const [name, win] = rateHand(hand);
        balance += win;
        setBalanceText();
        if (win) {
            infoTF.setText(`${name}, win ${win}`);
        } else {
            infoTF.setText('Better luck next time');
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
        actionButton.setText('Place a bet');
        // infoTF.setText('');
    }

    function onComplete() {
        if (balance > 418) {
            balance = adjustBalance(balance);
            setBalanceText();
            toNextRound();
        } else if (balance < 418) {
            toNextRound();
        } else {
            infoTF.setText('You won');
        }
    }

    function prepareDraw(index) {
        const i = cardsToReplace.indexOf(index);
        if (i === -1) {
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
