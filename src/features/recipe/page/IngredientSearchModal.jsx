import React, { useState } from 'react';
import { searchIngredients, createIngredient } from '../../../api/recipeApi';

export default function IngredientSearchModal({ isOpen, onClose, onAddIngredients }) {
  if (!isOpen) return null;

  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [tempSelected, setTempSelected] = useState([]); // 하단에 모아둘 선택된 재료들 [{ id, name, quantity }]
  
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const frequentItems = ['달걀', '양파', '대파', '마늘', '간장'];

  // 1. DB 검색 연동 (keyword 파라미터 전달)
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setKeyword(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const items = await searchIngredients(query);
      setSearchResults(items);
    } catch (error) {
      console.error('식재료 검색 실패:', error);
      setSearchResults([]);
    }
  };

  // 2. 재료 선택/해제 토글 (중복 방지)
  const handleToggleSelectItem = (item) => {
    const exists = tempSelected.some((s) => s.name === item.name);
    if (exists) {
      setTempSelected(tempSelected.filter((s) => s.name !== item.name));
    } else {
      setTempSelected([...tempSelected, { id: item.id || Date.now(), name: item.name, quantity: '1개' }]);
    }
  };

  // 3. 하단에서 수량 직접 수정 (예: 1개, 1/2개, 약간 등)
  const handleQuantityChange = (index, newQty) => {
    const updated = [...tempSelected];
    updated[index].quantity = newQty;
    setTempSelected(updated);
  };

  // 4. 목록에 없는 재료 직접 입력
  const handleCreateCustom = async (e) => {
    if (e.key === 'Enter' && customInput.trim() !== '') {
      e.preventDefault();
      const name = customInput.trim();

      // 이미 하단 선택 목록에 있다면 중복 방지
      if (tempSelected.some((s) => s.name === name)) {
        alert('이미 선택된 재료입니다.');
        return;
      }

      setTempSelected([...tempSelected, { id: Date.now(), name, quantity: '1개' }]);
      setCustomInput('');
      setIsAddingCustom(false);

      // 나중에 서버 등록 연동
      /*
      try {
        await createIngredient(name);
      } catch (error) {
        console.log('서버 등록은 스킵하거나 백엔드 확인 필요', error);
      }
      */
    }
  };

  const handleRemoveTemp = (nameToRemove) => {
    setTempSelected(tempSelected.filter((s) => s.name !== nameToRemove));
  };

  const handleComplete = () => {
    onAddIngredients(tempSelected);
    setTempSelected([]);
    setKeyword('');
    setSearchResults([]);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        width: '450px', height: '85vh', backgroundColor: '#fff', borderRadius: '16px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', marginRight: '16px' }}>←</button>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0A2533' }}>식재료 추가</h3>
        </div>

        {/* 스크롤 영역 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '180px' }}>
          {/* 검색바 */}
          <input 
            value={keyword}
            onChange={handleSearchChange}
            placeholder="🔍"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #CCD4DE', fontSize: '14px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
          />

          {/* 검색 결과 */}
          {keyword.trim() !== '' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px', fontWeight: '600' }}>
                검색 결과 {searchResults.length}
              </div>
              {searchResults.length === 0 ? (
                <div style={{ fontSize: '13px', color: '#94A3B8', padding: '8px 0' }}>검색 결과가 없습니다. 아래에서 직접 입력해 보세요!</div>
              ) : (
                searchResults.map((item) => {
                  const isSelected = tempSelected.some((s) => s.name === item.name);
                  return (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0A2533', fontSize: '14px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>식재료 DB</div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggleSelectItem(item)}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                          backgroundColor: isSelected ? '#E2E8F0' : '#E6F4F5', 
                          color: isSelected ? '#64748B' : '#042628', 
                          fontWeight: '600', fontSize: '13px'
                        }}
                      >
                        {isSelected ? '✓ 추가됨' : '+ 추가'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 자주 쓰는 재료 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '10px', fontWeight: '600' }}>자주 쓰는 재료</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {frequentItems.map((name) => {
                const isSelected = tempSelected.some((s) => s.name === name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleToggleSelectItem({ name })}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', 
                      border: isSelected ? '1px solid #042628' : '1px solid #CCD4DE', 
                      background: isSelected ? '#E6F4F5' : '#fff',
                      color: '#0A2533', fontSize: '13px', cursor: 'pointer', fontWeight: isSelected ? 'bold' : 'normal'
                    }}
                  >
                    + {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 직접 입력 */}
          <div>
            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px' }}>찾는 재료가 없나요?</div>
            {isAddingCustom ? (
              <input 
                autoFocus
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleCreateCustom}
                placeholder="식재료 이름 입력 후 엔터"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px dashed #042628', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
              />
            ) : (
              <button 
                type="button"
                onClick={() => setIsAddingCustom(true)}
                style={{ 
                  width: '100%', padding: '14px', borderRadius: '12px', 
                  border: '1px dashed #70B9BE', background: '#F8FAFC', 
                  color: '#042628', fontWeight: '600', cursor: 'pointer', fontSize: '14px' 
                }}
              >
                + 목록에 없는 재료 직접 입력
              </button>
            )}
          </div>
        </div>

        {/* 하단 고정 바 (선택한 재료 목록 및 수량 조절 입력창 포함) */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', backgroundColor: '#fff',
          borderTop: '1px solid #E2E8F0', padding: '16px 20px', boxSizing: 'border-box'
        }}>
          {tempSelected.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0A2533', marginBottom: '8px' }}>
                선택한 재료 {tempSelected.length}개 (수량을 입력해주세요)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                {tempSelected.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0A2533' }}>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(idx, e.target.value)}
                        style={{ width: '70px', padding: '4px 8px', textAlign: 'center', border: '1px solid #CCD4DE', borderRadius: '6px', fontSize: '13px' }}
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveTemp(item.name)} 
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            type="button"
            disabled={tempSelected.length === 0}
            onClick={handleComplete}
            style={{
              width: '100%', padding: '14px', 
              backgroundColor: tempSelected.length === 0 ? '#CBD5E1' : '#042628', 
              color: '#fff', border: 'none', borderRadius: '12px', 
              fontSize: '15px', fontWeight: 'bold', cursor: tempSelected.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {tempSelected.length}개 재료 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}