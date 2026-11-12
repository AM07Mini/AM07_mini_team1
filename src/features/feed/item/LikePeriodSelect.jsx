import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Icon from '../../../components/styled/Icon';
import { colors, radius, shadows, font } from '../../../components/styled/theme';

const Box = styled.div`
  position: relative;
`;

// 피그마 "이번 주 ⌄" — 펼치면 옅은 강조 배경
const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 10px 0 14px;
  border: 1px solid ${colors.primary};
  border-radius: ${radius.card}px;
  background-color: ${(props) => (props.$open ? colors.accent2 : colors.white)};
  font-family: inherit;
  ${font('sub')}
  font-weight: 700;
  color: ${colors.primary};
  cursor: pointer;

  svg {
    transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
    transition: transform 0.2s;
  }
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 220px;
  padding: 6px;
  border-radius: ${radius.button}px;
  background-color: ${colors.white};
  box-shadow: ${shadows.card};
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px;
  border: none;
  border-radius: ${radius.small}px;
  background-color: ${(props) => (props.$selected ? colors.surface : 'transparent')};
  font-family: inherit;
  text-align: left;
  color: ${colors.primary};
  cursor: pointer;

  strong {
    display: block;
    ${font('label')}
    color: ${colors.dark};
  }

  small {
    ${font('caption')}
    color: ${colors.grey2};
  }
`;

// 아래 화살표 — 색은 글자색을 따라감
const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 좋아요 기간 고르기 드롭다운 (유행 레시피 인기순 탭)
// options: [{ value, title, short, description }] — short는 닫혀 있을 때 버튼에 보이는 짧은 이름
// 사용: <LikePeriodSelect options={periods} selected={period} changeHandler={setPeriod} />
const LikePeriodSelect = ({ options, selected, changeHandler }) => {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const triggerRef = useRef(null);
  const current = options.find((option) => option.value === selected) ?? options[0];

  // 바깥을 누르거나 Esc를 누르면 닫힘 (Esc면 버튼으로 포커스 돌려놓기)
  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false);
    };
    const closeByEsc = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeByEsc);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeByEsc);
    };
  }, [open]);

  const choose = (value) => {
    changeHandler(value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <Box ref={boxRef}>
      <Trigger
        ref={triggerRef}
        type="button"
        $open={open}
        aria-expanded={open}
        aria-label={`좋아요 기간: ${current.title}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {current.short}
        <Chevron />
      </Trigger>
      {open && (
        <Menu>
          {options.map((option) => (
            <Option
              key={option.value}
              type="button"
              $selected={option.value === selected}
              aria-pressed={option.value === selected}
              onClick={() => choose(option.value)}
            >
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
              {option.value === selected && <Icon name="check" size={18} />}
            </Option>
          ))}
        </Menu>
      )}
    </Box>
  );
};

export default LikePeriodSelect;
