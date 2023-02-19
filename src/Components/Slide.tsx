import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
}


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
  top:300%;
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

export default function Slide({data, title}:ISlider){

  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [dragMode, setDragMode] = useState(false); 
  const offset = useRecoilValue(slideCnt);
  const [isRight, setIsRight] = useState(1);

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
  const onBoxClicked = (movieId: number) => {
     history.push(`/movies/${movieId}`);
     
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
      <LeftBtn onClick={()=> onClickToArrowBtn(-1)}>
          <AiOutlineLeft/>
      </LeftBtn>
      <RightBtn onClick={() => onClickToArrowBtn(1)}>
        <AiOutlineRight />
      </RightBtn>
            <AnimatePresence initial={false} onExitComplete={() => toggleLeaving(false)} custom={isRight}>
              <Row
                {...rowProps}
              >
                {data?.results
                  .slice(offSet * index, offSet * index + offSet)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      variants={boxVariants}
                      $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          </>
  );
}