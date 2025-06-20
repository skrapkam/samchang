/** @jsx jsx */
import { jsx, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { useState, useEffect } from "react";

// Shimmer animation keyframes
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Reverse shimmer animation
const shimmerReverse = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right';
  duration?: number;
  shimmerColor?: string;
  baseColor?: string;
  isActive?: boolean;
}

interface StyledShimmerTextProps {
  direction: 'left' | 'right';
  duration: number;
  shimmerColor: string;
  baseColor: string;
  isActive: boolean;
}

const StyledShimmerText = styled.span<StyledShimmerTextProps>`
  background: linear-gradient(
    90deg,
    ${props => props.baseColor} 25%,
    ${props => props.shimmerColor} 50%,
    ${props => props.baseColor} 75%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${props => props.isActive ? (props.direction === 'right' ? shimmer : shimmerReverse) : 'none'} ${props => props.duration}ms ease-in-out infinite;
  display: inline-block;
  position: relative;
  
  /* Fallback for browsers that don't support background-clip: text */
  @supports not (background-clip: text) {
    background: none;
    -webkit-text-fill-color: initial;
    color: ${props => props.baseColor};
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 25%,
        ${props => props.shimmerColor} 50%,
        transparent 75%
      );
      background-size: 200% 100%;
      animation: ${props => props.isActive ? (props.direction === 'right' ? shimmer : shimmerReverse) : 'none'} ${props => props.duration}ms ease-in-out infinite;
      opacity: 0.7;
      pointer-events: none;
    }
  }
`;

const ShimmerText: React.FC<ShimmerTextProps> = ({
  children,
  className,
  direction = 'right',
  duration = 1500,
  shimmerColor = '#ffffff',
  baseColor = '#666666',
  isActive = true
}) => {
  return (
    <StyledShimmerText
      className={className}
      direction={direction}
      duration={duration}
      shimmerColor={shimmerColor}
      baseColor={baseColor}
      isActive={isActive}
    >
      {children}
    </StyledShimmerText>
  );
};

export default ShimmerText; 