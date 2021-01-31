import React from 'react';
import format from 'date-fns/format';
import classNames from 'classnames';
import { Rate } from 'antd';
import { MovieConsumer } from '../../helpers/MovieDB-contest';
import MovieDB from '../../helpers/MovieDB';

import { CardProps, Genres } from '../../types/interfaces';

import './Card.scss';

const Card = ({
  genres,
  description,
  poster,
  release,
  title,
  rating,
  id,
  guestSessionId,
  average,
  syncMovieRating,
}: CardProps) => {
  const movieDB = new MovieDB();

  const cutTex = (text: string, limit: number) => {
    if (text.length < limit) {
      return text;
    }
    const shortcutOverview = text.split(' ').slice(0, limit);
    shortcutOverview.push('...');
    return shortcutOverview.join(' ');
  };

  const giveRate = (rate: number) => movieDB.rateMovie(guestSessionId, rate, id);
  const deleteMovie = () => movieDB.deleteMovie(guestSessionId, id);

  const rateMovie = (rate: number) => {
    if (rate < 0.5) {
      deleteMovie();
    } else {
      giveRate(rate);
    }
    syncMovieRating(id, rate);
  };

  return (
    <MovieConsumer>
      {(genresList: Genres) => (
        <article className="movie">
          <img
            className="movie__poster"
            src={
              poster
                ? `https://image.tmdb.org/t/p/w342${poster}`
                : 'https://geodis.com/nz/sites/default/files/styles/max_800x800/public/2018-06/404.png?itok=3QGHNj64'
            }
            alt="poster"
          />
          <div className="movie-description">
            <header className="movie-description__header">
              <h1 className="movie-description__name">{title}</h1>
              <div
                className={classNames('movie-description__rating', {
                  'movie-description__rating--red': average < 3,
                  'movie-description__rating--orange': average >= 3 && average <= 5,
                  'movie-description__rating--yellow': average >= 5 && average <= 7,
                  'movie-description__rating--green': average >= 7,
                })}
              >
                {average}
              </div>
            </header>
            <p className="movie-description__release">
              {release ? format(new Date(release), 'LLLL d, yyyy') : 'Unknown'}
            </p>
            {genres && (
              <div className="movie-description__genre">
                <ul className="genres-list">
                  {genres.map((genre: number, index: number) => (
                    <li className="genres-item" key={index.toLocaleString()}>
                      <span className="genre-item">{genresList[genre]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="movie-description__text">{cutTex(description, 20)}</p>
            <footer className="movie-description__footer-rating">
              <Rate className="stars" value={rating} count={10} onChange={(rate: number) => rateMovie(rate)} />
            </footer>
          </div>
        </article>
      )}
    </MovieConsumer>
  );
};

export default Card;
