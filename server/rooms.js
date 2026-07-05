// server/rooms.js

const rooms = {};

// 获取所有房间
export function getRooms() {
  return rooms;
}

// 获取指定房间
export function getRoom(roomId) {
  return rooms[roomId];
}

// 创建房间
export function createRoom(room) {
  rooms[room.id] = room;
  return room;
}

// 删除房间
export function removeRoom(roomId) {
  delete rooms[roomId];
}

// 获取房间列表
export function getRoomList() {
  return Object.values(rooms);
}

// 玩家加入房间
export function addPlayer(roomId, player) {
  const room = rooms[roomId];

  if (!room) {
    return null;
  }

  // 已存在则直接返回
  const exist = room.players.find(
    (p) => p.telegramId === player.telegramId
  );

  if (exist) {
    return exist;
  }

  room.players.push(player);

  return player;
}

// 玩家离开房间（后面断线重连会用到）
export function removePlayer(roomId, playerId) {
  const room = rooms[roomId];

  if (!room) {
    return;
  }

  room.players = room.players.filter(
    (p) => p.id !== playerId
  );
}

// 重置玩家状态（每局开始前调用）
export function resetPlayers(roomId) {
  const room = rooms[roomId];

  if (!room) {
    return;
  }

  room.players.forEach((player) => {
    player.ready = false;
    player.rob = undefined;
    player.bet = undefined;
    player.cards = [];
    player.result = null;
  });
}