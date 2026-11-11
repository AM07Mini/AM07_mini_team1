import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, radius } from '../../components/styled/theme';

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MoreLink = styled(Link)`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.secondary};
  text-decoration: none;
`;

export const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: ${(props) => (props.$small ? '16px 0' : '40px 0')};
  text-align: center;
  font-size: 12px;
  color: ${colors.grey1};

  p {
    margin: 0;
  }
`;

export const NoticeAction = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${radius.button}px;
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
`;

// 무한 스크롤 감지용 (화면에 보이면 다음 페이지 요청)
export const Sentinel = styled.div`
  height: 1px;
`;
