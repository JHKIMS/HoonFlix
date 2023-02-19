const API_KEY = "d26211d0250de8a8a3b00df5beeddcdd";
const BASE_PATH = "https://api.themoviedb.org/3";
const REGION = "KR";
const LANGUAGE = "ko-KO";
const NATION_PATH = `api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`;


interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface IGetMoviesResult {
    maximum: string;
    minimum: string;
    page: number;
    results: IMovie[];
    total_pages: number;
    total_result: number;
}


// 영화-현재상영작
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// 영화-개봉예정작
export function getUpcomingMovie() {
  return fetch(`${BASE_PATH}/movie/upcoming?${NATION_PATH}`).then((response) =>
    response.json()
  );
}

// 영화-인기영화
export function getPopularMovie() {
  return fetch(`${BASE_PATH}/movie/popular?${NATION_PATH}`).then((response) =>
    response.json()
  );
}



export interface IGetDataResult{
  dates?: {
    maximum: string;
    minimuk: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export const TYPE_VIDEO = [
  "nowPlaying",
  "upcomingMovies",
  "popularMovies",
  "tvShow",
];
// Movies - NowPlaying
export function getNowPlayingMovie() {
  return fetch(`${BASE_PATH}/movie/now_playing?${NATION_PATH}`).then((response) =>
    response.json()
  );
}