import styled from '@emotion/styled'
import './variables.css'
import './base.css'

export const SectionWrapper = styled.div`
  max-width: 852px;
  margin: 24px auto;

  @media (max-width: 950px) {
    max-width: 100%;
  }
  @media (max-width: 425px) {
    position: relative;
    padding-top: 104px;
    margin: 0px auto;
  }
`
export const HeaderWrapper = styled.div`
  padding: 40px 40px 32px;
  @media (max-width: 950px) {
    padding: 32px 24px 32px;
  }

  @media (max-width: 425px) {
    padding: 24px 24px 24px;
    position: fixed;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 1px 0px;
    background-color: #fff;
    top: 0;
    z-index: 999;
  }
`

export const Container = styled.div`
  padding-bottom: 24px;
`

export const MediumSectionWrapper = styled.div`
  padding-left: 40px;
  max-width: 750px;
  padding-bottom: 24px;
  @media (max-width: 950px) {
    padding: 0 var(--baseline) 24px;
  }

  @media (max-width: 425px) {
    position: relative;
    padding-top: 104px;
  }

  li {
    margin: 0 40px;
  }

  details li {
    margin-right: 0px;
  }

  summary {
    cursor: pointer;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  details li:first-of-type {
    margin-top: 8px;
  }
`
