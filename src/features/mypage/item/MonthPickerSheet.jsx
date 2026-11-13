import { useState } from 'react';
import styled from 'styled-components';
import BottomSheet from '../../../components/styled/BottomSheet';
import Icon from '../../../components/styled/Icon';
import { colors, font, radius } from '../../../components/styled/theme';

const YearNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const YearArrow = styled.button`
  display: flex;
  padding: 4px;
  border: none;
  background: none;
  color: ${colors.grey1};
  cursor: pointer;

  &:disabled {
    color: ${colors.grey3};
    cursor: default;
  }
`;

const YearTitle = styled.p`
  margin: 0;
  ${font('cardTitle')}
  color: ${colors.dark};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
`;

// 달 한 칸 — 보고 있는 달은 진하게, 아직 오지 않은 달은 흐리게(못 누름)
const MonthButton = styled.button`
  height: 44px;
  border: none;
  border-radius: ${radius.button}px;
  background-color: ${(props) => (props.$selected ? colors.primary : colors.surface)};
  font-family: inherit;
  ${font('option')}
  font-weight: ${(props) => (props.$selected ? 700 : 500)};
  color: ${(props) => (props.$selected ? colors.white : colors.dark)};
  cursor: pointer;

  &:disabled {
    color: ${colors.grey3};
    cursor: default;
  }
`;

// 시트 안쪽 — 열 때마다 새로 그려서, 보고 있는 달의 연도부터 시작
const MonthGrid = ({ year, month, maxYear, maxMonth, pickHandler }) => {
  const [shownYear, setShownYear] = useState(year);

  return (
    <>
      <YearNav>
        <YearArrow type="button" aria-label="이전 해" onClick={() => setShownYear((y) => y - 1)}>
          <Icon name="chevronLeft" size={22} strokeWidth={2} />
        </YearArrow>
        <YearTitle aria-live="polite">{shownYear}년</YearTitle>
        <YearArrow
          type="button"
          aria-label="다음 해"
          disabled={shownYear >= maxYear}
          onClick={() => setShownYear((y) => y + 1)}
        >
          <Icon name="chevronRight" size={22} strokeWidth={2} />
        </YearArrow>
      </YearNav>
      <Grid>
        {Array.from({ length: 12 }, (_, index) => {
          const selected = shownYear === year && index === month;
          const future = shownYear > maxYear || (shownYear === maxYear && index > maxMonth);
          return (
            <MonthButton
              key={index}
              type="button"
              $selected={selected}
              disabled={future}
              aria-pressed={selected}
              aria-label={`${shownYear}년 ${index + 1}월`}
              onClick={() => pickHandler(shownYear, index)}
            >
              {index + 1}월
            </MonthButton>
          );
        })}
      </Grid>
    </>
  );
};

// 달 고르기 — 위쪽에서 연도를 넘기고 아래에서 달을 고름 (오늘 이후 달은 못 고름)
// month · maxMonth는 0부터 (11월 = 10)
const MonthPickerSheet = ({ open, year, month, maxYear, maxMonth, closeHandler, pickHandler }) => (
  <BottomSheet open={open} title="달 고르기" closeHandler={closeHandler}>
    {open && (
      <MonthGrid
        year={year}
        month={month}
        maxYear={maxYear}
        maxMonth={maxMonth}
        pickHandler={(pickedYear, pickedMonth) => {
          pickHandler(pickedYear, pickedMonth);
          closeHandler();
        }}
      />
    )}
  </BottomSheet>
);

export default MonthPickerSheet;
