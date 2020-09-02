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
