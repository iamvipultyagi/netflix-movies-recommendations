// Recommendation.js

import React from 'react'
import { groq } from '../utils/genAI'
import { useDispatch } from 'react-redux'
import { addGptMovieResult, setLoadingBtn } from '../utils/gptSlice'
import { API_OPTIONS } from '../utils/constants'

const Recommendation = () => {
    
    const dispatch = useDispatch();

    const searchMovieTMDB = async (movie) => {
        const data = await fetch("https://api.themoviedb.org/3/search/movie?query="+movie+"&include_adult=false&language=en-US&page=1&api_key=2e425961fdfa937368c286cc6d285050", API_OPTIONS);
        const json = await data.json();
        return json.results;
    }

    const fn = async(e) => {
        dispatch(setLoadingBtn());
        
        const gptQuery =
            "Act as a Movie Recommendation system and suggest some movies for the query : " +
            e.target.value +
            ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";
        
        try {
            // Correct Groq syntax
            const gptResults = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: gptQuery,
            },
        ],
        model: "llama-3.3-70b-versatile", 
    });
            
            // Get the text response
            const textResponse = gptResults.choices[0].message.content;
            
            // Split into movie names and clean up
            const gptMovies = textResponse
                .split(",")
                .map(movie => movie.trim())
                .filter(movie => movie.length > 0);

            // For each movie I will search TMDB API
            const promiseArray = gptMovies.map(movie => searchMovieTMDB(movie))
            
            const tmdbResults = await Promise.all(promiseArray);

            
            
            dispatch(addGptMovieResult({movieNames: gptMovies, movieResults: tmdbResults}));
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            alert("Error: " + error.message);
        } finally {
            dispatch(setLoadingBtn());
        }
    }

    return (
        <div className='hidden lg:pt-5 lg:flex lg:flex-row lg:justify-center grid-cols-12'>
            <div className=' w-full md:w-1/2  bg-transparent grid justify-center'>
                <div className='m-3 grid-cols-6'>
                    <button value="Action" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Action</button>
                    <button value="Adventure" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2  font-semibold w-28 h-12 mb-2'>Adventure</button>
                    <button value="Animation" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Animation</button>
                    <button value="Comedy" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Comedy</button>
                    <button value="Crime" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Crime</button>
                    <button value="Cartoon" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2  font-semibold w-28 h-12 mb-2'>Cartoon</button>
                </div>
                <div className='m-3 grid-cols-6'>
                    <button value="Family" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Family</button>
                    <button value="Fantasy" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Fantasy</button>
                    <button value="History" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>History</button>
                    <button value="Horror" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Horror</button>
                    <button value="Documentary" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2  font-semibold w-28 h-12 mb-2 '>Documentary</button>
                    <button value="Drama" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2 '>Drama</button>
                </div>
                <div className='m-3 grid-cols-6'>
                    <button value="Mystery" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Mystery</button>
                    <button value="Romance" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2 '>Romance</button>
                    <button value="Thriller" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2 '>Thriller</button>
                    <button value="Science" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Science</button>
                    <button value="War" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>War</button>
                    <button value="Bhakti" onClick={fn} className='bg-white text-black bg-opacity-90 rounded-lg mx-2 font-semibold w-28 h-12 mb-2'>Bhakti</button>
                </div>
            </div>
        </div>
    )
}

export default Recommendation