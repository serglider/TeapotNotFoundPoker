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
            balanceTF,
            winTF,
            handTF,
            actionButton,
            teapots,
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
