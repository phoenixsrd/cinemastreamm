import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'cc2577ef867decbe177dea0f28d5f028';
const API_URL = 'https://api.themoviedb.org/3/movie/popular?api_key=' + API_KEY;

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
};

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios.get(API_URL).then(response => {
      setMovies(response.data.results);
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
    </div>
  );
}