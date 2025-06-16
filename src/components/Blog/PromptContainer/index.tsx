/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import defaultTheme from "../../Theme";

const Container = styled.div`
  padding-top: 1.5rem;

`;

const Title = styled.h5`
  fontSize: .1rem;
  color: rgb(144, 152, 177);
  margin: 0 0 1rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

interface Props {
  children: React.ReactNode;
}

const PromptContainer: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      <Title>ASK ABOUT THIS PROJECT</Title>
      <ButtonContainer>{children}</ButtonContainer>
    </Container>
  );
};

export default PromptContainer; 