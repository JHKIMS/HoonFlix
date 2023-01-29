const API_KEY = "d26211d0250de8a8a3b00df5beeddcdd";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)
    .then((response) => response.json())
}