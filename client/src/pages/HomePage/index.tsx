import React, { useEffect, useState } from "react";
import { Wrapper, Container, Header, Heading, Body, Button } from "./styled";

const HomePage = ({ history, ...props }) => {
  return (
    <Wrapper>
      <Container>
        <Header>
          <Heading>Welcome!</Heading>
        </Header>
        <Body>
          <Button
            onClick={() =>
              history.push({
                pathname: `/schedule`,
              })
            }
          >
            Next
          </Button>
        </Body>
      </Container>
    </Wrapper>
  );
};

export default HomePage;
