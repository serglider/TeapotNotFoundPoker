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

    function setCards(cards) {
        cardViews.forEach((view, i) => {
            view.setSelected(true);
            view.setCard(cards[i]);
        });

        return new Promise((resolve) => {
            setTimeout(() => {
                cardViews.forEach((view) => view.setSelected(false));
                resolve();
            }, 500);
        });
    }

    function render() {
        cardViews.forEach((view) => view.render());
    }

    function setContext(c) {
        ctx = c;
    }

    function selectCard(index) {
        cardViews[index].setSelected(true);
    }

    function replaceCards(drawData) {
        drawData.forEach(([index, card]) => {
            cardViews[index].setCard(card);
            cardViews[index].setSelected(false);
        });
    }

    function getCards() {
        return cardViews.map((view) => view.getCard());
    }
}
