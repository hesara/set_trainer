enum Color {
  Red,
  Blue,
  Green,
}

enum Shape {
  Rectangle,
  Oval,
  Wave,
}

enum Filling {
  Empty,
  Half,
  Full,
}

enum Count {
  One = 1,
  Two = 2,
  Three = 3,
}

type Card = {
  color: Color;
  shape: Shape;
  filling: Filling;
  count: Count;
}

function cardsEqual(a: Card, b: Card): boolean {
  return a.color === b.color && a.shape === b.shape && a.filling === b.filling && a.count === b.count;
}

class GameState {
  foundSets: Card[][];

  constructor() {
    this.foundSets = [];
  };

  isFound(card1: Card, card2: Card, card3: Card): boolean {
    const sorted = [card1, card2, card3].sort();
    return this.foundSets.some((found) => {
      return cardsEqual(found[0], sorted[0])
        && cardsEqual(found[1], sorted[1])
        && cardsEqual(found[2], sorted[2]);
    });
  }

  addFound(card1: Card, card2: Card, card3: Card): void {
    const sorted = [card1, card2, card3].sort();
    if (this.isFound(card1, card2, card3)) {
      throw "Trying to add an already found set";
    }
    this.foundSets.push(sorted);

    this.updateFoundTable();
  }

  updateFoundTable(): void {
    const strip = document.getElementById("foundStrip")!;
    const last_i = this.foundSets.length - 1;
    const slot = strip.children[last_i] as HTMLElement;
    const cards = slot.getElementsByClassName("found-card");

    for (let j = 0; j < 3; j++) {
      let cur_card = this.foundSets[last_i][j];
      cards[j].replaceChildren(generateCardSvg(cur_card.shape, cur_card.color, cur_card.filling, cur_card.count));
    }

    const countSpan = document.getElementById("foundNo")!;
    countSpan.innerHTML = this.foundSets.length.toString();
  }
}

function generateShapePathSvg(shape: Shape, color: Color, filling: Filling): SVGGElement {
  let svgG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let svgShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const strokeWidth = "5";

  const colorHex = (() => {
    switch (color) {
      case Color.Red:
        return "#d55e00";
      case Color.Green:
        return "#000000";
      case Color.Blue:
        return "#56b4e9";
    }
  })();

  svgShape.style.strokeWidth = strokeWidth;
  svgShape.style.stroke = colorHex;
  svgShape.style.fill = "none";
  if (filling === Filling.Full) {
    svgShape.style.fill = colorHex;
  }

  switch (shape) {
    case Shape.Oval:
      svgShape.setAttribute("d",
        "M 5,25 v 50 c 0,27 50,27 50,0 v -50 c 0,-27 -50,-27 -50,0 z"
      );
      svgG.appendChild(svgShape);
      if (filling === Filling.Half) {
        [
          "M 6.3,15 H 52",
          "M 5,29 H 55",
          "M 5,43 H 55",
          "M 5,57 H 55",
          "M 5,71 H 55",
          "M 6.3,85 H 52",
        ].forEach((d) => {
          let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          line.style.strokeWidth = strokeWidth;
          line.style.stroke = colorHex;
          line.setAttribute("d", d);
          svgG.appendChild(line);
        })
      }
      break;
    case Shape.Wave:
      svgShape.setAttribute("d",
        "M 10,95 \
       c 10,-10 10,-35 0,-45 \
       s -10,-25 0,-45 \
       h 40 \
       c -10,10 -10,35 0,45 \
       s 10,25 0,45 \
       z"
      );
      svgG.appendChild(svgShape);
      if (filling === Filling.Half) {
        [
          "M 6.3,15 H 42",
          "M 5,29 H 41",
          "M 5,43 H 44",
          "M 14,57 H 54",
          "M 15,71 H 55",
          "M 14,85 H 53",
        ].forEach((d) => {
          let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          line.style.strokeWidth = strokeWidth;
          line.style.stroke = colorHex;
          line.setAttribute("d", d);
          svgG.appendChild(line);
        })
      }
      break;
    case Shape.Rectangle:
      svgShape.setAttribute("d",
        "M 30,5 l 25,45 l -25,45 l -25,-45 z"
      );
      svgG.appendChild(svgShape);
      if (filling === Filling.Half) {
        [
          "M 25,15 h 10",
          "M 15,29 h 30",
          "M 9,43 h 40",
          "M 10,57 h 42",
          "M 15,71 h 30",
          "M 25,85 h 10",
        ].forEach((d) => {
          let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          line.style.strokeWidth = strokeWidth;
          line.style.stroke = colorHex;
          line.setAttribute("d", d);
          svgG.appendChild(line);
        })
      }
      break;
  }

  return svgG;
}

