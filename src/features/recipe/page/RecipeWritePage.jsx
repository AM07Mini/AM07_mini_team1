import IngredientSearchModal from './IngredientSearchModal';
import { createRecipeText, uploadThumbnail, searchIngredients, createIngredient } from "../../../api/recipeApi";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// --- 1. 데이터 배열 ---
const foodTypes = ["한식", "중식", "일식", "양식", "분식", "기타"];
const categories = ["메인", "밑반찬", "국 · 찌개", "볶음밥", "면 · 파스타", "브런치", "간식 · 디저트"];
const levels = [
  ["★☆☆", "쉬움"],
  ["★★☆", "보통"],
  ["★★★", "어려움"],
];

// --- 2. Styled Components ---
const Wrapper = styled.main`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: #0A2533;
`;

const Hint = styled.span`
  font-size: 13px;
  color: #97A2B0;
`;

const PhotoBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 190px;
  background-color: #E6EBF2;
  border-radius: 16px;
  gap: 6px;
  cursor: pointer;
  overflow: hidden;
`;

const StepPhoto = styled.label`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background-color: #E6EBF2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #97A2B0;
  cursor: pointer;
  overflow: hidden;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid #CCD4DE;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  &::placeholder {
    color: #97A2B0;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const LevelCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${({ $isActive }) => ($isActive ? '#70B9BE' : '#fff')};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#70B9BE' : '#CCD4DE')};

  small {
    font-size: 12px;
    color: ${({ $isActive }) => ($isActive ? '#042628' : '#3DA0A7')};
  }

  b {
    font-size: 14px;
    margin-top: 4px;
    color: ${({ $isActive }) => ($isActive ? '#042628' : '#0A2533')};
  }
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${({ $isActive }) => ($isActive ? '#70B9BE' : '#fff')};
  border: 1px solid ${({ $isActive }) => ($isActive ? '#70B9BE' : '#CCD4DE')};

  color: ${({ $isActive }) => ($isActive ? '#042628' : '#48525F')};
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
`;

const DashedButton = styled.button`
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #70B9BE;
  background-color: #fff;
  border-radius: 12px;
  color: #042628;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
`;

const StepCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px;
  border: 1px solid #CCD4DE;
  border-radius: 12px;
  background-color: #fff;
`;

const StepBadge = styled.span`
  background-color: #E6EBF2;
  color: #042628;
  font-size: 11px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 8px;
`;

const StepInput = styled.textarea`
  width: 100%;
  margin-top: 8px;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  color: #0A2533;
  background: transparent;
  resize: none;
  font-family: inherit;
  
  &::placeholder {
    color: #97A2B0;
  }
`;

const SubLabel = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #97A2B0;
  margin: 0;
`;

const ToggleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #E6EBF2;
  border-radius: 16px;
  padding: 14px 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #042628; 
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;
  cursor: pointer;
  text-align: center;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #CCD4DE;
    transition: 0.3s;
    border-radius: 24px;
  }

  span:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: #042628;
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const UnitBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #CCD4DE;
  border-radius: 12px;
  padding: 0 12px;
  height: 48px;
  box-sizing: border-box; 
  width: 100%;
`;

const UnitInput = styled.input`
  flex: 1;
  min-width: 0; 
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
`;

const UnitText = styled.em`
  font-style: normal;
  font-size: 13px;
  color: #97A2B0;
  margin-left: 8px;
  flex-shrink: 0; 
  white-space: nowrap; 
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: #0A2533;
  cursor: pointer;
  padding: 0;
  margin-bottom: 8px; // 타이틀과의 간격

  &:hover {
    color: #3DA0A7;
  }
`;

// --- 3. 조리 시간 / 인분 수 컴포넌트 (숫자만 입력 제한 적용) ---
const Unit = ({ label, unit, value, onChange, placeholder }) => {
  const handleNumberChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    onChange(onlyNums);
  };

  return (
    <Section style={{ flex: 1, minWidth: 0 }}>
      <Label>{label}</Label>
      <UnitBox>
        <UnitInput 
          type="number"
          min="0"
          value={value}
          onChange={handleNumberChange}
          placeholder={placeholder} 
        />
        <UnitText>{unit}</UnitText>
      </UnitBox>
    </Section>
  );
};

