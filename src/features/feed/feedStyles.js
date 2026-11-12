import styled from 'styled-components';
import { colors, radius, font } from '../../components/styled/theme';

export const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: ${(props) => (props.$small ? '16px 0' : '40px 0')};
  text-align: center;
  ${font('caption')}
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
  ${font('sub')}
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
`;

export const Sentinel = styled.div`
  height: 1px;
`;
