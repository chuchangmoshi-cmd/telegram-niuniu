import type { FC } from "react";

interface Props {
  room: any;
  me: any;

  isOwner: boolean;
  allReady: boolean;

  onReady: () => void;
  onCancelReady: () => void;
  onStartGame: () => void;
  onRob: (value: boolean) => void;
  onBet: (value: number) => void;
  onShow: () => void;
}

export const GameActions: FC<Props> = ({
  room,
  me,

  isOwner,
  allReady,

  onReady,
  onCancelReady,
  onStartGame,
  onRob,
  onBet,
  onShow,
}) => {
  if (!room || !me) {
    return null;
  }

  return (
    <>
      {/* 房主开始 */}
      {isOwner && room.status === "waiting" && (
        <>
          <button
            onClick={onStartGame}
            disabled={!allReady}
          >
            {allReady
              ? "🎮 开始游戏"
              : "等待所有玩家准备"}
          </button>

          <br />
          <br />
        </>
      )}

      {/* 准备 */}
      {room.status === "waiting" && (
        <>
          {me.ready ? (
            <button onClick={onCancelReady}>
              ❌ 取消准备
            </button>
          ) : (
            <button onClick={onReady}>
              ✅ 准备
            </button>
          )}
        </>
      )}

      {/* 抢庄 */}
      {room.status === "rob" && (
        <>
          <h3>请选择是否抢庄</h3>

          {me.rob === undefined ? (
            <>
              <button
                onClick={() => onRob(true)}
              >
                🐮 抢庄
              </button>

              <button
                onClick={() => onRob(false)}
              >
                🙅 不抢
              </button>
            </>
          ) : (
            <p>✅ 已选择</p>
          )}
        </>
      )}

      {/* 下注 */}
      {room.status === "bet" && (
        <>
          <h3>请选择下注倍数</h3>

          {me.bet === undefined ? (
            <>
              <button
                onClick={() => onBet(1)}
              >
                1倍
              </button>

              <button
                onClick={() => onBet(2)}
              >
                2倍
              </button>

              <button
                onClick={() => onBet(3)}
              >
                3倍
              </button>

              <button
                onClick={() => onBet(4)}
              >
                4倍
              </button>
            </>
          ) : (
            <p>✅ 已下注 {me.bet} 倍</p>
          )}
        </>
      )}

      {/* 亮牌 */}
      {room.status === "show" && (
        <>
          <h3>请选择亮牌</h3>

          {me.show ? (
            <p>✅ 已亮牌</p>
          ) : (
            <button onClick={onShow}>
              🃏 亮牌
            </button>
          )}
        </>
      )}
    </>
  );
};