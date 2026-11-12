import { colors } from '../../components/styled/theme';
import { getMonthInfo, toDateKey, WEEKDAYS } from '../../utils/calendar';

// 요리 앨범 공유 카드를 1080×1350(4:5) PNG로 그리기 — 서버 없이 브라우저 그림판(canvas)으로
// 화면의 카드 미리보기(264×330, AlbumShareCard)와 같은 자리 · 크기를 그대로 키워서 그림
// 사진은 S3에서 "다른 사이트에서 읽어도 됨"(CORS *)을 주므로 crossOrigin으로 불러와야 파일로 뽑을 수 있음

const CARD_WIDTH = 264;
const CARD_HEIGHT = 330;
const OUTPUT_WIDTH = 1080;
const OUTPUT_HEIGHT = 1350;
const SCALE = OUTPUT_WIDTH / CARD_WIDTH;

const PADDING = 17;
const CELL_WIDTH = 30;
const CELL_STEP_X = 32.6;
const GRID_TOP = 109;

// 날짜 칸 높이 — 6주짜리 달(예: 2026년 8월)은 아래 문구(300)와 겹치지 않게 칸을 낮춤
// 5주: 34 + 36.6 × 4 = 180 → 289까지 / 6주: 28 + 30.6 × 5 = 181 → 290까지
export const getShareCellSize = (firstWeekday, days) =>
  Math.ceil((firstWeekday + days) / 7) > 5 ? { height: 28, stepY: 30.6 } : { height: 34, stepY: 36.6 };

// 화면과 같은 글꼴로 그리기
const fontFamily = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
const setFont = (ctx, size, weight) => {
  ctx.font = `${weight} ${size}px ${fontFamily()}`;
};

const IMAGE_TIMEOUT_MS = 10_000; // 사진 한 장을 기다리는 최대 시간 (느린 망에서 저장이 끝없이 멈추지 않게)

// 사진 불러오기 — 실패하거나 너무 오래 걸리면 null (그날은 사진 없는 칸처럼 그림)
// 화면에서 이미 CORS 없이 불러온 사진이 캐시에 남아 있으면 막힐 수 있어서 주소 끝에 표시를 붙여 새로 받음
const loadImage = (url) =>
  new Promise((resolve) => {
    const image = new Image();
    const timer = setTimeout(() => {
      image.src = '';
      resolve(null);
    }, IMAGE_TIMEOUT_MS);
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      clearTimeout(timer);
      resolve(image);
    };
    image.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    image.src = `${url}${url.includes('?') ? '&' : '?'}share=1`;
  });

// 칸을 꽉 채우도록 가운데를 잘라 그리기 (object-fit: cover)
const drawCover = (ctx, image, x, y, width, height) => {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
};

// 둥근 네모 — 그림판 roundRect가 없는 옛 브라우저(사파리 15 이하)는 직접 그림
const roundRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
};

// 너무 긴 제목은 말줄임
const fitText = (ctx, text, maxWidth) => {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 0 && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);
  return `${cut}…`;
};

