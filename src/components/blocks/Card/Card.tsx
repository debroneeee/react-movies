import React from 'react';
import format from 'date-fns/format';
import classNames from 'classnames';
import { Rate } from 'antd';
import { MovieConsumer } from '../../helpers/MovieDB-contest';
import MovieDB from '../../helpers/getData';

import { CardListProps, Genres } from '../../types/interfaces';

import './Card.scss';

const Card = ({ genres, description, poster, release, title, rating, id, guestSessionId, average }: CardListProps) => {
  const movieDB = new MovieDB();

  const cutTex = (text: string, limit: number) => {
    if (text.length < limit) {
      return text;
    }
    let res = text.slice(0, limit).split(' ').slice(0, -1).join(' ').replace(/,*$/, '');
    res += '...';
    return res;
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
                  'movie-description__rating--red': average <= 3,
                  'movie-description__rating--orange': average > 3 && average < 5,
                  'movie-description__rating--yellow': average > 5 && average < 7,
                  'movie-description__rating--green': average > 7,
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
            <p className="movie-description__text">{cutTex(description, 150)}</p>
            <footer className="movie-description__footer-rating">
              <Rate
                className="stars"
                defaultValue={rating}
                count={10}
                onChange={(rate) => movieDB.rateMovie(guestSessionId, rate, id)}
              />
            </footer>
          </div>
        </article>
      )}
    </MovieConsumer>
  );
};

export default Card;
