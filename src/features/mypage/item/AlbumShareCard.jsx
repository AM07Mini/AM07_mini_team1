import styled from 'styled-components';
import { colors } from '../../../components/styled/theme';
import { getMonthInfo, toDateKey, WEEKDAYS } from '../../../utils/calendar';
import { getShareCellSize } from '../albumShareImage';

// 공유용 카드 미리보기 — 4:5 (저장할 때는 1080×1350)
const Card = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 264px;
  aspect-ratio: 4 / 5;
  padding: 17px;
  border: 1px solid ${colors.grey4};
  border-radius: 18px;
  background-color: ${colors.white};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
`;

const Logo = styled.span`
  align-self: flex-start;
  padding: 3px 8px;
  border-radius: 6px;
  background-color: ${colors.mint};
  font-size: 9px;
  font-weight: 700;
  color: ${colors.primary};
`;

const Title = styled.p`
  margin: 7px 0 0;
  overflow: hidden;
  font-size: 18px;
  font-weight: 700;
  color: ${colors.dark};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Subtitle = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  color: ${colors.grey1};
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2.6px;
  margin-top: 12px;
`;

const Weekday = styled.span`
  font-size: 8px;
  font-weight: 500;
  color: ${(props) => (props.$sunday ? colors.alert : colors.grey2)};
  text-align: center;
`;

// 줄 간격 = 칸 높이와의 차이 (저장 이미지와 같은 크기 — getShareCellSize)
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 2.6px;
  row-gap: ${(props) => props.$rowGap}px;
  margin-top: 4px;
`;

const Day = styled.span`
  position: relative;
  height: ${(props) => props.$height}px;
  overflow: hidden;
  border-radius: 7px;
  background-color: ${(props) => (props.$photo ? colors.grey4 : colors.surface)};

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: ${(props) => (props.$photo ? 'rgba(0, 0, 0, 0.25)' : 'transparent')};
  }
`;

const DayNumber = styled.span`
  position: absolute;
  top: 3px;
  right: 0;
  left: 0;
  z-index: 1;
  font-size: 8px;
  font-weight: ${(props) => (props.$photo ? 700 : 400)};
  color: ${(props) => (props.$photo ? colors.white : colors.grey2)};
  text-align: center;
`;

const Footer = styled.p`
  margin: auto 0 0;
  padding-top: 8px;
  font-size: 9px;
  color: ${colors.grey2};
  white-space: pre;
`;

// 이달 요리 달력 카드 — 사진이 있는 날은 그날 가장 최근 사진
// photosByDay: { "2026-11-12": [사진, ...] }, photoCount: 이달 사진 수
const AlbumShareCard = ({ nickname, year, month, isCurrentMonth, photosByDay, photoCount }) => {
  const { firstWeekday, days } = getMonthInfo(year, month);
  const cell = getShareCellSize(firstWeekday, days);
  const owner = nickname ? `${nickname}의 ` : '';
  const when = isCurrentMonth ? '이번 달' : `${month + 1}월에`;

  return (
    <Card aria-label={`${owner}${month + 1}월 요리 달력 카드 미리보기`}>
      <Logo>Recipely</Logo>
      <Title>
        {owner}
        {month + 1}월
      </Title>
      <Subtitle>
        {when} {photoCount}번 요리했어요
      </Subtitle>
      <Weekdays aria-hidden="true">
        {WEEKDAYS.map((name, index) => (
          <Weekday key={name} $sunday={index === 0}>
            {name}
          </Weekday>
        ))}
      </Weekdays>
      <Grid aria-hidden="true" $rowGap={cell.stepY - cell.height}>
        {Array.from({ length: firstWeekday }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: days }, (_, index) => {
          const key = toDateKey(new Date(year, month, index + 1));
          const photo = photosByDay[key]?.[0];
          return (
            <Day key={key} $photo={Boolean(photo)} $height={cell.height}>
              {photo && <img src={photo.imageUrl} alt="" />}
              <DayNumber $photo={Boolean(photo)}>{index + 1}</DayNumber>
            </Day>
          );
        })}
      </Grid>
      <Footer>
        {year}.{String(month + 1).padStart(2, '0')}  ·  냉장고 속 재료로 요리 찾기
      </Footer>
    </Card>
  );
};

export default AlbumShareCard;
