import { Container, AspectRatio } from "@chakra-ui/react";
import type { NextPage } from "next";
import { YouTubeIFrame } from "use-youtube-player";

const Home: NextPage = () => {
  return (
    <Container>
      <AspectRatio ratio={16 / 9}>
        <YouTubeIFrame videoId="I2RVFxE3wic" />
      </AspectRatio>
    </Container>
  );
};

export default Home;
