import { GetServerSideProps } from 'next';
import axios from 'axios';

type MovieDetailsProps = {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
  };
};

export default function MovieDetails({ movie }: MovieDetailsProps) {
  return (
    <div>
      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
      <p>Data De Lançamento: {movie.release_date}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const movieId = Array.isArray(id) ? id[0] : id;

  if (!movieId || typeof movieId !== 'string' || !/^\d+$/.test(movieId)) {
    return {
      notFound: true,
    };
  }

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=pt-BR`
  );

  return {
    props: {
      movie: response.data,
    },
  };
};
