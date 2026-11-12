import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { searchIngredients, createIngredient } from '../../../api/recipeApi';
import BackIcon from '../../../components/styled/BackIcon';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import SearchInput from '../../../components/styled/SearchInput';
import { colors, radius, font } from '../../../components/styled/theme';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Sheet = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(450px, calc(100vw - 32px));
  height: 85vh;
  max-height: 750px;
  border-radius: ${radius.card}px;
  background-color: ${colors.white};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.grey4};
  flex-shrink: 0;
`;

const BackButton = styled.button`
  display: flex;
  margin-right: 16px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

const Title = styled.h3`
  margin: 0;
  ${font('sectionTitle')}
  color: ${colors.dark};
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const SearchBox = styled.div`
  margin-bottom: 16px;
`;

const Section = styled.div`
  margin-bottom: ${(props) => props.$gap ?? 0}px;
`;

const SectionLabel = styled.div`
  margin-bottom: 8px;
  ${font('sub')}
  font-weight: ${(props) => (props.$bold ? 700 : 400)};
  color: ${(props) => (props.$dark ? colors.dark : colors.grey1)};
`;

const EmptyText = styled.div`
  padding: 8px 0;
  ${font('sub')}
  color: ${colors.grey2};
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${colors.grey4};
`;

const ResultName = styled.div`
  ${font('label')}
  color: ${colors.dark};
`;

const ResultSource = styled.div`
  ${font('caption')}
  color: ${colors.grey2};
`;

const AddButton = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: ${radius.small}px;
  background-color: ${(props) => (props.$selected ? colors.grey4 : colors.accent2)};
  ${font('sub')}
  font-weight: 700;
  color: ${(props) => (props.$selected ? colors.grey1 : colors.primary)};
  cursor: pointer;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CustomInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px dashed ${colors.primary};
  border-radius: ${radius.button}px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  ${font('body')}
`;

const CustomButton = styled.button`
  width: 100%;
  padding: 14px;
  border: 1px dashed ${colors.secondary};
  border-radius: ${radius.button}px;
  background: ${colors.surface};
  font-family: inherit;
  ${font('label')}
  color: ${colors.primary};
  cursor: pointer;
`;

const Footer = styled.div`
  padding: 12px 20px 16px;
  box-sizing: border-box;
  border-top: 1px solid ${colors.grey4};
  background-color: ${colors.white};
  flex-shrink: 0;
`;

const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  height: ${(props) => props.$height}px;
  min-height: 60px;
  max-height: 400px;
  overflow-y: auto;
  
  padding: 8px;
  border: 1px solid ${colors.grey4};
  border-radius: ${radius.small}px;
  background-color: ${colors.surface};
  box-sizing: border-box;
`;

const ResizeHandleBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 0 6px 0;
  cursor: ns-resize;

  &::after {
    content: '';
    width: 36px;
    height: 4px;
    background-color: ${colors.grey3};
    border-radius: 2px;
  }
`;

const SelectedRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid ${colors.grey4};
  border-radius: ${radius.small}px;
  background-color: ${colors.surface};
`;

const SelectedName = styled.span`
  ${font('label')}
  color: ${colors.dark};
`;

const QuantityBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityInput = styled.input`
  width: 70px;
  padding: 4px 8px;
  border: 1px solid ${colors.grey3};
  border-radius: 6px;
  font-family: inherit;
  ${font('sub')}
  text-align: center;
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  ${font('body')}
  color: ${colors.grey2};
  cursor: pointer;
