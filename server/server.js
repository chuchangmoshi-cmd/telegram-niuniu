import User from "./models/User.js";
import "./database/mongo.js";
import {
  getNiuType,
  getCardType,
  compareCards,
  getMultiplier,
} from "./routes/game.js";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

// 一副扑克牌（52张，不含大小王）
const deck = [];

const suits = ["♠", "♥", "♣", "♦"];

const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

for (const suit of suits) {
  for (const value of values) {
    deck.push({
      suit,
      value,
    });
  }
}

// Socket连接
io.on("connection", (socket) => {
  console.log("用户连接：", socket.id);

  socket.on("join-room", (roomId) => {
  const id = roomId.toString();

  socket.join(id);

  console.log("Socket加入房间：", id);
});

  socket.on("disconnect", () => {
    console.log("用户离开：", socket.id);
  });
});

// 登录
app.post("/login", async (req, res) => {
  const { telegramId, name, username, avatar } = req.body;

  try {
    let user = await User.findOne({ telegramId });

    if (!user) {
      user = await User.create({
        telegramId,
        name,
        username,
        avatar,
      });

      console.log("✅ 新用户注册：", name);
    } else {
      console.log("👤 老用户登录：", name);
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);

    res.json({
      success: false,
    });
  }
});

// 创建房间
app.post("/create-room", (req, res) => {
  const {
    user,
    maxPlayers,
    baseScore,
    robMode,
  } = req.body;

  const roomId = Math.floor(100000 + Math.random() * 900000);

rooms[roomId] = {
  id: roomId,

  ownerId: user.id,

  // 房间配置
  maxPlayers,
  baseScore,
  robMode,

  players: [
    {
      id: user.id,
      name: user.name,
      ready: false,
      gold: 1000,
    },
  ],

  status: "waiting",
};
  console.log("创建房间：", roomId);

  io.emit("rooms-update", Object.values(rooms));

  res.json({
    success: true,
    roomId,
  });
});

// 加入房间
app.post("/join-room", (req, res) => {
  const { roomId, user } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  if (room.players.length >= room.maxPlayers) {
  return res.json({
    success: false,
    message: "房间已满",
  });
}

  const exists = room.players.find((p) => p.id === user.id);

if (exists) {
  return res.json({
    success: true,
  });
}
  room.players.push({
  id: user.id,
  name: user.name,
  ready: false,
  gold: 100000,
});

  console.log("加入房间：", roomId);

  io.to(roomId.toString()).emit("room-update", room);

  io.emit("rooms-update", Object.values(rooms));

  res.json({
    success: true,
  });
});

// 玩家准备
app.post("/ready", (req, res) => {
  const { roomId, playerId } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  const player = room.players.find((p) => p.id === playerId);

  if (player) {
    player.ready = true;
  }

  io.to(roomId.toString()).emit("room-update", room);

  res.json({
    success: true,
  });
});

// 取消准备
app.post("/cancel-ready", (req, res) => {
  const { roomId, playerId } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  const player = room.players.find((p) => p.id === playerId);

  if (player) {
    player.ready = false;
  }

  io.to(roomId.toString()).emit("room-update", room);

  res.json({
    success: true,
  });
});

// 玩家抢庄
app.post("/rob", (req, res) => {
  const { roomId, playerId, rob } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  const player = room.players.find((p) => p.id === playerId);

  if (!player) {
    return res.json({
      success: false,
    });
  }

  // 保存抢庄选择
  player.rob = rob;

  // 是否所有玩家都已选择
  const allSelected = room.players.every(
    (p) => p.rob !== undefined
  );

  if (allSelected) {
    // 先清空上一局庄家
    room.players.forEach((p) => {
      p.banker = false;
    });

    // 所有抢庄的玩家
    const robPlayers = room.players.filter(
      (p) => p.rob === true
    );

    let banker;

    if (robPlayers.length > 0) {
      // 有人抢庄，从抢庄玩家中随机选
      banker =
        robPlayers[
          Math.floor(Math.random() * robPlayers.length)
        ];
    } else {
      // 没人抢庄，从全部玩家随机选
      banker =
        room.players[
          Math.floor(Math.random() * room.players.length)
        ];
    }

    banker.banker = true;

    room.status = "bet";
  }

  io.to(roomId.toString()).emit("room-update", room);

  res.json({
    success: true,
  });
});

