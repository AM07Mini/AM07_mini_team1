// 받침에 따라 조사 고르기 — josa('김치볶음밥', '을/를') → '김치볶음밥을', josa('1분 30초', '이/가') → '1분 30초가'
// 마지막 글자가 한글이 아니면(숫자 · 영어) 뒤 조사(를 · 가)를 씀
export const josa = (word, pair) => {
  const [withBatchim, withoutBatchim] = pair.split('/');
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasBatchim = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `${word}${hasBatchim ? withBatchim : withoutBatchim}`;
};
