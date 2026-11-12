import { useCallback, useEffect, useState } from 'react';
import { getMyIngredients } from '../../../api/feedApi';
import { useAuth } from '../../../utils/context/AuthContext';

// 내가 저장한 식재료 이름 목록
// status: 'needLogin' | 'loading' | 'done' | 'error'
// 'done'은 요청이 성공했을 때만 — 빈 목록이면 진짜로 등록한 재료가 없는 것. 실패하면 'error'이고 reload로 다시 요청
const useMyIngredients = () => {
  const { isLoggedIn } = useAuth();
  const [names, setNames] = useState([]);
  const [status, setStatus] = useState(isLoggedIn ? 'loading' : 'needLogin');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      setNames([]);
      setStatus('needLogin');
      return undefined;
    }
    let ignore = false;
    setStatus('loading');
    getMyIngredients()
      .then((result) => {
        if (ignore) return;
        setNames((result ?? []).map((ingredient) => ingredient.name).filter(Boolean));
        setStatus('done');
      })
      .catch(() => {
        if (ignore) return;
        setNames([]);
        setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, [isLoggedIn, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  return { names, status, reload };
};

export default useMyIngredients;
