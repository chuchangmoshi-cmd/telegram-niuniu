import type { FC } from "react";
import { Page } from "@/components/Page";

import { useRoom } from "./useRoom";
import { RoomHeader } from "./RoomHeader";
import { PlayerList } from "./PlayerList";
import { MyCards } from "./MyCards";
import { GameActions } from "./GameActions";
import { Settlement } from "./Settlement";

export const RoomPage: FC = () => {
  const {
    room,

    me,

    playerId,

    isOwner,

    allReady,

    readyClick,
    cancelReadyClick,

    startGameClick,

    robClick,

    betClick,

    showClick,

    nextRoundClick,
  } = useRoom();

  if (!room) {
    return (
      <Page>
        <h2>房间不存在</h2>
      </Page>
    );
  }

  return (
    <Page>
      <RoomHeader room={room} />

      <PlayerList
        room={room}
        playerId={playerId}
      />

      <MyCards me={me} />

      <GameActions
        room={room}
        me={me}
        isOwner={isOwner}
        allReady={allReady}
        onReady={readyClick}
        onCancelReady={cancelReadyClick}
        onStartGame={startGameClick}
        onRob={robClick}
        onBet={betClick}
        onShow={showClick}
      />

      <Settlement
        room={room}
        playerId={playerId}
        onNextRound={nextRoundClick}
      />
    </Page>
  );
};