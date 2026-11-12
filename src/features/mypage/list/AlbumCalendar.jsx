import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';
import { getMonthInfo, toDateKey, WEEKDAYS } from '../../../utils/calendar';

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 12px;
`;

const Weekday = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => (props.$sunday ? colors.alert : colors.grey2)};
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

// 날짜 한 칸 — 사진이 있으면 그날 가장 최근 사진을 깔고 어둡게, 고른 날은 진한 테두리
const Cell = styled.button`
  position: relative;
  height: 52px;
  padding: 0;
  overflow: hidden;
  border: none;
  border-radius: 10px;
  background-color: ${(props) => (props.$selected && !props.$photo ? colors.mint : 'transparent')};
  box-shadow: ${(props) => (props.$selected ? `inset 0 0 0 2.5px ${colors.primary}` : 'none')};
  font-family: inherit;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  // 사진 위 글자가 보이게 어둡게 (테두리는 그 위에 다시 그림)
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background-color: ${(props) => (props.$photo ? 'rgba(0, 0, 0, 0.3)' : 'transparent')};
    box-shadow: ${(props) => (props.$selected ? `inset 0 0 0 2.5px ${colors.primary}` : 'none')};
  }
`;

const DayNumber = styled.span`
  position: absolute;
  top: ${(props) => (props.$photo ? 6 : 8)}px;
  right: 0;
  left: 0;
  z-index: 1;
  font-size: 13px;
  font-weight: ${(props) => (props.$strong ? 700 : 400)};
  color: ${(props) => props.$color};
  text-align: center;
`;

// 그날 사진이 2장 이상이면 오른쪽 아래에 장 수
const CountBadge = styled.span`
  position: absolute;
  right: 4px;
  bottom: 4px;
  z-index: 1;
  padding: 0 4px;
  border-radius: 6px;
  background-color: ${colors.white};
  font-size: 9px;
  font-weight: 700;
  color: ${colors.primary};
`;

const dayColor = ({ photo, selected, future, sunday }) => {
  if (photo) return colors.white;
  if (selected) return colors.primary;
  if (future) return colors.grey3;
  if (sunday) return colors.alert;
  return colors.grey1;
};

// 요리 앨범 달력 — 날짜를 누르면 그날 사진 (오늘 이후 날짜는 누를 수 없음)
// photosByDay: { "2026-11-12": [사진, ...] } (최신순), selectedKey: 고른 날짜 열쇠
const AlbumCalendar = ({ year, month, photosByDay, selectedKey, today, selectHandler }) => {
  const { firstWeekday, days } = getMonthInfo(year, month);
  const todayKey = toDateKey(today);

  return (
    <div>
      <Weekdays aria-hidden="true">
        {WEEKDAYS.map((name, index) => (
          <Weekday key={name} $sunday={index === 0}>
            {name}
          </Weekday>
        ))}
      </Weekdays>
      <Grid role="grid" aria-label={`${year}년 ${month + 1}월`}>
        {Array.from({ length: firstWeekday }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: days }, (_, index) => {
          const day = index + 1;
          const date = new Date(year, month, day);
          const key = toDateKey(date);
          const photos = photosByDay[key] ?? [];
          const photo = photos.length > 0;
          const selected = key === selectedKey;
          const future = key > todayKey;
          const sunday = date.getDay() === 0;
          let label = `${month + 1}월 ${day}일`;
          if (photo) label += `, 완성 사진 ${photos.length}장`;
          if (key === todayKey) label += ', 오늘';

          return (
            <Cell
              key={key}
              type="button"
              $photo={photo}
              $selected={selected}
              disabled={future}
              aria-pressed={selected}
              aria-label={label}
              onClick={() => selectHandler(key)}
            >
              {photo && <img src={photos[0].imageUrl} alt="" loading="lazy" />}
              <DayNumber
                $photo={photo}
                $strong={photo || selected}
                $color={dayColor({ photo, selected, future, sunday })}
                aria-hidden="true"
              >
                {day}
              </DayNumber>
              {photos.length > 1 && <CountBadge aria-hidden="true">{photos.length}</CountBadge>}
            </Cell>
          );
        })}
      </Grid>
    </div>
  );
};

export default AlbumCalendar;
