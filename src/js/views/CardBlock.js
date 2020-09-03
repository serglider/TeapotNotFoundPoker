function createCardBlock(onCardClick) {
    let cardViews = [];

    return {
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
