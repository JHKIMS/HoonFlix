import { useQuery } from "react-query";
import { getMovies } from "../api";

interface IMovie{
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface IGetMoviesResult{
  dates: {
    maximum: string;
    minimum: string;
    page:number;
    result: IMovie[];
    total_pages: number;
    total_result: number;
  };
}

function Home() {
  const {data, isLoading} = useQuery(["movies","nowPlaying"], getMovies)
  return <div style={{ backgroundColor: "whitesmoke", height: "200vh" }}></div>;
}

export default Home;
