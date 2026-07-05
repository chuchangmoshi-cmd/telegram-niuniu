import { useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/Page";
import {
  List,
  Section,
  Cell,
  Select,
  Button,
} from "@telegram-apps/telegram-ui";

import { login } from "@/user";
import { createRoom } from "@/api/room";

export const CreateRoomPage: FC = () => {
  const navigate = useNavigate();

  const [maxPlayers, setMaxPlayers] = useState(6);
  const [baseScore, setBaseScore] = useState(100);
  const [robMode, setRobMode] = useState("free");

  const createRoomClick = async () => {
    const user = await login();

    const data = await createRoom({
      user,
      maxPlayers,
      baseScore,
      robMode,
    });

    if (data.success) {
      navigate(`/room/${data.roomId}`);
    }
  };

  return (
    <Page>
      <List>
        <Section header="创建房间">
          <Cell>
            房间人数
            <Select
              value={String(maxPlayers)}
              onChange={(e) =>
                setMaxPlayers(Number(e.target.value))
              }
            >
              <option value="6">6人</option>
              <option value="8">8人</option>
            </Select>
          </Cell>

          <Cell>
            底分
            <Select
              value={String(baseScore)}
              onChange={(e) =>
                setBaseScore(Number(e.target.value))
              }
            >
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </Select>
          </Cell>

          <Cell>
            抢庄模式
            <Select
              value={robMode}
              onChange={(e) =>
                setRobMode(e.target.value)
              }
            >
              <option value="free">自由抢庄</option>
              <option value="fixed">固定庄家</option>
            </Select>
          </Cell>
        </Section>

        <Section>
          <Button
            stretched
            size="l"
            onClick={createRoomClick}
          >
            创建房间
          </Button>
        </Section>
      </List>
    </Page>
  );
};