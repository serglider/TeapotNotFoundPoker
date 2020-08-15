const world = createWorld();
const keyboard = createKeyboard();

const [cw, ch] = world.getBounds();
const cardH = Math.round(ch * 0.3);
const cardBlock = createCardBlock(cardH, cw, cardH);
world.add(cardBlock);
// const coinBlock = createBetBlock(100, 100, 50);
// world.add(coinBlock);
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

let bet = 1;
let balance = 100;
let deck;
let cardsToReplace;
let isComplete;

keyboard.subscribe(onKey);
startRound();

function startRound() {
    isComplete = false;
    cardsToReplace = [];
    balance -= bet;
    deck = createDeck();
    const cards = deck.deal(5);
    cardBlock.setCards(cards);
    balanceTF.setText(`Balance: ${balance}`);
    infoTF.setText('');
}

// function changeBet(add) {
//     const b = bet + add;
//     if (b === 0 || b > 5) {
//         return;
//     }
//     bet = b;
//     if (add > 0) {
//         coinBlock.addCoin();
//     } else {
//         coinBlock.removeCoin();
//     }
// }

function placeBet() {
    isComplete = true;
    const crds = cardBlock.getCards();
    const [name, win] = rateHand(crds);
    balance += win;
    console.log(name, win, balance);
    balanceTF.setText(`Balance: ${balance}`);
    if (win) {
        infoTF.setText(`${name}, win ${win}`);
    } else {
        infoTF.setText('Better luck next time');
    }
}

function prepareDraw(index) {
    const i = cardsToReplace.indexOf(index);
    if (i === -1) {
        cardsToReplace.push(index);
        cardBlock.selectCard(index);
    }
}

function onKey(e) {
    if (e.isDigit && e.digit > 0 && e.digit < 6) {
        prepareDraw(e.digit - 1);
    } else if (e.isSpace) {
        if (isComplete) {
            startRound();
        } else if (cardsToReplace.length) {
            const drawCards = deck.deal(cardsToReplace.length);
            const drawData = cardsToReplace.map((index, i) => [
                index,
                drawCards[i],
            ]);
            cardBlock.replaceCards(drawData);
            placeBet();
        } else {
            placeBet();
        }
    }
    // else if (e.isPlus) {
    //     changeBet(1);
    // } else if (e.isMinus) {
    //     changeBet(-1);
    // }
}
