import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import {
  List,
  Section,
  Input,
  Button,
} from "@telegram-apps/telegram-ui";

import { login } from "@/user";
import { joinRoom } from "@/api/room";

export const JoinRoomPage: FC = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");

  const joinRoomClick = async () => {
    if (!roomId) {
      alert("请输入房号");
      return;
    }

    const user = await login();

    const data = await joinRoom({
      roomId: Number(roomId),
      user,
    });

    if (!data.success) {
      alert(data.message || "加入房间失败");
      return;
    }

    navigate(`/room/${roomId}`);
  };

  return (
    <Page>
      <List>
        <Section header="加入房间">
          <Input
            placeholder="请输入房号"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </Section>

        <Section>
          <Button
            stretched
            size="l"
            onClick={joinRoomClick}
          >
            加入房间
          </Button>
        </Section>
      </List>
    </Page>
  );
};