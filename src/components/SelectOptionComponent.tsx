import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

interface SelectOptionComponentProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectOptionComponent: React.FC<SelectOptionComponentProps> = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "انتخاب",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SelectWrapper dir="ltr" ref={wrapperRef}>
      <SelectBox onClick={toggleMenu} $isOpen={isOpen} $hasValue={!!value} $disabled={disabled}>
        <ArrowIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.9201 8.9502L13.4001 15.4702C12.6301 16.2402 11.3701 16.2402 10.6001 15.4702L4.08008 8.9502"
              stroke="#5E615D"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ArrowIcon>
        <TextSpan>{value || placeholder}</TextSpan>
      </SelectBox>
      <AnimatePresence>
        {isOpen && (
          <Menu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <MenuItem
              key="placeholder"
              onClick={() => handleSelect("")}
              whileHover={{ backgroundColor: "#f0f0f0" }}
              whileTap={{ scale: 0.98 }}
            >
              {placeholder}
            </MenuItem>
            {options.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleSelect(option)}
                whileHover={{ backgroundColor: "#f0f0f0" }}
                whileTap={{ scale: 0.98 }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        )}
      </AnimatePresence>
    </SelectWrapper>
  );
};

const SelectWrapper = styled.div`
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const SelectBox = styled.div<{ $isOpen: boolean; $hasValue: boolean; $disabled: boolean }>`
  position: relative;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: ${props => (props.$isOpen ? "8px 8px 0 0" : "4px")};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: ${props => (props.$hasValue ? "#374151" : "#9ca3af")};
  cursor: ${props => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease-in-out, border-radius 0.3s ease-in-out;
  background-color: #ffffff;
  width: clamp(80px, 10vw, 150px);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
  }

  &:hover {
    border-color: ${props => (props.$disabled ? "#d1d5db" : "#3b82f6")};
  }

  ${props =>
    props.$isOpen &&
    `
    border-color: #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
  `}

  ${props =>
    props.$disabled &&
    `
    background-color: #f3f4f6;
    opacity: 0.5;
  `}

  & svg {
    height: 10px;
  }
`;

const TextSpan = styled.span`
  text-align: center;
  display: flex;
  align-items: center;
`;

const ArrowIcon = styled(motion.div)`
  @media (max-width: 480px) {
    svg {
      width: clamp(15px, 3vw, 20px);
      height: clamp(10px, 2vw, 20px);
    }
  }
`;

const Menu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #3b82f6;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media (max-width: 480px) {
    max-height: 150px;
  }
`;

const MenuItem = styled(motion.div)`
  padding: 8px;
  text-align: center;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;