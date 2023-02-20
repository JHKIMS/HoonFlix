import { useForm } from "react-hook-form";
import { useLocation, useRouteMatch, matchPath } from "react-router-dom";
import styled from "styled-components";
import { URLSearchParams } from "url";

const SearchForm = styled.form`
    width: 100%;
    padding-bottom: 2rem;
    color: #fff;
    z-index: 0;
`
interface ISearch{
    searchKeyword: string;
}

function Search(){
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");

    const { register, handleSubmit, setValue } = useForm<ISearch>();
    setValue("searchKeyword", keyword || "");


    return(
        <>
            
        </>
    )
}

export default Search;