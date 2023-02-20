const API_KEY = "d26211d0250de8a8a3b00df5beeddcdd";
const BASE_PATH = "https://api.themoviedb.org/3";
const REGION = "KR";
const LANGUAGE = "ko-KO";
const NATION_PATH = `api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`;


interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name?: string;
  title?: string;
  overview: string;
  vote_average: number;
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

// 영화-TopRated
export function getTopMovie() {
  return fetch(`${BASE_PATH}/movie/top_rated?${NATION_PATH}`).then((response) =>
    response.json()
  );
}

// 영화-개봉예정영화
export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?${NATION_PATH}`).then((response) =>
    response.json()
  );
}

// TvShows-Popular
export function getPopTvShows() {
  return fetch(`${BASE_PATH}/tv/popular?${NATION_PATH}`).then((response) =>
    response.json()
  );
}
// TvShows-TopRated
export function getTopTvShows() {
  return fetch(`${BASE_PATH}/tv/top_rated?${NATION_PATH}`).then((response) =>
    response.json()
  );
}
// TvShows-AiringToday
export function getAiringTvShows() {
  return fetch(`${BASE_PATH}/tv/airing_today?${NATION_PATH}`).then((response) =>
    response.json()
  );
}


export const TYPE_VIDEO = [
  "nowPlaying",
  "upcomingMovies",
  "popularMovies",
  "tvAiring",
  "tvTop",
  "tvPop",
];
// Movies - NowPlaying
export function getNowPlayingMovie() {
  return fetch(`${BASE_PATH}/movie/now_playing?${NATION_PATH}`).then((response) =>
    response.json()
  );
}