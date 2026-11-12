import styled from 'styled-components';
import { colors, font } from '../../../components/styled/theme';
import AlbumPhotoItem from '../item/AlbumPhotoItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Month = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MonthTitle = styled.h2`
  margin: 0;
  ${font('cardTitle')}
  color: ${colors.dark};
`;

// 3열 — 피그마 105 · 105 · 105, 간격 6
const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// "2026-11-03T..." → "2026년 11월"
const monthOf = (createdAt) => {
  const date = new Date(createdAt);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

// 요리 앨범 사진 목록 — 올린 달별로 묶어서 최근 달부터 (사진은 최신순으로 온다고 보고 순서 유지)
const AlbumPhotoList = ({ photos }) => {
  const months = [];
  photos.forEach((photo) => {
    const month = monthOf(photo.createdAt);
    const last = months[months.length - 1];
    if (last?.month === month) last.photos.push(photo);
    else months.push({ month, photos: [photo] });
  });

  return (
    <Wrapper>
      {months.map((group) => (
        <Month key={group.month} aria-label={group.month}>
          <MonthTitle>{group.month}</MonthTitle>
          <Grid>
            {group.photos.map((photo) => (
              <li key={photo.id}>
                <AlbumPhotoItem data={photo} />
              </li>
            ))}
          </Grid>
        </Month>
      ))}
    </Wrapper>
  );
};

export default AlbumPhotoList;
