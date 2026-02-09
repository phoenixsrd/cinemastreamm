import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const MOVIE_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`;
const TV_API_URL = `https://api.themoviedb.org/3/tv/popular?api_key=${NEXT_PUBLIC_TMDB_API_KEY;}&language=pt-BR`;

type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
};

export default function Home() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTvShows] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
           axios.get(MOVIE_API_URL),
           axios.get(TV_API_URL)
        ]);
        setMovies(movieRes.data.results);
        setTvShows(tvRes.data.results);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    };
    fetchData();
  }, []);

  const MediaCard = ({ item, type }: { item: MediaItem, type: 'movie' | 'tv' }) => (
    <Link href={`/${type}/${item.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
        <div className="relative aspect-[2/3] w-full">
          <img 
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
            alt={item.title || item.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg leading-tight mb-2 truncate text-gray-900 dark:text-white">
            {item.title || item.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {item.overview || "Sem descrição disponível."}
          </p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen pb-10">
      <nav className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-lg mb-8">
        <h1 className="text-3xl font-extrabold text-center tracking-wide">Cinema Stream</h1>
      </nav>

      <main className="container mx-auto px-4">
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 pl-4 border-l-4 border-red-500 text-gray-800 dark:text-white">
            Filmes Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => (
              <MediaCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 pl-4 border-l-4 border-blue-500 text-gray-800 dark:text-white">
            Séries Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tvShows.map(show => (
              <MediaCard key={show.id} item={show} type="tv" />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
