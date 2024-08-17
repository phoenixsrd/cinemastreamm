import { GetServerSideProps } from 'next';
import axios from 'axios';

type TVShowDetailsProps = {
  tvShow: {
    id: number;
    name: string;
    poster_path: string;
    overview: string;
    first_air_date: string;
  };
};

export default function TVShowDetails({ tvShow }: TVShowDetailsProps) {
  return (
    <div>
      <h1>{tvShow.name}</h1>
      <img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.name} />
      <p>{tvShow.overview}</p>
      <p>Data de Estreia: {tvShow.first_air_date}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const API_KEY = 'cc2577ef867decbe177dea0f28d5f028';
  const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=pt-BR`);

  return {
    props: {
      tvShow: response.data,
    },
  };
};
