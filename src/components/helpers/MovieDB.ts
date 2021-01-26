import { ICard, ImovieDBResponsWithGenres } from '../types/interfaces';

export default class MovieDB {
  API_BASE_URL = 'https://api.themoviedb.org/3/';

  API_KEY = 'e1ebf9616662e10fc1d28082f9a4a46f';

  async getResources(url: string) {
    const res = await fetch(`${this.API_BASE_URL}${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return res.json();
  }

  getPage(pageNumber?: number, query?: string, sessionId?: string) {
    const url = sessionId
      ? `guest_session/${sessionId}/rated/movies?api_key=${this.API_KEY}&language=en-US`
      : `search/movie?api_key=${this.API_KEY}&language=en-US&query=${query}&page=${pageNumber}&include_adult=false`;
    return this.getResources(url).then((res) => {
      const cards = res.results.reduce((acc: ICard[], el: ImovieDBResponsWithGenres) => {
        const card: ICard = {
          genres: el.genre_ids,
          id: el.id,
          description: el.overview,
          poster: el.poster_path,
          release: el.release_date,
          title: el.title,
          rating: el.rating,
          average: el.vote_average,
        };
        acc.push(card);
        return acc;
      }, []);
      const totalCards = res.total_results;

      return { cards, totalCards };
    });
  }

  getGenres() {
    return this.getResources(`genre/movie/list?api_key=${this.API_KEY}&language=en-US`);
  }

  getGuestId() {
    return this.getResources(`authentication/guest_session/new?api_key=${this.API_KEY}`);
  }

  async rateMovie(sessionId: string, rate: number, movieId: number) {
    const res = await fetch(
      `${this.API_BASE_URL}movie/${movieId}/rating?api_key=${this.API_KEY}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          value: rate,
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`);
    }
    return res.json();
  }
}
