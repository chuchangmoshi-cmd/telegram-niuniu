import type { FC } from "react";

interface Props {
  me: any;
}

export const MyCards: FC<Props> = ({ me }) => {
  if (!me) return null;

  return (
    <>
      <h3>🃏 我的手牌</h3>

      {!me.cards || me.cards.length === 0 ? (
        <p>暂无手牌</p>
      ) : (
        <>
          {me.cards.map(
            (card: any, index: number) => (
              <p key={index}>
                {card.suit}
                {card.value}
              </p>
            )
          )}
        </>
      )}

      {me.show && (
        <>
          <br />

          <h3>牌型</h3>

          <p>
            {getCardTypeText(me.type)}
          </p>
        </>
      )}

      <hr />
    </>
  );
};

function getCardTypeText(type: number) {
  switch (type) {
    case 16:
      return "👑 五小牛";

    case 15:
      return "💥 炸弹牛";

    case 14:
      return "✨ 五花牛";

    case 10:
      return "🐮 牛牛";

    case 0:
      return "🐮 无牛";

    default:
      if (type > 0 && type < 10) {
        return `🐮 牛${type}`;
      }

      return "";
  }
}