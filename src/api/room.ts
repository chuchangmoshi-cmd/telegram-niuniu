import { request } from "./index";

export function createRoom(data: any) {
  return request("/create-room", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function joinRoom(data: any) {
  return request("/join-room", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getRooms() {
  return request("/rooms");
}

export function getRoom(roomId: number) {
  return request(`/room/${roomId}`);
}

export function nextRound(data: any) {
  return request("/next-round", {
    method: "POST",
    body: JSON.stringify(data),
  });
}