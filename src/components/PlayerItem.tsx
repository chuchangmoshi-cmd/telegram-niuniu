import type { FC } from "react";

interface Props {
  player: any;
  playerId: number;
  roomStatus: string;
}

export const PlayerItem: FC<Props> = ({
  player,
  playerId,
  roomStatus,
}) => {
  return (
    <p>
      {player.banker ? "👑 " : "😀 "}

      {player.name}

      <>
  {" "}
  💰{player.gold}
</>

      {player.id === playerId && "（我）"}

      {player.ready ? "（已准备）" : "（未准备）"}

      {player.rob !== undefined && (
        <>
          {" "}
          {player.rob ? "🐮抢庄" : "🙅不抢"}
        </>
      )}

      {player.bet !== undefined && (
        <>
          {" "}
          💰{player.bet}倍
        </>
      )}

      {player.show && (
  <>
    {" "}
    {player.type === 16
      ? "👑 五小牛"
      : player.type === 15
      ? "💥 炸弹牛"
      : player.type === 14
      ? "✨ 五花牛"
      : player.type === 10
      ? "🐮 牛牛"
      : player.type === 0
      ? "🐮 无牛"
      : `🐮 牛${player.type}`}
  </>
)}

      {player.show && (
        <>
          {" "}
          🃏已亮牌
        </>
      )}

      {roomStatus === "settle" && (
        <>
          {" "}
          {player.result === "win" && "🏆胜利"}
          {player.result === "lose" && "❌失败"}
          {player.result === "banker" && "👑庄家"}
        </>
      )}

      {player.score !== undefined && (
  <>
    {" "}
    ({player.score > 0 ? "+" : ""}
    {player.score})
  </>
)}
    </p>
  );
};