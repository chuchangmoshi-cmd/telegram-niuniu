import { request } from "./index";

export function ready(data: any) {
  return request("/ready", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function cancelReady(data: any) {
  return request("/cancel-ready", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function startGame(data: any) {
  return request("/start-game", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function rob(data: any) {
  return request("/rob", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function bet(data: any) {
  return request("/bet", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function show(data: any) {
  return request("/show", {
    method: "POST",
    body: JSON.stringify(data),
  });
}