/* 
Values:     |  Suites:
1: A        |  0: Spades   (black)
2-10: 2-10  |  1: Hearts   (red)
11: J       |  2: Clubs    (black)
12: Q       |  3: Diamonds (red)
13: K       |
*/

export class Card {
    constructor(value, suite) {
        this.value = value;
        this.suite = suite;
    }
}

export class Deck {
    constructor() {
        this.cards = [];
        this.generateDeck();
    }

    generateDeck() {
        this.cards = [];
        for (let suite = 0; suite < 4; suite++) {
            for (let value = 1; value <= 13; value++){
                this.cards.push(new Card(value, suite));
            }
        }
    }
}