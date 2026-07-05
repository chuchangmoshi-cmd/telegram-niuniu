import type { FC } from "react";
import { PlayerItem } from "@/components/PlayerItem";

interface Props {
  room: any;
  playerId: number;
}

export const PlayerList: FC<Props> = ({
  room,
  playerId,
}) => {
  if (!room) return null;

  const maxPlayers = room.maxPlayers || 6;

  return (
    <>
      <h3>👥 玩家列表</h3>

      {Array.from({ length: maxPlayers }).map(
        (_, index) => {
          const player = room.players[index];

          if (!player) {
            return (
              <p key={index}>
                ➕ 空位
              </p>
            );
          }

          return (
            <PlayerItem
              key={player.id}
              player={player}
              playerId={playerId}
              roomStatus={room.status}
            />
          );
        }
      )}

      <hr />
    </>
  );
};