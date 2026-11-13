import { useEffect, useState } from 'react';

// 맨 위로 버튼을 보여줄지 정하는 훅
// 화면 한 장 높이만큼 아래로 내려가면 true → 위쪽 탭/필터가 화면 밖으로 사라진 상태
// 사용: const showBackToTop = useBackToTop();
//       {showBackToTop && <BackToTopButton />}
const useBackToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => setShow(window.scrollY > window.innerHeight);

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return show;
};

export default useBackToTop;