// --- 4. 메인 컴포넌트 ---
export default function RecipeWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // 식재료 관련 State
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredientKeyword, setIngredientKeyword] = useState(''); 
  const [searchedIngredients, setSearchedIngredients] = useState([]);

  // 조리 순서 State
  const [steps, setSteps] = useState([
    { step: "STEP 1", text: "예: 재료를 손질해 주세요.", image: null },
    { step: "STEP 2", text: "예: 팬에 기름을 두르고 볶아 주세요.", image: null },
    { step: "STEP 3", text: "예: 그릇에 담아 완성해요.", image: null },
  ]);

  // 해시태그 관련 State
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null); 

  // 맛 · 키워드 관련 State
  const [flavorTags, setFlavorTags] = useState(["#고소한", "#10분요리", "#자취요리"]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [isAddingFlavor, setIsAddingFlavor] = useState(false);
  const [customFlavorInput, setCustomFlavorInput] = useState("");

  // 이미지 업로드 핸들러
  const handleMainImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setMainImageFile(file);
        setMainImage(URL.createObjectURL(file));
      }
    };

  const handleStepImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newSteps = [...steps];
      newSteps[index].image = URL.createObjectURL(file);
      setSteps(newSteps);
    }
  };

  const handleStepTextChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].text = value;
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    const nextStepNumber = steps.length + 1;
    setSteps([
      ...steps,
      { step: `STEP ${nextStepNumber}`, text: "", image: null }
    ]);
  };

  // 검색창 타이핑 핸들러
  const handleIngredientSearch = async (e) => {
    const keyword = e.target.value;
    setIngredientKeyword(keyword);

    if (!keyword.trim()) {
      setSearchedIngredients([]);
      return;
    }

    try {
      const content = await searchIngredients(keyword);
      setSearchedIngredients(content); // 검색 결과 업데이트
    } catch (error) {
      console.error('식재료 검색 실패:', error);
    }
  };

  // 목록에 없는 재료 직접 입력 후 엔터 쳤을 때 (서버 등록 + 선택)
  const handleAddCustomIngredient = async (e) => {
    if (e.key === 'Enter' && customInput.trim() !== '') {
      e.preventDefault();
      const newItemName = customInput.trim();

      try {
        // 1. 서버에 새 식재료 등록 API 호출 (POST /api/v1/ingredients)[cite: 14]
        await createIngredient(newItemName);

        // 2. 화면 상의 목록과 선택된 목록에 반영
        if (!ingredients.includes(newItemName)) {
          setIngredients([...ingredients, newItemName]);
        }
        if (!selectedIngredients.includes(newItemName)) {
          setSelectedIngredients([...selectedIngredients, newItemName]);
        }

        setCustomInput("");
        setIsAddingCustom(false);
        setIngredientKeyword("");
        setSearchedIngredients([]);
      } catch (error) {
        console.error('식재료 등록 실패:', error);
        alert('식재료 등록 중 오류가 발생했습니다.');
      }
    }
  };

  // 식재료 복수 선택 핸들러
  const handleIngredientClick = (item) => {
    if (selectedIngredients.includes(item)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== item));
    } else {
      setSelectedIngredients([...selectedIngredients, item]);
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setSelectedIngredients(selectedIngredients.filter((_, index) => index !== indexToRemove));
  };

  // '레시피 저장하기' 버튼을 누르면 실행되는 핵심 함수
  const handleSubmitRecipe = async () => {
    if (!title.trim()) {
      alert('요리 제목을 입력해 주세요!');
      return;
    }

    try {
      const getFoodTypeId = (type) => {
        const map = {
          "한식": 9,
          "중식": 10,
          "일식": 11,
          "양식": 12,
          "분식": 6,
          "기타": 13
        };
        return map[type] || 9; // 선택 안 했을 때 기본값 (한식 ID인 9)
      };

      const getCategoryId = (cat) => {
        const map = {
          "메인": 1,
          "밑반찬": 2,
          "국 · 찌개": 3,
          "볶음밥": 4,
          "면 · 파스타": 5,
          "브런치": 6,
          "간식 · 디저트": 7
        };
        return map[cat] || 1;
      };


      const getFlavorId = (flavor) => {
        // 맛·키워드 태그들에 대응하는 ID 매핑 (예시)
        const map = { "#고소한": 1, "#10분요리": 2, "#자취요리": 3, "#냉털": 4 };
        return map[flavor] || 1;
      };

      // 2. 서버가 요구하는 텍스트 데이터 포장
      const recipePayload = {
      title: title || "제목 없음",
      description: "맛있는 요리", 
      instructions: steps ? steps.map(s => s.text).join('\n') : "", 
      cookingMinutes: Number(cookingTime) || 0,
      visibility: isPublic ? "PUBLIC" : "PRIVATE",
      difficulty: difficulty === "쉬움" ? "EASY" : difficulty === "보통" ? "NORMAL" : "HARD",
      
      // 요리 종류 매핑 적용
      foodTypeId: getFoodTypeId(selectedFoodType), 
      
      categoryIds: selectedCategory ? [getCategoryId(selectedCategory)] : [1],
      flavorIds: typeof selectedFlavors !== 'undefined' && Array.isArray(selectedFlavors) 
        ? selectedFlavors.map(id => Number(id)).filter(Boolean) 
        : [1],
      
      hashtags: keywords ? keywords.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      
      ingredients: selectedIngredients ? selectedIngredients.map(item => ({
        ingredientId: item.id || 0,
        name: item.name ? item.name.replace(/[\[\]]/g, '').trim() : "",
        quantity: item.quantity || "1개"
      })) : []
    };
            
      console.log('🔥 서버로 보내는 최종 Payload:', JSON.stringify(recipePayload, null, 2));

      // 3. 서버로 전송
      const recipeId = await createRecipeText(recipePayload);

      if (mainImageFile) {
        await uploadThumbnail(recipeId, mainImageFile);
      }

      alert('레시피가 성공적으로 등록되었습니다! 🎉');

    } catch (error) {
      console.error('레시피 등록 실패:', error);
      alert('레시피 등록 중 오류가 발생했습니다.');
    }
  };

  // 맛 태그 선택/해제 핸들러
  const handleFlavorClick = (tag) => {
    if (selectedFlavors.includes(tag)) {
      setSelectedFlavors(selectedFlavors.filter((t) => t !== tag));
    } else {
      setSelectedFlavors([...selectedFlavors, tag]);
    }
  };

  // 새로운 맛 태그 직접 추가 핸들러 (엔터 쳤을 때)
  const handleAddCustomFlavor = (e) => {
    if (e.key === 'Enter' && customFlavorInput.trim() !== '') {
      e.preventDefault();
      let newTag = customFlavorInput.trim();
      
      // 앞에 #이 없으면 자동으로 붙여주기
      if (!newTag.startsWith('#')) {
        newTag = '#' + newTag;
      }

      if (!flavorTags.includes(newTag)) {
        setFlavorTags([...flavorTags, newTag]);
      }
      if (!selectedFlavors.includes(newTag)) {
        setSelectedFlavors([...selectedFlavors, newTag]);
      }

      setCustomFlavorInput("");
      setIsAddingFlavor(false);
    }
  };


  return (
    <Wrapper>
      {/* 뒤로 가기 화살표 버튼*/}
      <div>
        <BackButton type="button" onClick={() => navigate(-1)}>
          ←
        </BackButton>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0A2533' }}>오늘 만든 요리를 기록해요</h2>
        <p style={{ fontSize: '14px', color: '#48525F', margin: 0 }}>사진, 재료, 조리 순서를 차례로 입력해 주세요.</p>
      </div>

      {/* 완성된 요리 사진 */}
      <Section>
        <Label>완성된 요리 사진</Label>
        <PhotoBox>
          <HiddenFileInput type="file" accept="image/*" onChange={handleMainImageUpload} />
          {mainImage ? (
            <img src={mainImage} alt="완성된 요리" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#042628', margin: 0 }}>+</p>
              <b style={{ color: '#0A2533' }}>완성된 요리 사진 추가</b>
              <Hint>대표 사진은 목록과 피드 썸네일로 쓰여요</Hint>
            </>
          )}
        </PhotoBox>
      </Section>

      {/* 요리 제목 */}
      <Section>
        <Label>요리 제목</Label>
        <Input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="어떤 요리를 만들었나요?" 
        />
      </Section>

      {/* 조리 시간 / 인분 수 (숫자 전용) */}
      <Row>
        <Unit label="조리 시간" unit="분" value={cookingTime} onChange={setCookingTime} placeholder="예: 15" />
        <Unit label="인분 수" unit="인분" value={servings} onChange={setServings} placeholder="예: 2" />
      </Row>

      {/* 조리 난이도 */}
      <Section>
        <LabelRow>
          <Label>조리 난이도</Label>
          <Hint>하 · 중 · 상</Hint>
        </LabelRow>
        <Row>
          {levels.map(([stars, name]) => (
            <LevelCard 
              key={name}
              $isActive={difficulty === name}
              onClick={() => setDifficulty(name)}
            >
              <small>{stars}</small>
              <b>{name}</b>
            </LevelCard>
          ))}
        </Row>
      </Section>

      {/* 식재료 섹션 (1단계 적용) */}
      <Section>
        <LabelRow>
          <Label>식재료</Label>
          <Hint>검색해서 추가하거나 직접 입력해요</Hint>
        </LabelRow>

        {/* 선택된 재료 리스트 카드들 */}
        {selectedIngredients.length === 0 ? (
          <div style={{ padding: '16px 0', color: '#97A2B0', fontSize: '14px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed #E2E8F0' }}>
            아직 추가한 재료가 없어요.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {selectedIngredients.map((item, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  border: '1px solid #CCD4DE',
                  borderRadius: '12px',
                  backgroundColor: '#fff'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#0A2533' }}>
                  {item.name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    backgroundColor: '#E6EBF2', 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '13px', 
                    color: '#042628',
                    fontWeight: '500'
                  }}>
                    {item.quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#97A2B0', fontSize: '16px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* + 식재료 추가하기 버튼 (누르면 모달 열림 상태로 변경) */}
        <DashedButton type="button" onClick={() => setIsModalOpen(true)} style={{ marginTop: '12px' }}>
          + 식재료 추가하기
        </DashedButton>
      </Section>


      {/* 레시피 기록 (조리 순서) */}
      <Section>
        <LabelRow>
          <Label>레시피 기록</Label>
          <Hint>기본 3단계 · 필요하면 추가</Hint>
        </LabelRow>
        {steps.map((item, index) => (
          <StepCard key={index}>
            <div style={{ flex: 1 }}>
              <StepBadge>{item.step}</StepBadge>
              <StepInput 
                value={item.text}
                onFocus={() => {
                  if (item.text.startsWith("예:")) {
                    handleStepTextChange(index, "");
                  }
                }}
                onChange={(e) => handleStepTextChange(index, e.target.value)}
                placeholder="조리 순서를 입력해 주세요."
                rows={2}
              />
            </div>
            <StepPhoto>
              <HiddenFileInput type="file" accept="image/*" onChange={(e) => handleStepImageUpload(index, e)} />
              {item.image ? (
                <img src={item.image} alt={`step ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                "+ 사진"
              )}
            </StepPhoto>
          </StepCard>
        ))}
        <DashedButton onClick={handleAddStep}>+ 다음 단계 추가</DashedButton>
      </Section>

      {/* 해시태그 */}
      <Section>
        <LabelRow>
          <Label>해시태그</Label>
          <Hint>검색과 필터에 사용돼요</Hint>
        </LabelRow>
        
        <SubLabel>요리 종류</SubLabel>
        <ChipGroup>
          {foodTypes.map((item) => (
            <Chip 
              key={item}
              type="button"
              $isActive={selectedFoodType === item}
              onClick={() => setSelectedFoodType(item)}
            >
              {item}
            </Chip>
          ))}
        </ChipGroup>

        <SubLabel style={{ marginTop: '4px' }}>카테고리 (조리 형태)</SubLabel>
        <ChipGroup>
          {categories.map((item) => (
            <Chip 
              key={item}
              type="button"
              $isActive={selectedCategory === item}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </Chip>
          ))}
        </ChipGroup>

        {/* 🌟 새로 바뀐 맛 · 키워드 칩 UI 섹션 */}
        <SubLabel style={{ marginTop: '4px' }}>맛 · 키워드</SubLabel>
        <ChipGroup>
          {flavorTags.map((tag) => {
            const isSelected = selectedFlavors.includes(tag);
            return (
              <Chip 
                key={tag}
                type="button"
                $isActive={isSelected}
                onClick={() => handleFlavorClick(tag)}
              >
                {tag}
              </Chip>
            );
          })}

          {/* '+ 추가' 버튼 또는 직접 입력창 */}
          {isAddingFlavor ? (
            <Input 
              autoFocus
              value={customFlavorInput}
              onChange={(e) => setCustomFlavorInput(e.target.value)}
              onKeyDown={handleAddCustomFlavor}
              placeholder="키워드 입력 후 엔터 (예: #매콤한)" 
              style={{ width: '150px', padding: '6px 12px', fontSize: '14px', borderRadius: '16px', display: 'inline-block' }}
            />
          ) : (
            <Chip 
              type="button" 
              onClick={() => setIsAddingFlavor(true)}
              style={{ backgroundColor: '#fff', border: '1px dashed #70B9BE', color: '#042628' }}
            >
              + 추가
            </Chip>
          )}
        </ChipGroup>
      </Section>

      {/* 피드 공개 토글 */}
      <ToggleBox>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#0A2533' }}>피드에 공개하기</p>
          <p style={{ fontSize: '12px', color: '#97A2B0', margin: 0 }}>다른 유저가 내 레시피를 보고 후기를 남길 수 있어요</p>
        </div>
        <ToggleSwitch>
          <input 
            type="checkbox" 
            checked={isPublic} 
            onChange={(e) => setIsPublic(e.target.checked)} 
          />
          <span />
        </ToggleSwitch>
      </ToggleBox>

      {/* 저장 버튼 */}
      <div>
        <SubmitButton type="button" onClick={handleSubmitRecipe}>레시피 저장하기</SubmitButton>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#97A2B0', marginTop: '12px' }}>
          필수 항목: 사진 · 제목 · 재료 · 레시피 3단계
        </p>
      </div>

      {/* 식재료 추가 모달 컴포넌트 렌더링 */}
      <IngredientSearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIngredients={(newItems) => {
          setSelectedIngredients([...selectedIngredients, ...newItems]);
        }}
      />
    </Wrapper>
    
  );
}