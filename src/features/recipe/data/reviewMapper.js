export const timeAgo = (iso) => {
  if (!iso) return "";
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  return `${Math.floor(hour / 24)}일 전`;
};
export const toReview = (r) => ({
  id: r.id,
  avatar: r.authorProfileImageUrl ?? "",
  name: r.authorNickname,
  when: timeAgo(r.createdAt),
  text: r.body ?? r.content,
  shot: r.imageUrls?.[0] ?? r.imageUrl ?? null,
  likes: r.likeCount ?? 0,
  liked: !!r.likedByMe,
  replyCount: r.replyCount ?? null, // 추측, 없으면 null
  replies: null, // null = 아직 안 불러옴
  repliesOpen: false,
});

export const toReply = (r) => ({
  id: r.id,
  authorId: r.authorId,
  avatar: r.authorProfileImageUrl ?? "",
  name: r.authorNickname,
  when: timeAgo(r.createdAt),
  text: r.body,
});
