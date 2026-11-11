import React, { useState } from 'react';
import styled from 'styled-components';
import { searchIngredients, createIngredient } from '../../../api/recipeApi';
import Button from '../../../components/styled/Button';
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
  overflow: hidden;
  border-radius: ${radius.card}px;
  background-color: ${colors.white};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.grey4};
`;

const BackButton = styled.button`
  margin-right: 16px;
  border: none;
  background: none;
  ${font('sectionTitle')}
  font-weight: 400;
  color: ${colors.dark};
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
  padding: 20px 20px 180px;
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

const FrequentChip = styled.button`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.$selected ? colors.primary : colors.grey3)};
  border-radius: 20px;
  background: ${(props) => (props.$selected ? colors.accent2 : colors.white)};
  ${font('sub')}
  font-weight: ${(props) => (props.$selected ? 700 : 400)};
  color: ${colors.dark};
  cursor: pointer;
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

// 하단 고정 바 (선택한 재료 목록 및 수량 조절 입력창 포함)
const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px 20px;
  box-sizing: border-box;
  border-top: 1px solid ${colors.grey4};
  background-color: ${colors.white};
`;

const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
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
    <Overlay>
      <Sheet>
        {/* 상단 헤더 */}
        <Header>
          <BackButton onClick={onClose}>←</BackButton>
          <Title>식재료 추가</Title>
        </Header>

        {/* 스크롤 영역 */}
        <ScrollArea>
          {/* 검색바 */}
          <SearchBox>
            <SearchInput value={keyword} changeHandler={handleSearchChange} placeholder="식재료 이름으로 검색" />
          </SearchBox>

          {/* 검색 결과 */}
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
                      <AddButton type="button" $selected={isSelected} onClick={() => handleToggleSelectItem(item)}>
                        {isSelected ? '✓ 추가됨' : '+ 추가'}
                      </AddButton>
                    </ResultRow>
                  );
                })
              )}
            </Section>
          )}

          {/* 자주 쓰는 재료 */}
          <Section $gap={24}>
            <SectionLabel $bold>자주 쓰는 재료</SectionLabel>
            <ChipRow>
              {frequentItems.map((name) => {
                const isSelected = tempSelected.some((s) => s.name === name);
                return (
                  <FrequentChip
                    key={name}
                    type="button"
                    $selected={isSelected}
                    onClick={() => handleToggleSelectItem({ name })}
                  >
                    + {name}
                  </FrequentChip>
                );
              })}
            </ChipRow>
          </Section>

          {/* 직접 입력 */}
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

        {/* 하단 고정 바 (선택한 재료 목록 및 수량 조절 입력창 포함) */}
        <Footer>
          {tempSelected.length > 0 && (
            <Section $gap={12}>
              <SectionLabel $bold $dark>
                선택한 재료 {tempSelected.length}개 (수량을 입력해주세요)
              </SectionLabel>
              <SelectedList>
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
