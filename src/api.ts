const API_KEY = "d26211d0250de8a8a3b00df5beeddcdd";
const BASE_PATH = "https://api.themoviedb.org/3";

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

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
