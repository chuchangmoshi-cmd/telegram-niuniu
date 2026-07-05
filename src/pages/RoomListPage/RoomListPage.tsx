import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import { List, Section, Cell } from "@telegram-apps/telegram-ui";
import { socket } from "@/socket";

export const RoomListPage: FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 首次获取房间列表
    fetch("http://localhost:3001/rooms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRooms(data.rooms);
        }
      });

    // Socket 实时监听房间列表变化
    socket.on("rooms-update", (rooms) => {
      setRooms(rooms);
    });

    // 页面销毁时取消监听
    return () => {
      socket.off("rooms-update");
    };
  }, []);

  return (
    <Page>
      <List>
        <Section header="房间列表">
          {rooms.length === 0 ? (
            <Cell>暂无房间</Cell>
          ) : (
            rooms.map((room) => (
              <Cell
                key={room.id}
                onClick={() => navigate(`/room/${room.id}`)}
              >
                房号：{room.id}（{room.players.length}人）
              </Cell>
            ))
          )}
        </Section>
      </List>
    </Page>
  );
};