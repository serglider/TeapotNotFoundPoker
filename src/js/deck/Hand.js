function rateHand(cards) {
    const { hands } = getConstants();
    const pool = [...cards].sort(valueComparator);
    let isStraight = true;
    let isFlush = true;

    const kinds = pool.reduce((result, card, index) => {
        if (isStraight && index !== 0) {
            isStraight = card.value === pool[index - 1].value - 1;
        }
        if (isFlush && index !== 0) {
            isFlush = card.suit === pool[index - 1].suit;
        }
        if (result[card.rank]) {
            result[card.rank].push(card);
        } else {
            result[card.rank] = [card];
        }
        return result;
    }, {});

    let rate = hands[0];

    const isStraightFlush = isFlush && isStraight;
    const isRoyalFlush = isStraightFlush && kinds.a && kinds.a.length === 1;
    if (isRoyalFlush) {
        rate = hands[9];
    } else if (isStraightFlush) {
        rate = hands[8];
    } else if (isFlush) {
        rate = hands[5];
    } else if (isStraight) {
        rate = hands[4];
    } else {
        const rb /* repetition buckets*/ = Object.keys(kinds).reduce(
            (result, rank) => {
                const len = kinds[rank].length;
                result[len].push(kinds[rank]);
                return result;
            },
            { '1': [], '2': [], '3': [], '4': [] }
        );

        if (rb['4'].length === 1) {
            rate = hands[7];
        } else if (rb['2'].length === 1 && rb['3'].length === 1) {
            rate = hands[6];
        } else if (rb['3'].length === 1) {
            rate = hands[3];
        } else if (rb['2'].length === 2) {
            rate = hands[2];
        } else if (rb['2'].length === 1) {
            const isBetter = rb['2'][0].every((card) => card.value > 8);
            if (isBetter) {
                rate = hands[1];
            }
        }
    }

    return rate;

    function valueComparator(card1, card2) {
        if (card1.value < card2.value) {
            return 1;
        }
        if (card1.value > card2.value) {
            return -1;
        }
        return 0;
    }
}
