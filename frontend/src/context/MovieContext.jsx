import { createContext, useState, useContext, useEffect } from "react"
import { getGenres } from "../services/api"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState([])
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState(null)

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genreList = await getGenres();
                setGenres(genreList);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        const storedFavs = localStorage.getItem('favorites')

        //JSON parse converts the string back to an array
        if(storedFavs) {
            setFavorites(JSON.parse(storedFavs))
        }
    },[])

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        genres,
        selectedGenre,
        setSelectedGenre

    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}