/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { CaseStudyView, useCaseStudyView } from "./CaseStudyViewContext";

const ToggleContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #161616;
  color: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  border: 1px solid #2a2a2a;
  font-family: 'BerkeleyMonoTrial', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1;
`;

const Option = styled.button<{ selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: inherit; /* ensure button uses container font */
  font-weight: 400;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;

  &:focus { outline: none; }
  &:focus-visible { outline: 2px solid #4b88ff; outline-offset: 2px; }
`;

const RadioIcon = styled.span<{ selected: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #d1d5db;
  display: inline-block;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => (props.selected ? '#ffffff' : 'transparent')};
    transform: translate(-50%, -50%);
  }
`;

const Label = styled.span``;

const Toggle: React.FC = () => {
  const { view, setView } = useCaseStudyView();

  const handleSelect = (v: CaseStudyView) => setView(v);

  return (
    <ToggleContainer role="radiogroup" aria-label="Case study view">
      <Option
        type="button"
        role="radio"
        aria-checked={view === 'visuals'}
        selected={view === 'visuals'}
        onClick={() => handleSelect('visuals')}
      >
        <RadioIcon selected={view === 'visuals'} />
        <Label>VISUALS</Label>
      </Option>
      <Option
        type="button"
        role="radio"
        aria-checked={view === 'process'}
        selected={view === 'process'}
        onClick={() => handleSelect('process')}
      >
        <RadioIcon selected={view === 'process'} />
        <Label>PROCESS</Label>
      </Option>
    </ToggleContainer>
  );
};

export default Toggle;
