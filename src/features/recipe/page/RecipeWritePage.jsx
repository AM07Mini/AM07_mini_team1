import IngredientSearchModal from './IngredientSearchModal';
import { createRecipeText, uploadThumbnail, uploadStepImage, createIngredient } from "../../../api/recipeApi";
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
  padding-bottom: 85px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

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

const DeletePhotoButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 10px 24px 16px 24px;
  background-color: ${colors.white};
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  z-index: 10;
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

// --- 3. 조리 시간 / 인분 수 컴포넌트 ---
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

  // 조리 순서 State
  const [steps, setSteps] = useState([
    { step: "STEP 1", text: "예: 재료를 손질해 주세요.", image: null, imageFile: null },
    { step: "STEP 2", text: "예: 팬에 기름을 두르고 볶아 주세요.", image: null, imageFile: null },
    { step: "STEP 3", text: "예: 그릇에 담아 완성해요.", image: null, imageFile: null },
  ]);

  // 해시태그 관련 State
  const [selectedFoodType, setSelectedFoodType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null); 

  // 맛 · 키워드 관련 State
  const [flavorTags] = useState(["매운맛", "간장맛", "#맛", "단맛", "고소한 맛"]);
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
        setSteps(prevSteps => {
          const newSteps = [...prevSteps];
          if (newSteps[index]) {
            newSteps[index] = { ...newSteps[index], imageFile: file };
          }
          return newSteps;
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setSteps(prevSteps => {
            const newSteps = [...prevSteps];
            if (newSteps[index] && newSteps[index].imageFile === file) {
              newSteps[index] = { ...newSteps[index], image: reader.result };
            }
            return newSteps;
          });
        };
        reader.readAsDataURL(file);
        e.target.value = ""; 
      }
    };

  const handleRemoveStepImage = (index) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      if (newSteps[index]) {
        if (newSteps[index].image && newSteps[index].image.startsWith('blob:')) {
          URL.revokeObjectURL(newSteps[index].image);
        }
        newSteps[index] = {
          ...newSteps[index],
          image: null,
          imageFile: null
        };
      }
      return newSteps;
    });
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
      { step: `STEP ${nextStepNumber}`, text: "", image: null, imageFile: null }
    ]);
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setSelectedIngredients(selectedIngredients.filter((_, index) => index !== indexToRemove));
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updated = [...selectedIngredients];
    updated[index].quantity = newQuantity;
    setSelectedIngredients(updated);
  };

  const handleSubmitRecipe = async () => {
    if (isSubmitting) return;

    if (!mainImageFile && !mainImage) {
      alert('완성된 요리 사진을 추가해 주세요!');
      return;
    }
    if (!title.trim()) {
      alert('요리 제목을 입력해 주세요!');
      return;
    }
    if (!cookingTime) {
      alert('조리 시간을 입력해 주세요!');
      return;
    }
    if (!servings) {
      alert('인분 수를 입력해 주세요!');
      return;
    }
    if (!difficulty) {
      alert('조리 난이도를 선택해 주세요!');
      return;
    }
    if (selectedIngredients.length === 0) {
      alert('식재료를 최소 1개 이상 추가해 주세요!');
      return;
    }
    if (steps.some(s => !s.text.trim() || s.text.startsWith("예:"))) {
      alert('모든 조리 순서(STEP) 내용을 입력해 주세요!');
      return;
    }
    if (!selectedFoodType) {
      alert('요리 종류를 선택해 주세요!');
      return;
    }
    if (!selectedCategory) {
      alert('카테고리를 선택해 주세요!');
      return;
    }
    if (selectedFlavors.length === 0) {
      alert('맛을 최소 1개 이상 선택해 주세요!');
      return;
    }

    let createdRecipeId = null;

    try {
      setIsSubmitting(true);

      const getFoodTypeId = (type) => {
        const map = { "한식": 9, "중식": 10, "일식": 11, "양식": 12, "분식": 6, "기타": 13 };
        return map[type] || 9;
      };

      const getCategoryId = (cat) => {
        const map = { "메인": 1, "밑반찬": 2, "국 · 찌개": 3, "볶음밥": 4, "면 · 파스타": 5, "브런치": 6, "간식 · 디저트": 7 };
        return map[cat] || 1;
      };

      const getFlavorId = (flavor) => {
        const cleanFlavor = flavor.replace('#', '');
        const map = { "매운맛": 1, "간장맛": 2, "짠맛": 3, "단맛": 4, "고소한 맛": 5, "고소맛": 5 };
        return map[cleanFlavor] || 1; 
      };

      const ingredientIdMap = {
              "계란": 1,
              "달걀": 1,
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
              "식용유": 21,
              "마늘": 22,
              "간장": 19,
              "마시멜로": 20
       };

      const processedIngredients = [];

      for (const item of (selectedIngredients || [])) {
        const cleanName = item.name ? item.name.replace(/[\[\]]/g, '').trim() : "";
        let mappedId = (item.id && item.id < 1000000) ? Number(item.id) : (ingredientIdMap[cleanName] || 0);

        if (mappedId === 0 && cleanName) {
          try {
            const newIngredient = await createIngredient(cleanName);
            mappedId = newIngredient?.id || 0;
          } catch (err) {
            console.error("식재료 자동 등록 실패:", err);
          }
        }

        if (mappedId > 0) {
          processedIngredients.push({
            ingredientId: mappedId,
            quantity: item.quantity || "1개"
          });
        } else {
          alert(`"${cleanName}" 재료의 시스템 ID를 확인할 수 없어 등록에서 제외됩니다.`);
        }
      }

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
        flavorIds: Array.isArray(selectedFlavors) ? selectedFlavors.map(flavor => getFlavorId(flavor)).filter(Boolean) : [1],
        hashtags: customKeywords,
        ingredients: processedIngredients
      };

      createdRecipeId = await createRecipeText(recipePayload);

      if (mainImageFile && createdRecipeId) {
        await uploadThumbnail(createdRecipeId, mainImageFile);
      }

      if (steps && steps.length > 0 && createdRecipeId) {
        const imageUploadPromises = steps.map((stepItem, index) => {
          if (stepItem.imageFile) {
            const stepOrder = index + 1;
            return uploadStepImage(createdRecipeId, stepOrder, stepItem.imageFile);
          }
          return null;
        }).filter(Boolean);

        await Promise.all(imageUploadPromises);
      }

      alert('레시피가 성공적으로 등록되었습니다! 🎉');
      navigate('/');

    } catch (error) {
      console.error('레시피 등록 실패:', error);
      if (createdRecipeId) {
        alert(`레시피 기본 정보는 등록되었으나(ID: ${createdRecipeId}), 이미지 업로드 중 오류가 발생했습니다.`);
      } else {
        alert('레시피 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
      const newTag = customFlavorInput.replace('#', '').trim();
      if (newTag && !customKeywords.includes(newTag)) {
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
      if (mainImage && mainImage.startsWith('blob:')) {
        URL.revokeObjectURL(mainImage);
      }
    };
  }, [mainImage]);

  useEffect(() => {
    return () => {
      if (steps) {
        steps.forEach(s => {
          if (s.image && s.image.startsWith('blob:')) {
            URL.revokeObjectURL(s.image);
          }
        });
      }
    };
  }, [steps]);

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

      {/* 조리 시간 / 인분 수 */}
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

      {/* 식재료 섹션 */}
      <Section>
        <LabelRow>
          <Label>식재료</Label>
          <Hint>검색해서 추가하거나 직접 입력해요</Hint>
        </LabelRow>

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
                  <QuantityInput
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                  />
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
            
            <StepPhoto>
              <HiddenFileInput 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleStepImageUpload(index, e)} 
              />
              
              {item.image ? (
                <>
                  <PreviewImage src={item.image} alt={`step ${index + 1}`} />
                  <DeletePhotoButton 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStepImage(index);
                    }}
                  >
                    ✕
                  </DeletePhotoButton>
                </>
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
        
        <Section>
          <SubLabel $spaced>키워드</SubLabel>
          <ChipGroup>
            {customKeywords && customKeywords.map((keyword, index) => (
              <Chip
                key={index}
                size="medium"
                title={`#${keyword}`}
                selected={true}
                onClick={() => handleRemoveKeyword(index)}
              />
            ))}

            {isAddingFlavor ? (
              <FlavorInput
                autoFocus
                value={customFlavorInput.startsWith('#') ? customFlavorInput : `#${customFlavorInput}`}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val.startsWith('#')) {
                    setCustomFlavorInput(`#${val}`);
                  } else {
                    setCustomFlavorInput(val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newTag = customFlavorInput.replace('#', '').trim();
                    if (newTag && !customKeywords.includes(newTag)) {
                      setCustomKeywords([...customKeywords, newTag]);
                    }
                    setCustomFlavorInput('');
                    setIsAddingFlavor(false);
                  }
                }}
                placeholder="#키워드 입력 후 엔터"
              />
            ) : (
              <Chip size="medium" dashed title="+ 추가" onClick={() => {
                setIsAddingFlavor(true);
                setCustomFlavorInput('#');
              }} />
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
      </SubmitBox>

      {/* 식재료 추가 모달 컴포넌트 렌더링 */}
      <IngredientSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIngredients={(newItems) => {
          setSelectedIngredients([...selectedIngredients, ...newItems]);
        }}
        existingIngredients={selectedIngredients}
      />
    </Wrapper>
    </>
  );
}