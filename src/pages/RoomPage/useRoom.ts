import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "@/socket";
import { login } from "@/user";

import {
  getRoom,
  nextRound,
} from "@/api/room";

import {
  ready,
  cancelReady,
  startGame,
  rob,
  bet,
  show,
} from "@/api/game";

export function useRoom() {
  const { roomId } = useParams();

  const [room, setRoom] = useState<any>(null);
  const [currentUser, setCurrentUser] =
    useState<any>(null);

  useEffect(() => {
    login().then(setCurrentUser);
  }, []);

  useEffect(() => {
    if (!roomId) return;

    loadRoom();

    socket.emit("join-room", roomId);

    socket.on("room-update", setRoom);

    return () => {
      socket.off("room-update", setRoom);
    };
  }, [roomId]);

  async function loadRoom() {
    const data = await getRoom(Number(roomId));

    if (data.success) {
      setRoom(data.room);
    }
  }

  const playerId = currentUser?.id;

  const me = useMemo(() => {
    if (!room || !playerId) return null;

    return room.players.find(
      (p: any) => p.id === playerId
    );
  }, [room, playerId]);

  const isOwner = useMemo(() => {
    if (!room || !playerId) return false;

    return room.ownerId === playerId;
  }, [room, playerId]);

  const allReady = useMemo(() => {
    if (!room) return false;

    return (
      room.players.length >= 2 &&
      room.players.every(
        (p: any) => p.ready
      )
    );
  }, [room]);

  async function readyClick() {
    await ready({
      roomId,
      playerId,
    });
  }

  async function cancelReadyClick() {
    await cancelReady({
      roomId,
      playerId,
    });
  }

  async function startGameClick() {
    await startGame({
      roomId,
    });
  }

  async function robClick(value: boolean) {
    await rob({
      roomId,
      playerId,
      rob: value,
    });
  }

  async function betClick(value: number) {
    await bet({
      roomId,
      playerId,
      bet: value,
    });
  }

  async function showClick() {
    await show({
      roomId,
      playerId,
    });
  }

  async function nextRoundClick() {
    await nextRound({
      roomId,
      playerId,
    });
  }

  return {
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
  };
}