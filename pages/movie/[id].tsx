import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

type Genre = {
  id: number;
  name: string;
};

type CastMember = {
  id: number;
  name: string;
  character: string;
};

type Recommendation = {
  id: number;
  title: string;
  poster_path: string | null;
};

type Video = {
  key: string;
  site: string;
  type: string;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
  original_language: string;
};

type MovieDetailsProps = {
  movie: Movie;
  cast: CastMember[];
  recommendations: Recommendation[];
  trailerKey: string | null;
};

const FAVORITES_STORAGE_KEY = 'cinema_streamm_favorites';
const ptBrDateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

const formatDate = (value: string) => {
  if (!value) return 'Data não informada';

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return ptBrDateFormatter.format(parsedDate);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Data não informada';

  return ptBrDateFormatter.format(parsed);
};

export default function MovieDetails({ movie, cast, recommendations, trailerKey }: MovieDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const favoriteKey = useMemo(() => `movie-${movie.id}`, [movie.id]);

  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setIsFavorite(parsed.includes(favoriteKey));
      }
    } catch {
      setIsFavorite(false);
    }
  }, [favoriteKey]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    const list = Array.isArray(parsed) ? parsed : [];

    if (list.includes(favoriteKey)) {
      const next = list.filter((item: string) => item !== favoriteKey);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      setIsFavorite(false);
      return;
    }

    const next = [...list, favoriteKey];
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    setIsFavorite(true);
  };

  return (
    <>
      <Head>
        <title>{movie.title} | Cinema Streamm</title>
        <meta name="description" content={movie.overview || `Detalhes do filme ${movie.title} no Cinema Streamm.`} />
      </Head>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Link href="/" className="inline-block text-red-600 hover:text-red-500 font-semibold">
          ← Voltar para home
        </Link>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">Sem pôster</div>
            )}
          </div>

          <div className="md:col-span-2 space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{movie.title}</h1>
            <p className="text-gray-700 dark:text-gray-300">{movie.overview || 'Sem descrição disponível.'}</p>
            <p>
              <strong>Lançamento:</strong> {formatDate(movie.release_date)}
            </p>
            <p>
              <strong>Nota:</strong> ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
            </p>
            <p>
              <strong>Duração:</strong> {movie.runtime ? `${movie.runtime} min` : 'Não informado'}
            </p>
            <p>
              <strong>Idioma original:</strong> {movie.original_language?.toUpperCase() || 'N/A'}
            </p>
            <p>
              <strong>Gêneros:</strong> {movie.genres?.length ? movie.genres.map((genre) => genre.name).join(', ') : 'Não informado'}
            </p>

            <button
              type="button"
              onClick={toggleFavorite}
              className={`rounded-md px-4 py-2 font-semibold ${
                isFavorite ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {isFavorite ? '★ Remover dos favoritos' : '☆ Adicionar aos favoritos'}
            </button>
          </div>
        </section>

        {trailerKey && (
          <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <h2 className="text-2xl font-bold mb-4">Trailer</h2>
            <div className="relative w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={`Trailer de ${movie.title}`}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h2 className="text-2xl font-bold mb-4">Elenco principal</h2>
          {cast.length === 0 ? (
            <p>Elenco não disponível.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cast.map((member) => (
                <li key={member.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{member.character}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <h2 className="text-2xl font-bold mb-4">Recomendações similares</h2>
          {recommendations.length === 0 ? (
            <p>Não há recomendações no momento.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {recommendations.map((item) => (
                <Link key={item.id} href={`/movie/${item.id}`} className="group">
                  <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {item.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm">Sem pôster</div>
                    )}
                  </div>
                  <p className="text-sm mt-2 font-semibold line-clamp-2">{item.title}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const movieId = Array.isArray(id) ? id[0] : id;

  if (!movieId || typeof movieId !== 'string' || !/^\d+$/.test(movieId)) {
    return { notFound: true };
  }

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  try {
    const [movieRes, creditsRes, videosRes, recommendationsRes] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=pt-BR`),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=pt-BR`),
      axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}&language=pt-BR&page=1`),
    ]);

    const trailer = (videosRes.data.results || []).find(
      (video: Video) => video.site === 'YouTube' && video.type === 'Trailer'
    );

    return {
      props: {
        movie: movieRes.data,
        cast: (creditsRes.data.cast || []).slice(0, 9),
        recommendations: (recommendationsRes.data.results || []).slice(0, 10),
        trailerKey: trailer?.key || null,
      },
    };
  } catch {
    return { notFound: true };
  }
};
