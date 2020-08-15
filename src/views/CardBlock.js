function createCardBlock(cardHeight, canvasWidth, y) {
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
    };

    function setCards(cards, isInit) {
        const delay = isInit ? 2000 : 500;
        const bw = margin + cards.length * (cardWidth + margin);
        const x = (canvasWidth - bw) / 2;
        cardViews = cards.map((card, i) => {
            const cx = x + i * (cardWidth + margin);
            const view = createCardView(
                card,
                cx,
                y,
                cardWidth,
                cardHeight,
                margin
            );
            view.setSelected(true);
            return view;
        });
        cardViews.forEach((view) => view.setContext(ctx));

        return new Promise((resolve) => {
            setTimeout(() => {
                cardViews.forEach((view) => view.setSelected(false));
                resolve();
            }, delay);
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