// 카드 그리기 → { blob: PNG, missingCount: 못 불러와 빈 칸으로 그린 사진 수 }
// photosByDay: { "2026-11-12": [사진, ...] } (각 날짜 최신순) — 그날 가장 최근 사진 한 장을 씀
export const createAlbumShareImage = async ({ nickname, year, month, isCurrentMonth, photosByDay, photoCount }) => {
  await document.fonts?.ready;

  const { firstWeekday, days } = getMonthInfo(year, month);
  let missingCount = 0;
  const dayPhotos = await Promise.all(
    Array.from({ length: days }, async (_, index) => {
      const photo = photosByDay[toDateKey(new Date(year, month, index + 1))]?.[0];
      if (!photo) return null;
      const image = await loadImage(photo.imageUrl);
      if (!image) missingCount += 1;
      return image;
    }),
  );

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = 'top';

  // 바탕
  ctx.fillStyle = colors.white;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // 로고 칩 — "Recipely"
  setFont(ctx, 9, 700);
  const logoText = 'Recipely';
  const logoWidth = ctx.measureText(logoText).width + 16;
  ctx.fillStyle = colors.mint;
  roundRect(ctx, PADDING, PADDING, logoWidth, 19, 6);
  ctx.fill();
  ctx.fillStyle = colors.primary;
  ctx.fillText(logoText, PADDING + 8, PADDING + 4.5);

  // 제목 · 부제목
  const owner = nickname ? `${nickname}의 ` : '';
  setFont(ctx, 18, 700);
  ctx.fillStyle = colors.dark;
  ctx.fillText(fitText(ctx, `${owner}${month + 1}월`, CARD_WIDTH - PADDING * 2), PADDING, 41);
  setFont(ctx, 12, 400);
  ctx.fillStyle = colors.grey1;
  ctx.fillText(`${isCurrentMonth ? '이번 달' : `${month + 1}월에`} ${photoCount}번 요리했어요`, PADDING, 65);

  // 요일
  setFont(ctx, 8, 500);
  ctx.textAlign = 'center';
  WEEKDAYS.forEach((name, index) => {
    ctx.fillStyle = index === 0 ? colors.alert : colors.grey2;
    ctx.fillText(name, PADDING + CELL_WIDTH / 2 + index * CELL_STEP_X, 93);
  });

  // 날짜 칸
  const { height: CELL_HEIGHT, stepY: CELL_STEP_Y } = getShareCellSize(firstWeekday, days);
  for (let day = 1; day <= days; day += 1) {
    const slot = firstWeekday + day - 1;
    const x = PADDING + (slot % 7) * CELL_STEP_X;
    const y = GRID_TOP + Math.floor(slot / 7) * CELL_STEP_Y;
    const image = dayPhotos[day - 1];

    ctx.save();
    roundRect(ctx, x, y, CELL_WIDTH, CELL_HEIGHT, 7);
    ctx.clip();
    if (image) {
      drawCover(ctx, image, x, y, CELL_WIDTH, CELL_HEIGHT);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    } else {
      ctx.fillStyle = colors.surface;
    }
    ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
    ctx.restore();

    setFont(ctx, 8, image ? 700 : 400);
    ctx.fillStyle = image ? colors.white : colors.grey2;
    ctx.fillText(String(day), x + CELL_WIDTH / 2, y + 3);
  }

  // 아래 문구
  ctx.textAlign = 'left';
  setFont(ctx, 9, 400);
  ctx.fillStyle = colors.grey2;
  ctx.fillText(`${year}.${String(month + 1).padStart(2, '0')}  ·  냉장고 속 재료로 요리 찾기`, PADDING, 300);

  // 다른 사이트 사진이 막혀 그림판이 "오염"되면 여기서 SecurityError가 남
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, missingCount }) : reject(new Error('이미지를 만들지 못했어요.'))),
      'image/png',
    );
  });
};

// 파일로 내려받을지, 이미지를 띄워 길게 눌러 저장하게 할지
// - 아이폰 · 아이패드: 어떤 브라우저든 내려받으면 사진 앱이 아니라 파일 앱에 들어가므로 → 길게 눌러 "사진 앱에 저장"
// - 카카오톡 · 인스타그램 · 페이스북 · 라인 · 네이버 앱 안의 브라우저: 내려받기를 막는 경우가 많으므로 → 길게 눌러 저장
// - 그 밖(안드로이드 · PC 브라우저): 파일로 내려받기
const IN_APP_BROWSER = /KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER\(inapp/i;

// 최신 아이패드는 자신을 Mac이라고 알려 주므로, Mac인데 화면 터치가 되면 아이패드로 봄
const isAppleMobile = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

export const shouldDownloadFile = () =>
  'download' in HTMLAnchorElement.prototype && !isAppleMobile() && !IN_APP_BROWSER.test(navigator.userAgent);

// Blob을 파일로 내려받기 — 휴대폰은 브라우저의 다운로드 · 사진 저장 흐름을 따름
export const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
};
