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
      <p>Data de Lançamento: {movie.release_date}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const API_KEY = 'cc2577ef867decbe177dea0f28d5f028';
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);

  return {
    props: {
      movie: response.data,
    },
  };
};