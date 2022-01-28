/* 
Values:     |  Suites:
1: A        |  0: Spades   (black)
2-10: 2-10  |  1: Hearts   (red)
11: J       |  2: Clubs    (black)
12: Q       |  3: Diamonds (red)
13: K       |
*/

export class Card {
    constructor(value, suite, visible) {
        this.value = value;
        this.suite = suite;
        this.visible = visible;
        this.dom = null;
    }

    isBlack() {
        return this.suite % 2 == 0;
    }

    getStr() {
        return `${this.getStrValue()}${this.getStrSuite()}`;
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

    updateHTML() {
        if (this.visible) {
            this.dom.querySelector("p").innerText = this.getStr();
            this.dom.style.color = this.isBlack() ? "black" : "red";
        }
        else {
            this.dom.querySelector("p").innerText = "x";
        }
    }

    action() {
        console.log(this.getStr());
    }
}