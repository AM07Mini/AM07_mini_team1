import styled from 'styled-components';
import { colors, font } from '../../../components/styled/theme';
import FollowUserItem from '../item/FollowUserItem';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Empty = styled.p`
  margin: 0;
  padding: 40px 0;
  ${font('body')}
  color: ${colors.grey2};
  text-align: center;
`;

// 팔로워 · 팔로잉 목록 — 비었으면 안내 문구
const FollowUserList = ({ users, emptyMessage, pendingIds, toggleHandler }) => {
  if (users.length === 0) return <Empty>{emptyMessage}</Empty>;

  return (
    <List>
      {users.map((user) => (
        <FollowUserItem
          key={user.id}
          data={user}
          pending={pendingIds.includes(user.id)}
          toggleHandler={toggleHandler}
        />
      ))}
    </List>
  );
};

export default FollowUserList;
