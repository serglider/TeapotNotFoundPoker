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

    function updateLayout({
        cardH,
        cardW,
        cardGap,
        cardBlockX,
        cardBlockY,
        cardsInRow,
    }) {
        cardViews.forEach((view, i) => {
            let cx, cy;
            const row = Math.floor(i / cardsInRow);
            cy = cardBlockY + row * (cardH + cardGap);
            if (i < cardsInRow) {
                cx = cardBlockX + i * (cardW + cardGap);
            } else {
                cx =
                    cardBlockX +
                    cardW / 2 +
                    (i - cardsInRow) * (cardW + cardGap);
            }
            view.updateLayout({
                cx,
                cy,
                cardH,
                cardW,
                cardGap,
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
