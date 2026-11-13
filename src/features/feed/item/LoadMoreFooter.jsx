import { Notice, NoticeAction, Sentinel } from '../feedStyles';

const LoadMoreFooter = ({ list, loadingText = '더 불러오는 중…' }) => {
  const { hasNext, loadingMore, loadMoreFailed, sentinelRef, retryMore } = list;
  const waiting = loadingMore || (hasNext && !loadMoreFailed);

  return (
    <>
      {hasNext && !loadMoreFailed && <Sentinel ref={sentinelRef} />}
      {waiting && (
        <Notice $small role="status">
          <p>{loadingText}</p>
        </Notice>
      )}
      {loadMoreFailed && (
        <Notice $small role="alert">
          <p>레시피를 더 불러오지 못했어요.</p>
          <NoticeAction type="button" onClick={retryMore}>
            다시 시도
          </NoticeAction>
        </Notice>
      )}
    </>
  );
};

export default LoadMoreFooter;
