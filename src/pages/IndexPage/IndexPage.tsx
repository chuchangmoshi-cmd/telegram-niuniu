import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/Page.tsx";
import { List, Section, Cell } from "@telegram-apps/telegram-ui";

export const IndexPage: FC = () => {
  const navigate = useNavigate();
    return (
    <Page back={false}>
      <List>
        <Section header="🐮 NiuNiu">
          <Cell subtitle="Telegram Mini App">
            欢迎来到牛牛娱乐
          </Cell>
        </Section>

        <Section header="游戏">
  <Cell onClick={() => navigate("/create-room")}>
    🎲 创建房间
  </Cell>

  <Cell onClick={() => navigate("/join-room")}>
    🚪 加入房间
  </Cell>

  <Cell onClick={() => navigate("/rooms")}>
    👥 房间列表
  </Cell>
</Section>

        <Section header="个人">
          <Cell>🏆 排行榜</Cell>
          <Cell>📜 我的战绩</Cell>
          <Cell>⚙ 设置</Cell>
        </Section>
      </List>
    </Page>
  );
};