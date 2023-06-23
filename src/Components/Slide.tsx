import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { IGetMoviesResult } from "../api";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { slideCnt } from "../atoms";
import { makeImagePath } from "../utils";

interface ISlider {
  data: IGetMoviesResult;
  title: string;
  menuName: string;
  videoType: string;
  listType: string;
}

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
`;

const BigRating = styled.div<{ rating: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  min-height: 30px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.rating > 7 ? "#44bd32" : props.rating > 4 ? "#fa8231" : "#eb3b5a"};
  font-size: 20px;
  font-weight: 600;
`;

const BigInfoTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
`;
const BigInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
  margin-bottom: 250px;
`;
const MainTitle = styled.div`
  font-size: 1.4rem;
  padding-left: 2rem;
  font-weight: 700;
  padding-bottom: 1rem;
`;
const Info = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  padding: 10px;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const offSet = 6;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const ArrowBtn = styled(motion.div)`
  position: absolute;
  top: 300%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  color: #fff;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.3;
  transition: all 0.3s;
  z-index: 90;
  cursor: pointer;
  &:hover {
    opacity: 1;
    color: #000;
    background-color: #fff;
  }
  &:blur {
    color: #fff;
    background-color: #000;
  }
  svg {
    width: 2.8rem;
    height: 2.8rem;
  }
`;
const LeftBtn = styled(ArrowBtn)`
  left: 0;
`;

const RightBtn = styled(ArrowBtn)`
  right: 0;
`;

// ----------- Variants ------------------
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const rowVariants = {
  hidden: (right: number) => {
    return {
      x: right === 1 ? window.innerWidth + 5 : -window.innerWidth - 5,
    };
  },
  visible: {
    x: 0,
    y: 0,
  },
  exit: (right: number) => {
    return {
      x: right === 1 ? -window.innerWidth - 5 : window.innerWidth + 5,
    };
  },
};

export default function Slide({
  data,
  title,
  menuName,
  videoType,
  listType,
}: ISlider) {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const offset = useRecoilValue(slideCnt);
  const [isRight, setIsRight] = useState(1);
  const { scrollY } = useScroll();

  const bigModalmatch = useRouteMatch<{ id: string }>(
    `/${menuName}/${listType}/:id`
  );

  const onOverlayClicked = () => history.push(`/`);
  const clickedMovie =
    bigModalmatch?.params.id &&
    data?.results.find((movie) => movie.id + "" === bigModalmatch.params.id);

  const rowProps = {
    gridcnt: offset,
    custom: isRight,
    variants: rowVariants,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    transition: { type: "tween", duration: 1 },
    key: index,
  };

  const toggleLeaving = (value: boolean) => {
    setLeaving(value);
    setDragMode(value);
  };
  const onBoxClicked = (menu: string, type: string, id: number) => {
    history.push(`/${menu}/${type}/${id}`);
  };

  const changeIndex = (right: number) => {
    if (leaving || dragMode) return;

    if (data) {
      toggleLeaving(true);
      setIsRight(right);
      const totalLength = data.results.length;
      const maxIndex =
        totalLength % offset === 0
          ? Math.floor(totalLength / offset) - 1
          : Math.floor(totalLength / offset);

      right === 1
        ? setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
        : setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onClickToArrowBtn = (right: number) => {
    if (!leaving && !dragMode) {
      changeIndex(right);
    }
  };
  return (
    <>
      <Slider>
        <MainTitle>{title}</MainTitle>
        <LeftBtn onClick={() => onClickToArrowBtn(-1)}>
          <AiOutlineLeft />
        </LeftBtn>
        <RightBtn onClick={() => onClickToArrowBtn(1)}>
          <AiOutlineRight />
        </RightBtn>
        <AnimatePresence
          initial={false}
          onExitComplete={() => toggleLeaving(false)}
          custom={isRight}
        >
          <Row {...rowProps}>
            {data?.results
              .slice(offSet * index, offSet * index + offSet)
              .map((d) => (
                <Box
                  layoutId={d.id + "" + listType}
                  key={d.id}
                  whileHover="hover"
                  initial="normal"
                  onClick={() => onBoxClicked(menuName, listType, d.id)}
                  transition={{ type: "tween" }}
                  variants={boxVariants}
                  $bgPhoto={makeImagePath(d.backdrop_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <h4>{d.title ? d.title : d.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>

        <AnimatePresence>
          {bigModalmatch ? (
            <>
              <Overlay
                onClick={onOverlayClicked}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></Overlay>
              <BigMovie
                style={{ top: scrollY.get() - 1100 }}
                layoutId={bigModalmatch?.params.id}
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
                    <BigInfoBox>
                      <BigInfoTitle>평점</BigInfoTitle>
                      <BigRating rating={clickedMovie.vote_average}>
                        {clickedMovie.vote_average}
                      </BigRating>
                    </BigInfoBox>
                  </>
                )}
              </BigMovie>
            </>
          ) : null}
        </AnimatePresence>
      </Slider>
    </>
  );
}
