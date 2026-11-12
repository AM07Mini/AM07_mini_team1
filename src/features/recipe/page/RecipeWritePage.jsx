import IngredientSearchModal from './IngredientSearchModal';
import { createRecipeText, uploadThumbnail, searchIngredients, createIngredient, uploadStepImage } from "../../../api/recipeApi";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageIntro from '../../../components/styled/PageIntro';
import TopBar from '../../../components/layout/TopBar';
import Button from '../../../components/styled/Button';
import Chip from '../../../components/styled/Chip';
import Toggle from '../../../components/styled/Toggle';
import { DIFFICULTIES } from '../../../utils/difficulty';
import { colors, radius, font } from '../../../components/styled/theme';
import { useNavigate } from 'react-router-dom';

// --- 1. 데이터 배열 ---
const foodTypes = ["한식", "중식", "일식", "양식", "분식", "기타"];
const categories = ["메인", "밑반찬", "국 · 찌개", "볶음밥", "면 · 파스타", "브런치", "간식 · 디저트"];
const levels = DIFFICULTIES.map(({ stars, label }) => [stars, label]); 

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

// 조리 시간 · 인분 수 칸 — 한 줄에 반씩
const UnitSection = styled(Section)`
  flex: 1;
  min-width: 0;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  ${font('itemTitle')}
  color: ${colors.dark};
`;

const Hint = styled.span`
  ${font('sub')}
  color: ${colors.grey2};
`;

const PhotoBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 190px;
  background-color: ${colors.grey4};
  border-radius: ${radius.card}px;
  gap: 6px;
  cursor: pointer;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlusMark = styled.p`
  margin: 0;
  ${font('pageTitle')}
  color: ${colors.primary};
`;

const PhotoTitle = styled.b`
  ${font('label')}
  color: ${colors.dark};
`;

const StepPhoto = styled.label`
  position: relative; 
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background-color: ${colors.grey4};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${font('caption')}
  color: ${colors.grey2};
  cursor: pointer;
  overflow: hidden;
`;

const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 1px solid ${colors.grey3};
  border-radius: ${radius.button}px;
  font-family: inherit;
  ${font('body')}
  outline: none;
  box-sizing: border-box;
  &::placeholder {
    color: ${colors.grey2};
  }
`;

// 맛 · 키워드 직접 입력칸 — 칩 크기
const FlavorInput = styled(Input)`
  display: inline-block;
  width: 150px;
  padding: 6px 12px;
  border-radius: ${radius.card}px;
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
  border-radius: ${radius.button}px;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${({ $isActive }) => ($isActive ? colors.secondary : colors.white)};
  border: 1px solid ${({ $isActive }) => ($isActive ? colors.secondary : colors.grey3)};

  small {
    ${font('caption')}
    color: ${({ $isActive }) => ($isActive ? colors.primary : colors.accent1)};
  }

  b {
    ${font('label')}
    margin-top: 4px;
    color: ${({ $isActive }) => ($isActive ? colors.primary : colors.dark)};
  }
`;

// 선택된 재료가 없을 때
const EmptyIngredients = styled.div`
  padding: 16px 0;
  border: 1px dashed ${colors.grey4};
  border-radius: ${radius.button}px;
  background-color: ${colors.surface};
  ${font('body')}
  color: ${colors.grey2};
  text-align: center;
`;

const IngredientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const IngredientRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid ${colors.grey3};
  border-radius: ${radius.button}px;
  background-color: ${colors.white};
`;

const IngredientName = styled.span`
  ${font('itemTitle')}
  color: ${colors.dark};
`;

const IngredientRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityBadge = styled.span`
  padding: 6px 12px;
  border-radius: ${radius.small}px;
  background-color: ${colors.grey4};
  ${font('sub')}
  font-weight: 500;
  color: ${colors.primary};
`;

const RemoveButton = styled.button`
  border: none;
  background: none;
  ${font('cardTitle')}
  font-weight: 400;
  color: ${colors.grey2};
  cursor: pointer;
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const DashedButton = styled.button`
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${(props) => props.$marginTop ?? 0}px;
  border: 1.5px dashed ${colors.secondary};
  background-color: ${colors.white};
  border-radius: ${radius.button}px;
  color: ${colors.primary};
  font-family: inherit;
  ${font('label')}
  cursor: pointer;
`;

const StepCard = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px;
  border: 1px solid ${colors.grey3};
  border-radius: ${radius.button}px;
  background-color: ${colors.white};
`;

const StepBody = styled.div`
  flex: 1;
`;

const StepBadge = styled.span`
  background-color: ${colors.grey4};
  color: ${colors.primary};
  ${font('hashtag')}
  font-weight: 700;
  padding: 2px 8px;
  border-radius: ${radius.small}px;
`;

