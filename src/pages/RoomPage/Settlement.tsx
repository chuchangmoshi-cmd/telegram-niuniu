import type { FC } from "react";

interface Props {
  room: any;
  playerId: number;
  onNextRound: () => void;
}

export const Settlement: FC<Props> = ({
  room,
  playerId,
  onNextRound,
}) => {
  if (!room) return null;

  if (room.status !== "settle") {
    return null;
  }

  return (
    <>
      <hr />

      <h2>🎉 本局结算</h2>

      {room.players.map((player: any) => (
        <p key={player.id}>
          {player.name}

          {player.result === "win" && " 🏆胜利"}

          {player.result === "lose" && " ❌失败"}

          {player.result === "banker" && " 👑庄家"}

          {"  "}

          💰{player.gold}

          {player.score !== undefined && (
            <>
              {" "}
              (
              {player.score > 0 ? "+" : ""}
              {player.score}
              )
            </>
          )}
        </p>
      ))}

      <br />

      {room.ownerId === playerId ? (
        <button onClick={onNextRound}>
          ▶️ 下一局
        </button>
      ) : (
        <p>等待房主开始下一局...</p>
      )}
    </>
  );
};