// 房间列表
app.get("/rooms", (req, res) => {
  res.json({
    success: true,
    rooms: Object.values(rooms),
  });
});

// 房间信息
app.get("/room/:id", (req, res) => {
  const room = rooms[req.params.id];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  res.json({
    success: true,
    room,
  });
});

// 启动
server.listen(3001, () => {
  console.log("Socket.IO Server running at http://localhost:3001");
});

// 开始游戏
app.post("/start-game", (req, res) => {
  const { roomId } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  const cards = shuffle(deck);

room.players.forEach((player) => {
  player.cards = cards.splice(0, 5);

  // 计算牌型
  player.type = getCardType(player.cards);

  // 临时兼容旧代码
  player.niu = player.type > 10 ? 10 : player.type;

  player.rob = undefined;

  player.bet = undefined;

  player.banker = false;

  player.show = false;
});

if (room.robMode === "fixed") {
  // 房主固定庄
  room.players.forEach((p) => {
    p.banker = p.id === room.ownerId;
  });

  room.status = "bet";
} else {
  room.status = "rob";
}

  io.to(roomId.toString()).emit("room-update", room);

  res.json({
    success: true,
  });
});

// 玩家下注
app.post("/bet", (req, res) => {
  const { roomId, playerId, bet } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  const player = room.players.find(
    (p) => p.id === playerId
  );

  if (!player) {
    return res.json({
      success: false,
    });
  }

  // 保存下注倍数
  player.bet = bet;

  // 全部玩家下注完成
  const allBet = room.players.every(
    (p) => p.bet !== undefined
  );

  if (allBet) {
    room.status = "show";
  }

  io.to(roomId.toString()).emit("room-update", room);

  res.json({
    success: true,
  });
});

// 玩家亮牌
app.post("/show", (req, res) => {
  const { roomId, playerId } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  const player = room.players.find(
    (p) => p.id === playerId
  );

  if (!player) {
    return res.json({
      success: false,
    });
  }

  // 标记已亮牌
  player.show = true;

  // 是否所有玩家都已亮牌
  const allShow = room.players.every(
    (p) => p.show === true
  );

  // 全部亮牌后进入结算
  if (allShow) {
  room.status = "settle";

  const banker = room.players.find(
    (p) => p.banker
  );

  banker.result = "banker";

  room.players.forEach((player) => {
    if (player.id === banker.id) {
      return;
    }

    const result = compareCards(
      banker,
      player
    );

    const multiple = getMultiplier(player.type);

const score =
  player.bet *
  room.baseScore *
  multiple;

    if (result === 1) {
  player.result = "lose";

  player.score = -score;

  player.gold -= score;

  banker.gold += score;
} else {
  player.result = "win";

  player.score = score;

  player.gold += score;

  banker.gold -= score;
}
  });

  banker.score = 0;

room.players.forEach((player) => {
  if (player.id !== banker.id) {
    banker.score -= player.score;
  }
});
  
}

// 下一局
app.post("/next-round", (req, res) => {
  const { roomId, playerId } = req.body;

  const room = rooms[roomId];

  if (!room) {
    return res.json({
      success: false,
    });
  }

  // 只有房主可以开始下一局
  if (room.ownerId !== playerId) {
    return res.json({
      success: false,
      message: "只有房主可以开始下一局",
    });
  }

  resetRoom(room);

  io.to(roomId.toString()).emit(
    "room-update",
    room
  );

  res.json({
    success: true,
  });
});

io.to(roomId.toString()).emit("room-update", room);

  res.json({
    success: true,
  });
});

function resetRoom(room) {
  room.status = "waiting";

  room.players.forEach((player) => {
    player.ready = false;
    player.rob = undefined;
    player.bet = undefined;
    player.cards = [];
    player.show = false;
    player.result = undefined;
    player.score = undefined;
    player.banker = false;
    player.type = undefined;
    player.niu = undefined;
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}