const StepInput = styled.textarea`
  width: 100%;
  margin-top: 8px;
  border: none;
  outline: none;
  ${font('body')}
  line-height: 1.5;
  color: ${colors.dark};
  background: transparent;
  resize: none;
  font-family: inherit;

  &::placeholder {
    color: ${colors.grey2};
  }
`;

const SubLabel = styled.p`
  ${font('sub')}
  font-weight: 500;
  color: ${colors.grey2};
  margin: ${(props) => (props.$spaced ? '4px 0 0' : 0)};
`;

const ToggleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: ${colors.grey4};
  border-radius: ${radius.card}px;
  padding: 14px 16px;
`;

const ToggleText = styled.div`
  flex: 1;
`;

const ToggleTitle = styled.p`
  margin: 0 0 4px 0;
  ${font('itemTitle')}
  color: ${colors.dark};
`;

const ToggleDesc = styled.p`
  margin: 0;
  ${font('caption')}
  color: ${colors.grey2};
`;

const SubmitBox = styled.div`
  margin-top: 16px;
`;

const RequiredNote = styled.p`
  margin: 12px 0 0;
  ${font('caption')}
  color: ${colors.grey2};
  text-align: center;
`;

const UnitBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.grey3};
  border-radius: ${radius.button}px;
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
  font-family: inherit;
  ${font('body')}
  background: transparent;
`;

const UnitText = styled.em`
  font-style: normal;
  ${font('sub')}
  color: ${colors.grey2};
  margin-left: 8px;
  flex-shrink: 0;
  white-space: nowrap;
`;

// --- 3. 조리 시간 / 인분 수 컴포넌트 (숫자만 입력 제한 적용) ---
const Unit = ({ label, unit, value, onChange, placeholder }) => {
  const handleNumberChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    onChange(onlyNums);
  };

  return (
    <UnitSection>
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
    </UnitSection>
  );
};


