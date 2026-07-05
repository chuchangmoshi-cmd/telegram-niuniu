import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { socket } from "@/socket";

import { getRoom } from "@/api/room";

import { useUser } from "./useUser";

export function useRoom() {
  const { roomId } = useParams();

  const { user } = useUser();

  const [room, setRoom] =
    useState<any>(null);

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
    const data = await getRoom(
      Number(roomId)
    );

    if (data.success) {
      setRoom(data.room);
    }
  }

  const me = useMemo(() => {
    if (!room || !user) return null;

    return room.players.find(
      (p: any) => p.id === user.id
    );
  }, [room, user]);

  const isOwner = useMemo(() => {
    if (!room || !user) return false;

    return room.ownerId === user.id;
  }, [room, user]);

  const allReady = useMemo(() => {
    if (!room) return false;

    return (
      room.players.length >= 2 &&
      room.players.every(
        (p: any) => p.ready
      )
    );
  }, [room]);

  return {
    room,

    me,

    playerId: user?.id,

    isOwner,

    allReady,

    reloadRoom: loadRoom,
  };
}