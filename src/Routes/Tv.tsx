import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getAiringTvShows,
  getPopTvShows,
  getTopTvShows,
  IGetMoviesResult,
} from "../api";
import { BannerSize } from "../atoms";
import Slide from "../Components/Slide";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: #000;
`;
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vh;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const OverView = styled.p`
  font-size: 36px;
  width: 50%;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

function Tv() {
  const { data: tvTop, isLoading: tvTopLoading } = useQuery<IGetMoviesResult>(
    ["tvTopList"],
    getTopTvShows
  );
  const { data: tvPop, isLoading: tvPopLoading } = useQuery<IGetMoviesResult>(
    ["tvPopList"],
    getPopTvShows
  );
  const { data: tvAiring, isLoading: tvAirLoading } =
    useQuery<IGetMoviesResult>(["tvAiringList"], getAiringTvShows);

  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const offSet = 6;

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const increaseIndex = () => {
    if (tvPop) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = tvPop.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offSet) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <Wrapper>
      {tvPopLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(tvPop?.results[0].backdrop_path || "")}
          >
            <Title>{tvPop?.results[0].title}</Title>
            <OverView>{tvPop?.results[0].overview}</OverView>
          </Banner>

          {/* <Slide data={tvAiring as IGetMoviesResult} title={"On the Air"} menuName={"tv"} videoType={"tv"} /> */}
          {/* <Slide data={tvTop as IGetMoviesResult} title={"High Rated"} menuName={"tv"} videoType={"tv"}/> */}
          {/* <Slide data={tvPop as IGetMoviesResult} title={"Popular"} menuName={"tv"} videoType={"tv"}/> */}
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
