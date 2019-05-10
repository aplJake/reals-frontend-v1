import React from 'react';
import Header from './Header';
import styled from 'styled-components'

const Style = styled.div`
  
`

const Wrapper = styled.div`
  margin: 80px 0;
`

export default ({ children }) => {
  return (
    <Style>
      <Header />
      <Wrapper>
        {children}
      </Wrapper>
    </Style>
  );
};
