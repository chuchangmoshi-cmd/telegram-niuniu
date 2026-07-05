import { create } from "zustand";

interface RoomState {
  room: any;

  setRoom: (room: any) => void;

  clearRoom: () => void;
}

export const useRoomStore =
  create<RoomState>((set) => ({
    room: null,

    setRoom: (room) =>
      set({
        room,
      }),

    clearRoom: () =>
      set({
        room: null,
      }),
  }));