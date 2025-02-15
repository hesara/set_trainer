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
  One,
  Two,
  Three,
}

type Card = {
  color: Color;
  shape: Shape;
  filling: Filling;
  count: Count;
}

function card_to_string(card: Card): string {
  return `${Color[card.color]} ${Shape[card.shape]} ${Filling[card.filling]} ${Count[card.count]}`;
}

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

function find_sets(cards: Card[]): Card[][] {
  let sets: Card[][] = [];

  for (let card1_i = 0; card1_i < cards.length; card1_i++) {
    for (let card2_i = card1_i + 1; card2_i < cards.length; card2_i++) {
      for (let card3_i = card2_i + 1; card3_i < cards.length; card3_i++) {
        const card1 = cards[card1_i];
        const card2 = cards[card2_i];
        const card3 = cards[card3_i];

        const color_set = new Set([card1.color, card2.color, card3.color]);
        if (color_set.size === 2) {
          continue;
        }
        const shape_set = new Set([card1.shape, card2.shape, card3.shape]);
        if (shape_set.size === 2) {
          continue;
        }
        const filling_set = new Set([card1.filling, card2.filling, card3.filling]);
        if (filling_set.size === 2) {
          continue;
        }
        const count_set = new Set([card1.count, card2.count, card3.count]);
        if (count_set.size === 2) {
          continue;
        }

        sets.push([card1, card2, card3]);
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

let current_set = new_set_of_6(allCards);

const btns = Array.from(document.getElementsByClassName("gridbutton"));

const zipped: [Card, Element][] = current_set.map((a, i) => [a, btns[i]]);
zipped.forEach(([card, element]) => {
  let elem = element as HTMLElement;
  elem.textContent = card_to_string(card);
  elem.onclick = () => {
    console.log(elem.id);
  };
});