// --- 4. 메인 컴포넌트 ---
export default function RecipeWritePage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    { step: "STEP 1", text: "예: 재료를 손질해 주세요.", image: null, imageFile: null },
    { step: "STEP 2", text: "예: 팬에 기름을 두르고 볶아 주세요.", image: null, imageFile: null },
    { step: "STEP 3", text: "예: 그릇에 담아 완성해요.", image: null, imageFile: null },
  ]);

  // 해시태그 관련 State
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null); 

  // 맛 · 키워드 관련 State
  const [flavorTags, setFlavorTags] = useState(["#매운맛", "#간장맛", "#짠맛", "#단맛", "#고소한 맛"]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [isAddingFlavor, setIsAddingFlavor] = useState(false);
  const [customFlavorInput, setCustomFlavorInput] = useState("");
  const [customKeywords, setCustomKeywords] = useState([]);

  // 이미지 업로드 핸들러
  const handleMainImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (mainImage) {
          URL.revokeObjectURL(mainImage);
        }
        setMainImageFile(file);
        setMainImage(URL.createObjectURL(file));
      }
  };

  const handleStepImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newSteps = [...steps];
        
        newSteps[index].image = reader.result; 
        newSteps[index].imageFile = file; 
        
        setSteps(newSteps);
      };

      reader.readAsDataURL(file);
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
    // 1. 이미 제출 중이면 중복 실행 차단
    if (isSubmitting) return;

    if (!title.trim()) {
      alert('요리 제목을 입력해 주세요!');
      return;
    }

    try {
      // 🔒 중복 클릭 방지 잠금 시작
      setIsSubmitting(true);

      const getFoodTypeId = (type) => {
        const map = {
          "한식": 9, "중식": 10, "일식": 11, "양식": 12, "분식": 6, "기타": 13
        };
        return map[type] || 9;
      };

      const getCategoryId = (cat) => {
        const map = {
          "메인": 1, "밑반찬": 2, "국 · 찌개": 3, "볶음밥": 4, "면 · 파스타": 5, "브런치": 6, "간식 · 디저트": 7
        };
        return map[cat] || 1;
      };

      const getFlavorId = (flavor) => {
        const cleanFlavor = flavor.replace('#', '');
        const map = {
          "매운맛": 1,
          "간장맛": 2,
          "짠맛": 3,
          "단맛": 4,
          "고소한 맛": 5,
          "고소맛": 5
        };
        return map[cleanFlavor] || 1; 
      };

      // 서버가 제공한 공식 재료 ID 매핑 딕셔너리
      const ingredientIdMap = {
        "계란": 1, "달걀": 1, // 달걀/계란 동일 처리
        "밥": 2,
        "대파": 3,
        "양파": 4,
        "당근": 5,
        "파": 6,
        "두부": 7,
        "어묵": 8,
        "만두": 9,
        "고추": 10,
        "소면": 11,
        "우동사리": 12,
        "식빵": 13,
        "설탕": 14,
        "우유": 15,
        "코코아가루": 16,
        "배포확인파": 17
      };

      // 선택된 재료들을 순회하며 정확한 서버 ID 매칭하기
      const processedIngredients = (selectedIngredients || []).map((item) => {
        const cleanName = item.name ? item.name.replace(/[\[\]]/g, '').trim() : "";
        const mappedId = (item.id && item.id < 1000000) ? Number(item.id) : (ingredientIdMap[cleanName] || 0);

        return {
          ingredientId: mappedId,
          quantity: item.quantity || "1개"
        };
      }).filter(item => item.ingredientId > 0); // ID가 0인 유령 재료는 걸러내기

      // 3. 서버가 요구하는 텍스트 데이터 포장
      const recipePayload = {
        title: title || "제목 없음",
        description: "맛있는 요리", 
        instructions: steps ? steps.map(s => s.text).join('\n') : "", 
        cookingMinutes: Number(cookingTime) || 0,
        portions: Number(servings) || 1,
        visibility: isPublic ? "PUBLIC" : "PRIVATE",
        difficulty: difficulty === "쉬움" ? "EASY" : difficulty === "보통" ? "MEDIUM" : "HARD",
        
        foodTypeId: getFoodTypeId(selectedFoodType), 
        categoryIds: selectedCategory ? [getCategoryId(selectedCategory)] : [1],
        
        flavorIds: typeof selectedFlavors !== 'undefined' && Array.isArray(selectedFlavors) 
          ? selectedFlavors.map(flavor => getFlavorId(flavor)).filter(Boolean) 
          : [1],
        

        hashtags: customKeywords,
        
        ingredients: processedIngredients
      };
            
      console.log('서버로 보내는 최종 Payload:', JSON.stringify(recipePayload, null, 2));

      // 1. 레시피 텍스트 등록 (recipeId 반환 받음)
      const recipeId = await createRecipeText(recipePayload);

      // 2. 메인 썸네일 사진이 있다면 업로드
      if (mainImageFile) {
        await uploadThumbnail(recipeId, mainImageFile);
      }

      // 🌟 3. 각 단계별(Step)로 사진이 있는 경우 순서대로 업로드
      if (steps && steps.length > 0) {
        const imageUploadPromises = steps.map((stepItem, index) => {
          // stepItem.imageFile 에 저장해둔 실제 File 객체가 있다고 가정
          if (stepItem.imageFile) {
            const stepOrder = index + 1; // 1부터 시작하는 단계 순서
            return uploadStepImage(recipeId, stepOrder, stepItem.imageFile);
          }
          return null;
        }).filter(Boolean);

        // 모든 단계 사진 업로드가 끝날 때까지 대기
        await Promise.all(imageUploadPromises);
      }
      alert('레시피가 성공적으로 등록되었습니다! 🎉');

      navigate('/');

    } catch (error) {
      console.error('레시피 등록 실패:', error);
      alert('레시피 등록 중 오류가 발생했습니다.');
    } finally {
      // 🔓 버튼 잠금 해제
      setIsSubmitting(false);
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

  const handleAddCustomKeyword = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!customFlavorInput.trim()) return;
      
      const newTag = customFlavorInput.replace('#', '').trim();
      if (!customKeywords.includes(newTag)) {
        setCustomKeywords([...customKeywords, newTag]);
      }
      
      setCustomFlavorInput('');
      setIsAddingFlavor(false);
    }
  };

  const handleRemoveKeyword = (indexToRemove) => {
    setCustomKeywords(customKeywords.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    return () => {
      if (mainImage) URL.revokeObjectURL(mainImage);
      if (steps) {
        steps.forEach(s => {
          if (s.image) URL.revokeObjectURL(s.image);
        });
      }
    };
  }, [mainImage, steps]);


  return (
    <>
    <TopBar title="레시피 기록" showBack />
    <Wrapper>
      <PageIntro title="오늘 만든 요리를 기록해요" description="사진, 재료, 조리 순서를 차례로 입력해 주세요." />

      {/* 완성된 요리 사진 */}
      <Section>
        <Label>완성된 요리 사진</Label>
        <PhotoBox>
          <HiddenFileInput type="file" accept="image/*" onChange={handleMainImageUpload} />
          {mainImage ? (
            <PreviewImage src={mainImage} alt="완성된 요리" />
          ) : (
            <>
              <PlusMark>+</PlusMark>
              <PhotoTitle>완성된 요리 사진 추가</PhotoTitle>
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
          <EmptyIngredients>
            아직 추가한 재료가 없어요.
          </EmptyIngredients>
        ) : (
          <IngredientList>
            {selectedIngredients.map((item, index) => (
              <IngredientRow key={index}>
                <IngredientName>
                  {item.name}
                </IngredientName>
                <IngredientRight>
                  <QuantityBadge>
                    {item.quantity}
                  </QuantityBadge>
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    ✕
                  </RemoveButton>
                </IngredientRight>
              </IngredientRow>
            ))}
          </IngredientList>
        )}

        {/* + 식재료 추가하기 버튼 (누르면 모달 열림 상태로 변경) */}
        <DashedButton type="button" onClick={() => setIsModalOpen(true)} $marginTop={12}>
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
            <StepBody>
              <StepBadge>{item.step}</StepBadge>
              <StepInput
                value={item.text}
                // 🌟 핵심: 포커스(클릭)했을 때 '예:'로 시작하면 내용 싹 비우기
                onFocus={() => {
                  if (item.text.startsWith("예:")) {
                    handleStepTextChange(index, "");
                  }
                }}
                onChange={(e) => handleStepTextChange(index, e.target.value)}
                placeholder="조리 순서를 입력해 주세요."
                rows={2}
              />
            </StepBody>
            
            {/* 🌟 단계별 사진 업로드 및 미리보기 영역 */}
            <StepPhoto>
              <HiddenFileInput 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleStepImageUpload(index, e)} 
              />
              
              {item.image ? (
                <PreviewImage src={item.image} alt={`step ${index + 1}`} />
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
              size="medium"
              title={item}
              selected={selectedFoodType === item}
              onClick={() => setSelectedFoodType(item)}
            />
          ))}
        </ChipGroup>

        <SubLabel $spaced>카테고리 (조리 형태)</SubLabel>
        <ChipGroup>
          {categories.map((item) => (
            <Chip
              key={item}
              size="medium"
              title={item}
              selected={selectedCategory === item}
              onClick={() => setSelectedCategory(item)}
            />
          ))}
        </ChipGroup>

        {/* 1. 맛 선택 섹션 (5가지 고정) */}
        <Section>
          <SubLabel $spaced>맛</SubLabel>
          <ChipGroup>
            {flavorTags.map((tag) => {
              const isSelected = selectedFlavors.includes(tag);
              return (
                <Chip
                  key={tag}
                  size="medium"
                  title={tag}
                  selected={isSelected}
                  onClick={() => handleFlavorClick(tag)}
                />
              );
            })}
          </ChipGroup>
        </Section>
        
        {/* 2. 키워드(해시태그) 입력 섹션 (+ 추가 버튼 및 직접 입력) */}
        <Section>
          <SubLabel $spaced>키워드</SubLabel>
          <ChipGroup>
            {/* 사용자가 추가한 키워드들이 칩으로 표시되는 영역 (선택사항) */}
            {customKeywords && customKeywords.map((keyword, index) => (
              <Chip
                key={index}
                size="medium"
                title={`#${keyword}`}
                selected={true} // 추가된 키워드는 선택된 상태로 표시
                onClick={() => handleRemoveKeyword(index)} // 누르면 삭제되게 연결 가능
              />
            ))}

            {/* 입력창 또는 '+ 추가' 버튼 */}
            {isAddingFlavor ? (
              <FlavorInput
                autoFocus
                value={customFlavorInput}
                onChange={(e) => setCustomFlavorInput(e.target.value)}
                onKeyDown={handleAddCustomKeyword} // 엔터 치면 hashtags 배열로 들어가는 함수
                placeholder="키워드 입력 후 엔터 (예: #자취요리)"
              />
            ) : (
              <Chip size="medium" dashed title="+ 추가" onClick={() => setIsAddingFlavor(true)} />
            )}
          </ChipGroup>
        </Section>
      </Section>

      {/* 피드 공개 토글 */}
      <ToggleBox>
        <ToggleText>
          <ToggleTitle>피드에 공개하기</ToggleTitle>
          <ToggleDesc>다른 유저가 내 레시피를 보고 후기를 남길 수 있어요</ToggleDesc>
        </ToggleText>
        <Toggle checked={isPublic} changeHandler={setIsPublic} label="피드에 공개하기" />
      </ToggleBox>

      {/* 저장 버튼 */}
      <SubmitBox>
        <Button 
          title={isSubmitting ? "저장 중..." : "레시피 저장하기"} 
          onClick={handleSubmitRecipe} 
          disabled={isSubmitting}
          style={{ 
            opacity: isSubmitting ? 0.6 : 1, 
            cursor: isSubmitting ? 'not-allowed' : 'pointer' 
          }}
        />
        <RequiredNote>
          필수 항목: 사진 · 제목 · 재료 · 레시피 3단계
        </RequiredNote>
      </SubmitBox>

      {/* 식재료 추가 모달 컴포넌트 렌더링 */}
      <IngredientSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIngredients={(newItems) => {
          setSelectedIngredients([...selectedIngredients, ...newItems]);
        }}
      />
    </Wrapper>
    </>
  );
}
