import { DIFFICULTIES } from '../../utils/difficulty';

export const searchFilters = [
  {
    key: 'difficulty',
    title: '조리 난이도',
    selectionMode: 'single',
    items: DIFFICULTIES.map(({ value, label, stars }) => ({
      value,
      label: `${stars} ${label}`,
    })),
  },
  {
    key: 'maxCookingMinutes',
    title: '조리 시간',
    selectionMode: 'single',
    items: [
      { value: 15, label: '15분 이내' },
      { value: 30, label: '30분 이내' },
      { value: 60, label: '1시간 이내' },
    ],
  },
];
