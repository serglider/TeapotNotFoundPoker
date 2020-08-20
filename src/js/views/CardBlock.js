function createCardBlock(cardHeight, canvasWidth, y, onCardClick) {
    let ctx;
    let cardViews = [];
    const margin = Math.round(cardHeight * 0.06);
    const cardWidth = Math.round(cardHeight * 0.66);

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
    };

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
        const bw = margin + 5 * (cardWidth + margin);
        const x = (canvasWidth - bw) / 2;
        cardViews = Array.from({ length: 5 }, (_, i) => {
            const cx = x + i * (cardWidth + margin);
            const view = createCardView(cx, y, cardWidth, cardHeight, margin);
            view.setContext(ctx);
            return view;
        });
    }

    function update() {
        cardViews.forEach((view) => view.update());
    }

    function setCards(cards, isInit) {
        const tasks = cardViews.map((view, i) => {
            view.setCard(cards[i]);
            return view.flip(0.16);
        });
        return Promise.all(tasks).then(() => {
            if (isInit) {
                return Promise.resolve();
            }
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
