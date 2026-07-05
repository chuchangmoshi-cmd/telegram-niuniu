import type { FC } from "react";

interface Props {
  room: any;
}

export const RoomHeader: FC<Props> = ({ room }) => {
  if (!room) return null;

  return (
    <>
      <h2>🐮 牛牛房间</h2>

      <h3>房号：{room.id}</h3>

      <h3>状态：{getStatusText(room.status)}</h3>

      <h3>
        玩家：
        {room.players.length}
        {room.maxPlayers
          ? ` / ${room.maxPlayers}`
          : ""}
      </h3>

      <h3>
        底分：
        {room.baseScore ?? 100}
      </h3>

      <h3>
        抢庄模式：
        {room.robMode === "fixed"
          ? "固定庄"
          : "自由抢庄"}
      </h3>

      <hr />
    </>
  );
};

function getStatusText(status: string) {
  switch (status) {
    case "waiting":
      return "等待准备";

    case "rob":
      return "抢庄";

    case "bet":
      return "下注";

    case "show":
      return "亮牌";

    case "settle":
      return "结算";

    default:
      return status;
  }
}