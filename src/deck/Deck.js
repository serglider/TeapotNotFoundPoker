function createDeck() {
    const { suits, ranks } = getConstants();
    const cards = suits.reduce((result, suit) => {
        const cardsWithRank = ranks.map((rank) => createCard(rank, suit));
        return [...result, ...cardsWithRank];
    }, []);

    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    function deal(num) {
        return cards.splice(num * -1);
    }

    return { deal };
}
