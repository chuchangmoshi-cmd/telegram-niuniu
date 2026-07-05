const suitRank = {
  "♦": 1,
  "♣": 2,
  "♥": 3,
  "♠": 4,
};

// 获取单张牌点数
function getCardPoint(card) {
  switch (card.value) {
    case "A":
      return 1;

    case "J":
    case "Q":
    case "K":
      return 10;

    default:
      return Number(card.value);
  }
}

// 获取五张牌点数
function getPoints(cards) {
  return cards.map(getCardPoint);
}

// 计算牛几
function getNiuType(cards) {
  const points = getPoints(cards);

  // 枚举任意三张牌
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (let k = j + 1; k < 5; k++) {
        const sum3 =
          points[i] +
          points[j] +
          points[k];

        // 三张牌必须是10的倍数
        if (sum3 % 10 === 0) {
          const sum2 =
            points.reduce((a, b) => a + b, 0) -
            sum3;

          const niu = sum2 % 10;

          return niu === 0 ? 10 : niu;
        }
      }
    }
  }

  return 0;
}

function isFiveSmall(cards) {
  const points = getPoints(cards);

  const sum = points.reduce((a, b) => a + b, 0);

  return (
    sum <= 10 &&
    points.every((p) => p <= 5)
  );
}

function isBomb(cards) {
  const map = {};

  cards.forEach((card) => {
    map[card.value] = (map[card.value] || 0) + 1;
  });

  return Object.values(map).includes(4);
}

function isFiveFlower(cards) {
  return cards.every((card) =>
    ["J", "Q", "K"].includes(card.value)
  );
}

function getCardType(cards) {
  if (isFiveSmall(cards)) {
    return 16;
  }

  if (isBomb(cards)) {
    return 15;
  }

  if (isFiveFlower(cards)) {
    return 14;
  }

  return getNiuType(cards);
}

function getMaxCard(cards) {
  return cards.reduce((max, card) => {
    const p1 = getCardPoint(card);
    const p2 = getCardPoint(max);

    if (p1 > p2) {
      return card;
    }

    if (p1 < p2) {
      return max;
    }

    return suitRank[card.suit] >
      suitRank[max.suit]
      ? card
      : max;
  });
}

function getTypeName(type) {
  switch (type) {
    case 16:
      return "五小牛";

    case 15:
      return "炸弹牛";

    case 14:
      return "五花牛";

    case 10:
      return "牛牛";

    case 0:
      return "无牛";

    default:
      return `牛${type}`;
  }
}

// 比较两副牌
function compareCards(banker, player) {
  const bankerType = getCardType(banker.cards);
  const playerType = getCardType(player.cards);

  // 先比牌型
  if (bankerType > playerType) {
    return 1;
  }

  if (bankerType < playerType) {
    return -1;
  }

  // 再比最大牌
  const bankerMax = getMaxCard(banker.cards);
  const playerMax = getMaxCard(player.cards);

  const bankerPoint = getCardPoint(bankerMax);
  const playerPoint = getCardPoint(playerMax);

  if (bankerPoint > playerPoint) {
    return 1;
  }

  if (bankerPoint < playerPoint) {
    return -1;
  }

  // 最后比花色
  if (
    suitRank[bankerMax.suit] >
    suitRank[playerMax.suit]
  ) {
    return 1;
  }

  if (
    suitRank[bankerMax.suit] <
    suitRank[playerMax.suit]
  ) {
    return -1;
  }

  // 完全相同庄家赢
  return 1;
}

// 获取倍率
function getMultiplier(type) {
  switch (type) {
    case 16: // 五小牛
      return 6;

    case 15: // 炸弹牛
      return 5;

    case 14: // 五花牛
      return 5;

    case 10: // 牛牛
      return 4;

    case 9: // 牛九
      return 3;

    case 8: // 牛八
      return 2;

    case 7: // 牛七
      return 2;

    default:
      return 1;
  }
}

export {
  getCardPoint,
  getPoints,
  getNiuType,
  getCardType,
  compareCards,
  getMultiplier,
};