function createCard(rank, suit) {
    const { stringMap, ranks, colors } = getConstants();
    return {
        rank,
        suit,
        value: ranks.indexOf(rank),
        string: stringMap[rank + suit],
        color: colors[suit],
    };
}
