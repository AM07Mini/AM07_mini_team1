import styled from "styled-components";
import { colors } from "../../../components/styled/theme";

// 상세페이지 공통 레이아웃 스타일

export const Sheet = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-top: -28px;
  padding: 24px;
  border-radius: 24px 24px 0 0;
  background: ${colors.white};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
`;
