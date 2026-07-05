export function getCurrentUser() {
  const key = "niuniu-user";

  let user = localStorage.getItem(key);

  if (!user) {
    const id =
      Date.now() + Math.floor(Math.random() * 10000);

    user = JSON.stringify({
      id,
      name: "玩家" + id.toString().slice(-4),
    });

    localStorage.setItem(key, user);
  }

  return JSON.parse(user);
}

export async function login() {
  const tg = (window as any).Telegram?.WebApp;

  // 浏览器开发模式
  if (!tg?.initDataUnsafe?.user) {
    return getCurrentUser();
  }

  const tgUser = tg.initDataUnsafe.user;

  const res = await fetch(
    "http://localhost:3001/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telegramId: String(tgUser.id),
        name: tgUser.first_name,
        username: tgUser.username || "",
        avatar: tgUser.photo_url || "",
      }),
    }
  );

  const data = await res.json();

  return data.user;
}