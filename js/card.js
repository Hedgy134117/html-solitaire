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

    isBlack() {
        return this.suite % 2 == 0;
    }

    getStrValue() {
        if (this.value > 1 && this.value < 11) {
            return this.value;
        }
        let values = {
            1: "A",
            11: "J",
            12: "Q",
            13: "K"
        };
        return values[this.value];
    }

    getStrSuite() {
        let suites = {
            0: "S",
            1: "H",
            2: "C",
            3: "D"
        };
        return suites[this.suite];
    }
}