`;

export default function IngredientSearchModal({ isOpen, onClose, onAddIngredients, existingIngredients = [] }) {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [tempSelected, setTempSelected] = useState([]);

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const frequentItems = ['달걀', '양파', '대파', '마늘', '간장'];

  // 드래그 리사이징 관련 상태
  const [listHeight, setListHeight] = useState(120);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(120);

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

const handleSelectItem = (item) => {
    const isTempSelected = tempSelected.some((s) => s.name === item.name);
    
    const isAlreadyAdded = existingIngredients.some((ing) => ing.name === item.name);

    if (isTempSelected || isAlreadyAdded) {
      alert('이미 추가된 재료입니다!');
      return;
    }
    setTempSelected([...tempSelected, { id: item.id || Date.now(), name: item.name, quantity: '1개' }]);
  };

  const handleQuantityChange = (index, newQty) => {
    const updated = [...tempSelected];
    updated[index].quantity = newQty;
    setTempSelected(updated);
  };

  // 🌟 [직접 입력 중복 차단]
  const handleCreateCustom = async (e) => {
    if (e.key === 'Enter' && customInput.trim() !== '') {
      e.preventDefault();
      const name = customInput.trim();

      if (tempSelected.some((s) => s.name === name)) {
        alert('이미 추가된 재료입니다!');
        return;
      }

      setTempSelected([...tempSelected, { id: Date.now(), name, quantity: '1개' }]);
      setCustomInput('');
      setIsAddingCustom(false);
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

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(listHeight);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const deltaY = startY - e.clientY;
      const newHeight = startHeight + deltaY;

      if (newHeight >= 60 && newHeight <= 450) {
        setListHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startY, startHeight]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <Sheet>
        {/* 상단 헤더 */}
        <Header>
          <BackButton onClick={onClose} aria-label="뒤로가기">
            <BackIcon />
          </BackButton>
          <Title>식재료 추가</Title>
        </Header>

        {/* 중간 스크롤 영역 */}
        <ScrollArea>
          <SearchBox>
            <SearchInput value={keyword} changeHandler={handleSearchChange} placeholder="식재료 이름으로 검색" />
          </SearchBox>

          {keyword.trim() !== '' && (
            <Section $gap={20}>
              <SectionLabel $bold>검색 결과 {searchResults.length}</SectionLabel>
              {searchResults.length === 0 ? (
                <EmptyText>검색 결과가 없습니다. 아래에서 직접 입력해 보세요!</EmptyText>
              ) : (
                searchResults.map((item) => {
                  const isSelected = tempSelected.some((s) => s.name === item.name);
                  return (
                    <ResultRow key={item.id}>
                      <div>
                        <ResultName>{item.name}</ResultName>
                        <ResultSource>식재료 DB</ResultSource>
                      </div>
                      <AddButton type="button" $selected={isSelected} onClick={() => handleSelectItem(item)}>
                        {isSelected ? '✓ 추가됨' : '+ 추가'}
                      </AddButton>
                    </ResultRow>
                  );
                })
              )}
            </Section>
          )}

          <Section $gap={24}>
            <SectionLabel $bold>자주 쓰는 재료</SectionLabel>
            <ChipRow>
              {frequentItems.map((name) => {
                const isSelected = tempSelected.some((s) => s.name === name);
                return (
                  <Chip
                    key={name}
                    size="medium"
                    title={`+ ${name}`}
                    selected={isSelected}
                    onClick={() => handleSelectItem({ name })}
                  />
                );
              })}
            </ChipRow>
          </Section>

          <div>
            <SectionLabel>찾는 재료가 없나요?</SectionLabel>
            {isAddingCustom ? (
              <CustomInput
                autoFocus
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleCreateCustom}
                placeholder="식재료 이름 입력 후 엔터"
              />
            ) : (
              <CustomButton type="button" onClick={() => setIsAddingCustom(true)}>
                + 목록에 없는 재료 직접 입력
              </CustomButton>
            )}
          </div>
        </ScrollArea>
        
        {/* 하단 고정 바 */}
        <Footer>
          {tempSelected.length > 0 && (
            <Section $gap={8}>
              <SectionLabel $bold $dark>
                선택한 재료 {tempSelected.length}개 (수량을 입력해주세요)
              </SectionLabel>

              <SelectedList $height={listHeight}>
                <ResizeHandleBar onMouseDown={handleMouseDown} title="위아래로 끌어서 크기를 조절하세요" />

                {tempSelected.map((item, idx) => (
                  <SelectedRow key={idx}>
                    <SelectedName>{item.name}</SelectedName>
                    <QuantityBox>
                      <QuantityInput
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(idx, e.target.value)}
                      />
                      <RemoveButton type="button" onClick={() => handleRemoveTemp(item.name)}>
                        ✕
                      </RemoveButton>
                    </QuantityBox>
                  </SelectedRow>
                ))}
              </SelectedList>
            </Section>
          )}

          <Button
            title={`${tempSelected.length}개 재료 추가하기`}
            disabled={tempSelected.length === 0}
            onClick={handleComplete}
          />
        </Footer>
      </Sheet>
    </Overlay>
  );
}