function generateCardSvg(shape: Shape, color: Color, filling: Filling, count: Count): SVGElement {
  const shapePath = generateShapePathSvg(shape, color, filling);
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute("width", "180");
  svg.setAttribute("height", "100");
  svg.setAttribute("viewBox", "0 0 180 100");

  switch (count) {
    case Count.One:
      shapePath.setAttribute("transform", "translate(60)");
      svg.appendChild(shapePath);
      break;
    case Count.Two:
      shapePath.setAttribute("transform", "translate(30)");
      svg.appendChild(shapePath);
      const otherPath = shapePath.cloneNode(true) as (typeof shapePath);
      otherPath.setAttribute("transform", "translate(90)");
      svg.appendChild(otherPath);
      break;
    case Count.Three:
      svg.appendChild(shapePath);
      const secondPath = shapePath.cloneNode(true) as (typeof shapePath);
      secondPath.setAttribute("transform", "translate(60)");
      svg.appendChild(secondPath);
      const thirdPath = shapePath.cloneNode(true) as (typeof shapePath);
      thirdPath.setAttribute("transform", "translate(120)");
      svg.appendChild(thirdPath);
      break;
  }

  return svg;
}


function card_to_string(card: Card): string {
  return `${Color[card.color]} ${Shape[card.shape]} ${Filling[card.filling]} ${Count[card.count]}`;
}


function is_set(card1: Card, card2: Card, card3: Card): boolean {
  const color_set = new Set([card1.color, card2.color, card3.color]);
  if (color_set.size === 2) {
    return false;
  }
  const shape_set = new Set([card1.shape, card2.shape, card3.shape]);
  if (shape_set.size === 2) {
    return false;
  }
  const filling_set = new Set([card1.filling, card2.filling, card3.filling]);
  if (filling_set.size === 2) {
    return false;
  }
  const count_set = new Set([card1.count, card2.count, card3.count]);
  if (count_set.size === 2) {
    return false;
  }

  return true;
}
function find_sets(cards: Card[]): Card[][] {
  let sets: Card[][] = [];

  for (let card1_i = 0; card1_i < cards.length; card1_i++) {
    for (let card2_i = card1_i + 1; card2_i < cards.length; card2_i++) {
      for (let card3_i = card2_i + 1; card3_i < cards.length; card3_i++) {
        const card1 = cards[card1_i];
        const card2 = cards[card2_i];
        const card3 = cards[card3_i];

        if (is_set(card1, card2, card3)) {
          sets.push([card1, card2, card3]);
        }
      }
    }
  }

  return sets;
}

// From https://stackoverflow.com/a/2450976
function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function new_set_of_6(all_cards: Card[]): Card[] {
  let found: Card[] = [];
  while (found.length === 0) {
    shuffle(all_cards);
    const testing = all_cards.slice(0, 12)
    const sets = find_sets(testing);
    if (sets.length === 6) {
      found = testing;
    }
  }
  return found;
}

let currentGameState: GameState = new GameState();

const allCards: Card[] = (() => {
  let cards: Card[] = [];
  for (const color of Object.values(Color)
    .filter((e) => isNaN(Number(e)))
    .map((e) => Color[e as keyof typeof Color])) {
    for (const shape of Object.values(Shape)
      .filter((e) => isNaN(Number(e)))
      .map((e) => Shape[e as keyof typeof Shape])) {
      for (const filling of Object.values(Filling)
        .filter((e) => isNaN(Number(e)))
        .map((e) => Filling[e as keyof typeof Filling])) {
        for (const count of Object.values(Count)
          .filter((e) => isNaN(Number(e)))
          .map((e) => Count[e as keyof typeof Count])) {
          cards.push({ color: color, shape: shape, filling: filling, count: count });
        }
      }
    }
  }
  return cards;
})();

function main() {
  let current_set = new_set_of_6(allCards);

  const card_elements = Array.from(document.getElementsByClassName("card"));

  const zipped: [Card, Element][] = current_set.map((a, i) => [a, card_elements[i]]);
  zipped.forEach(([card, element]) => {
    let elem = element as HTMLElement;
    elem.appendChild(generateCardSvg(card.shape, card.color, card.filling, card.count));
    elem.setAttribute("data-card", JSON.stringify(card))

    elem.onclick = (ev) => {

      element.classList.toggle("card-selected");

      const selected_card_elements = Array.from(document.getElementsByClassName("card-selected"));
      console.log(selected_card_elements);
      if (selected_card_elements.length === 3) {
        const selected1: Card = JSON.parse(selected_card_elements[0].getAttribute("data-card") || "");
        const selected2: Card = JSON.parse(selected_card_elements[1].getAttribute("data-card") || "");
        const selected3: Card = JSON.parse(selected_card_elements[2].getAttribute("data-card") || "");

        if (is_set(selected1, selected2, selected3)) {
          if (!currentGameState.isFound(selected1, selected2, selected3)) {
            currentGameState.addFound(selected1, selected2, selected3);
            console.log("Found a set!");
          }
          else {
            console.log("Set already found");
          }
        }

        selected_card_elements.forEach((e) => { e.classList.toggle("card-selected", false) });

      }
    };
  });
}

main();

