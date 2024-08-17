import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'cc2577ef867decbe177dea0f28d5f028';
const MOVIE_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR`;
const TV_API_URL = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR`;

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
};

type TVShow = {
  id: number;
  name: string;
  poster_path: string;
  overview: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);

  useEffect(() => {
    axios.get(MOVIE_API_URL).then(response => {
      setMovies(response.data.results);
    });
    axios.get(TV_API_URL).then(response => {
      setTvShows(response.data.results);
    });
  }, []);

  return (
    <div>
      <h1>Filmes Populares</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movies.map(movie => (
          <div key={movie.id} style={{ margin: 10 }}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width={200} />
            <h3>{movie.title}</h3>
            <p>{movie.overview}</p>
          </div>
        ))}
      </div>
      <h1>Séries Populares</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {tvShows.map(show => (
          <div key={show.id} style={{ margin: 10 }}>
            <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} width={200} />
            <h3>{show.name}</h3>
            <p>{show.overview}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
