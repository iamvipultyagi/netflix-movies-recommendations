import React from 'react'
import lang from '../utils/languageConstants'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'

import { groq} from '../utils/genAI'
import { API_OPTIONS } from '../utils/constants'
import { addGptMovieResult, setLoadingBtn } from '../utils/gptSlice'

const GptSearchBar = () => {
    const dispatch = useDispatch();
    const langKey = useSelector((store)=>store.config.lang)
    const searchText = useRef(null);
    const loadingBtn = useSelector((store)=>store.gpt.loadingBtn);
    
    //search movie in TMDB
    const searchMovieTMDB = async (movie) => {
      const data = await fetch("https://api.themoviedb.org/3/search/movie?query="+movie+"&include_adult=false&language=en-US&page=1&api_key=2e425961fdfa937368c286cc6d285050", API_OPTIONS);
      const json = await data.json();
      return json.results;
    }

    const handleGptSearchClick = async () => {
      dispatch(setLoadingBtn());

      const gptQuery =
        "Act as a Movie Recommendation system and suggest some movies for the query : " +
        searchText.current.value +
        ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

      try {

        // Call generateContent with proper format
        const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: gptQuery,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

        // Get the text response
        const textResponse = result.choices[0]?.message?.content;

        // Split into movie names and clean up
        const gptMovies = textResponse
          .split(",")
          .map(m => m.trim())
          .filter(m => m.length > 0);

        // For each movie, search TMDB API
        const promiseArray = gptMovies.map(movie => searchMovieTMDB(movie));
        const tmdbResults = await Promise.all(promiseArray);

        dispatch(addGptMovieResult({movieNames: gptMovies, movieResults: tmdbResults}));
      } catch (error) {
        console.error("Error fetching GPT results:", error);
        alert("Error: " + error.message);
      } finally {
        dispatch(setLoadingBtn());
      }
    }

    return (
      <div className='pt-[55%] md:pt-[10%] flex justify-center'>
        <form 
          className='w-full md:w-1/2 bg-black grid grid-cols-12 bg-opacity-60'
          onSubmit={(e)=>e.preventDefault()}>
          <input 
            ref={searchText}
            type='text' 
            className='p-4 m-4 col-span-9 text-lg ' 
            placeholder={lang[langKey].gptSearchPlaceholder}></input>
          {loadingBtn ?
            <div className="mt-6 ml-6 md:ml-24 w-12 h-12 border-4 border-t-4 border-t-red-700 border-red-300 rounded-full animate-spin"></div>
           : <button 
              onClick={handleGptSearchClick}
              className='py-2 md:px-4 bg-red-700 col-span-3 m-4 rounded-lg text-lg font-bold'
            >{lang[langKey].search}</button>}
        </form>
      </div>
    )
}

export default GptSearchBar