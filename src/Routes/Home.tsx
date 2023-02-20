import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovies, getNowPlayingMovie, getTopMovie, getUpcomingMovies, IGetMoviesResult, TYPE_VIDEO } from "../api";
import Slide from "../Components/Slide";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const OverView = styled.p`
  font-size: 36px;
  width: 50%;
`;

const offSet = 6;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 36px;
  position: relative;
  top: -60px;
`;
const BigOverView = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -80px;
`
function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useScroll();
  
  // 영화-현재상영작
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    [TYPE_VIDEO[0], "nowPlayingMovies"],
    getNowPlayingMovie
  );

  // 영화-인기영화
  const { data: topMovie } = useQuery<IGetMoviesResult>(
    [TYPE_VIDEO[2], "topMovie"],
    getTopMovie
  );

  // 영화-개봉예정
  const { data: upComingMovie } = useQuery<IGetMoviesResult>(
    [TYPE_VIDEO[2], "upComingMovie"],
    getUpcomingMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offSet) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
 
  const onOverlayClicked = () => history.push(`/`);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading.....</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>

          <Slide
            data={data as IGetMoviesResult}
            title={"NOW_PLAYING_MOVIE"}
            menuName={"Home"}
            videoType={"movie"}
            listType={TYPE_VIDEO[0]}
          />
          <Slide
            data={topMovie as IGetMoviesResult}
            title={"TOP_RATED_MOVIE"}
            menuName={"Home"}
            videoType={"movie"}
            listType={TYPE_VIDEO[1]}
          />
          <Slide
            data={upComingMovie as IGetMoviesResult}
            title={"UPCOMING_MOVIE"}
            menuName={"Home"}
            videoType={"movie"}
            listType={TYPE_VIDEO[2]}
          />

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                ></Overlay>
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId + ""}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,black, transparent), 
                          url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverView>{clickedMovie.overview}</BigOverView>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
// Back
export default Home;
