import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type MediaType = 'movie' | 'tv';
type SortType = 'popularity.desc' | 'vote_average.desc' | 'release_date.desc';

type Genre = {
  id: number;
  name: string;
};

type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  original_language?: string;
};

type DiscoverResponse = {
  page: number;
  total_pages: number;
  results: MediaItem[];
};

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function formatDate(value?: string) {
  if (!value) return 'Data não informada';
  return new Date(value).toLocaleDateString('pt-BR');
}

export default function Home() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [tvShows, setTvShows] = useState<MediaItem[]>([]);
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [movieHasMore, setMovieHasMore] = useState(true);
  const [tvHasMore, setTvHasMore] = useState(true);

  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingTv, setLoadingTv] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [searchTypeFilter, setSearchTypeFilter] = useState<'all' | MediaType>('all');

  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<number | ''>('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState<SortType>('popularity.desc');

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const loadFavorites = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('cinema_streamm_favorites');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setFavoriteIds(parsed);
      }
    } catch {
      setFavoriteIds([]);
    }
  };

  const saveFavorites = (nextFavorites: string[]) => {
    setFavoriteIds(nextFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinema_streamm_favorites', JSON.stringify(nextFavorites));
    }
  };

  const favoriteKey = (item: MediaItem, type: MediaType) => `${type}-${item.id}`;

  const toggleFavorite = (item: MediaItem, type: MediaType) => {
    const key = favoriteKey(item, type);
    const exists = favoriteIds.includes(key);
    saveFavorites(exists ? favoriteIds.filter((id) => id !== key) : [...favoriteIds, key]);
  };

  const fetchGenres = async () => {
    try {
      const [movieGenreRes, tvGenreRes] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
          params: { api_key: API_KEY, language: 'pt-BR' },
        }),
        axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
          params: { api_key: API_KEY, language: 'pt-BR' },
        }),
      ]);
      setMovieGenres(movieGenreRes.data.genres || []);
      setTvGenres(tvGenreRes.data.genres || []);
    } catch {
      // silencioso: filtros continuam funcionando sem nomes de gênero
    }
  };

  const fetchDiscover = async ({ mediaType, page, append }: { mediaType: MediaType; page: number; append: boolean }) => {
    const setLoading = mediaType === 'movie' ? setLoadingMovies : setLoadingTv;
    const setData = mediaType === 'movie' ? setMovies : setTvShows;
    const setHasMore = mediaType === 'movie' ? setMovieHasMore : setTvHasMore;

    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        api_key: API_KEY || '',
        language: 'pt-BR',
        page,
        sort_by: sortBy,
        'vote_average.gte': Number(minRating),
      };

      if (selectedGenre !== '') params.with_genres = selectedGenre;
      if (selectedLanguage) params.with_original_language = selectedLanguage;
      if (selectedYear) {
        if (mediaType === 'movie') params.primary_release_year = Number(selectedYear);
        else params.first_air_date_year = Number(selectedYear);
      }

      const response = await axios.get<DiscoverResponse>(`${TMDB_BASE_URL}/discover/${mediaType}`, { params });
      const newResults = response.data.results || [];

      setData((previous) => (append ? [...previous, ...newResults] : newResults));
      setHasMore(page < response.data.total_pages && newResults.length > 0);
    } catch (err) {
      console.error('Erro ao buscar catálogo', err);
      setError('Não foi possível carregar o catálogo agora. Tente novamente.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearch = async () => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    setError(null);
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR',
          query,
          include_adult: false,
          page: 1,
        },
      });

      const normalized: MediaItem[] = (response.data.results || []).filter(
        (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
      );

      setSearchResults(normalized);
    } catch (err) {
      console.error('Erro na busca', err);
      setError('Falha na busca. Verifique sua conexão e tente novamente.');
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    fetchGenres();
  }, []);

  useEffect(() => {
    setMoviePage(1);
    setTvPage(1);
    fetchDiscover({ mediaType: 'movie', page: 1, append: false });
    fetchDiscover({ mediaType: 'tv', page: 1, append: false });
  }, [selectedGenre, selectedYear, selectedLanguage, minRating, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(() => setQuery(searchInput.trim()), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    fetchSearch();
  }, [query]);

  const allGenres = useMemo(() => {
    const map = new Map<number, string>();
    [...movieGenres, ...tvGenres].forEach((genre) => {
      if (!map.has(genre.id)) map.set(genre.id, genre.name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [movieGenres, tvGenres]);

  const filteredSearchResults = searchResults.filter((item: any) => {
    if (searchTypeFilter === 'all') return true;
    return item.media_type === searchTypeFilter;
  });

  const MediaCard = ({ item, type }: { item: MediaItem; type: MediaType }) => {
    const isFavorite = favoriteIds.includes(favoriteKey(item, type));

    return (
      <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
        <Link href={`/${type}/${item.id}`} className="block group" aria-label={`Abrir detalhes de ${item.title || item.name}`}>
          <div className="relative aspect-[2/3] w-full bg-gray-200 dark:bg-gray-700">
            {item.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name || 'Mídia sem título'}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">Sem pôster</div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
        </Link>

        <div className="p-4 flex-grow flex flex-col gap-2">
          <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-white">
            {item.title || item.name || 'Sem título'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[60px]">
            {item.overview || 'Sem descrição disponível.'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'} • {formatDate(item.release_date || item.first_air_date)}
          </p>

          <button
            type="button"
            onClick={() => toggleFavorite(item, type)}
            className={`mt-auto rounded-md px-3 py-2 text-sm font-semibold transition ${
              isFavorite ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-pressed={isFavorite}
          >
            {isFavorite ? '★ Favoritado' : '☆ Favoritar'}
          </button>
        </div>
      </article>
    );
  };

  const SkeletonCard = () => (
    <div className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse h-[420px]" aria-hidden="true" />
  );

  const handleRetry = () => {
    fetchDiscover({ mediaType: 'movie', page: moviePage, append: false });
    fetchDiscover({ mediaType: 'tv', page: tvPage, append: false });
    if (query) fetchSearch();
  };

  return (
    <>
      <Head>
        <title>Cinema Streamm | Filmes e Séries</title>
        <meta
          name="description"
          content="Descubra filmes e séries com busca global, filtros por catálogo, favoritos e páginas de detalhes completas."
        />
      </Head>

      <div className="min-h-screen pb-10">
        <nav className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 shadow-lg mb-8">
          <h1 className="text-3xl font-extrabold text-center tracking-wide">Cinema Streamm</h1>
        </nav>

        <main className="container mx-auto px-4 space-y-8">
          <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <label htmlFor="global-search" className="block text-sm font-semibold mb-2 dark:text-gray-100">
              Busca global (filmes e séries)
            </label>
            <input
              id="global-search"
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Ex.: Duna, The Last of Us, Matrix..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-900"
            />

            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm dark:text-gray-200">Tipo:</span>
              {(['all', 'movie', 'tv'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSearchTypeFilter(option)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    searchTypeFilter === option ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {option === 'all' ? 'Todos' : option === 'movie' ? 'Filmes' : 'Séries'}
                </button>
              ))}
            </div>
          </section>

          {query && (
            <section>
              <h2 className="text-2xl font-bold mb-4 pl-4 border-l-4 border-purple-500 text-gray-800 dark:text-white">
                Resultados da busca
              </h2>

              {loadingSearch ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonCard key={`search-skeleton-${index}`} />
                  ))}
                </div>
              ) : filteredSearchResults.length === 0 ? (
                <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
                  Nenhum resultado encontrado para <strong>{query}</strong>.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredSearchResults.map((item: any) => (
                    <MediaCard key={`search-${item.media_type}-${item.id}`} item={item} type={item.media_type} />
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Filtros e ordenação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <select
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value ? Number(event.target.value) : '')}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900"
                aria-label="Filtrar por gênero"
              >
                <option value="">Todos os gêneros</option>
                {allGenres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1900}
                max={2100}
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900"
                placeholder="Ano (ex.: 2024)"
                aria-label="Filtrar por ano"
              />

              <input
                type="text"
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value.toLowerCase())}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900"
                placeholder="Idioma (ex.: en, pt, ja)"
                aria-label="Filtrar por idioma"
              />

              <select
                value={minRating}
                onChange={(event) => setMinRating(event.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900"
                aria-label="Nota mínima"
              >
                {[0, 5, 6, 7, 8].map((rating) => (
                  <option key={rating} value={rating}>
                    Nota mínima {rating}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortType)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-900"
                aria-label="Ordenar catálogo"
              >
                <option value="popularity.desc">Mais populares</option>
                <option value="vote_average.desc">Melhor avaliados</option>
                <option value="release_date.desc">Lançamento recente</option>
              </select>
            </div>
          </section>

          {error && (
            <section className="p-4 rounded-lg bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200 flex items-center justify-between gap-4">
              <span>{error}</span>
              <button type="button" className="bg-red-700 text-white px-3 py-1 rounded" onClick={handleRetry}>
                Tentar novamente
              </button>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pl-4 border-l-4 border-red-500 text-gray-800 dark:text-white">Filmes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {loadingMovies && movies.length === 0
                ? Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={`movie-skeleton-${index}`} />)
                : movies.map((movie) => <MediaCard key={`movie-${movie.id}`} item={movie} type="movie" />)}
            </div>
            {movieHasMore && !loadingMovies && (
              <button
                type="button"
                onClick={() => {
                  const nextPage = moviePage + 1;
                  setMoviePage(nextPage);
                  fetchDiscover({ mediaType: 'movie', page: nextPage, append: true });
                }}
                className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Carregar mais filmes
              </button>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 pl-4 border-l-4 border-blue-500 text-gray-800 dark:text-white">Séries</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {loadingTv && tvShows.length === 0
                ? Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={`tv-skeleton-${index}`} />)
                : tvShows.map((show) => <MediaCard key={`tv-${show.id}`} item={show} type="tv" />)}
            </div>
            {tvHasMore && !loadingTv && (
              <button
                type="button"
                onClick={() => {
                  const nextPage = tvPage + 1;
                  setTvPage(nextPage);
                  fetchDiscover({ mediaType: 'tv', page: nextPage, append: true });
                }}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              >
                Carregar mais séries
              </button>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
