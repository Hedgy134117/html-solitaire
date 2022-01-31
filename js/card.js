/* 
Values:     |  Suites:
1: A        |  0: Spades   (black)
2-10: 2-10  |  1: Hearts   (red)
11: J       |  2: Clubs    (black)
12: Q       |  3: Diamonds (red)
13: K       |
*/

export class Card {
    constructor(value, suite, visible, table) {
        this.value = value;
        this.suite = suite;
        this.visible = visible;
        this.table = table;
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

    moveDom(prevCard) {
        // card to be moved = CTBM
        // card to move to = CTMT

        let rows = Array.from(document.querySelectorAll(".row"));

        // row of the CTBM
        let rowCTBM = this.dom.parentElement;

        // index in the row of the CTBM
        let indexCTBM = rows.indexOf(rowCTBM);

        // row of the CTMT
        let rowCTMT = prevCard.dom.parentElement;

        // index in the row of the CTMT
        let indexCTMT = rows.indexOf(rowCTMT);

        // index of CTMT + 1 to get the reference node
        // row of the CTMT + 1 to get the parent node 
        let parent = rows[indexCTMT + 1]

        let toSwap = Array.from(parent.children)[indexCTMT];

        let thisParent = this.dom.parentElement;
        let thisSibling = this.dom.nextSibling;
        let toSwapParent = toSwap.parentElement;
        toSwapParent.insertBefore(this.dom, toSwap);
        thisParent.insertBefore(toSwap, thisSibling);
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
        if (this.table.selectedCardA == null) {
            this.table.selectedCardA = this;
            return;
        }
        this.table.selectedCardB = this;
        this.table.moveCard();
    }
}