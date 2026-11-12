import { useEffect, useState } from 'react';
import { getMyIngredients } from '../../../api/feedApi';
import { useAuth } from '../../../utils/context/AuthContext';

// 내가 저장한 식재료 이름 목록
// status: 'needLogin' | 'loading' | 'done' — 실패하면 빈 목록으로 'done' (목록 화면은 그대로 보여줌)
const useMyIngredients = () => {
  const { isLoggedIn } = useAuth();
  const [names, setNames] = useState([]);
  const [status, setStatus] = useState(isLoggedIn ? 'loading' : 'needLogin');

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
        if (!ignore) setNames((result ?? []).map((ingredient) => ingredient.name).filter(Boolean));
      })
      .catch(() => {
        if (!ignore) setNames([]);
      })
      .finally(() => {
        if (!ignore) setStatus('done');
      });
    return () => {
      ignore = true;
    };
  }, [isLoggedIn]);

  return { names, status };
};

export default useMyIngredients;
