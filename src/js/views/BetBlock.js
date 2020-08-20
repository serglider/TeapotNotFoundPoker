function createBetBlock(x, y, r) {
    let ctx;
    const gap = Math.round(r * 0.1);
    const coinsViews = [createCoinView(x, y, r)];

    return {
        setContext,
        render,
        addCoin,
        removeCoin,
    };

    function addCoin() {
        const cx = x + coinsViews.length * (2 * r + gap);
        const coinView = createCoinView(cx, y, r);
        coinView.setContext(ctx);
        coinsViews.push(coinView);
    }

    function removeCoin() {
        coinsViews.pop();
    }

    function render() {
        coinsViews.forEach((view) => view.render());
    }

    function setContext(c) {
        ctx = c;
        coinsViews.forEach((view) => view.setContext(c));
    }
}
