'use client';

import React from 'react';
import MovieItem from '../elements/MovieItem';

interface HeroSectionProps {
  movies: Array<{
    id: string;
    title: string;
    poster?: string | null;
    banner?: string | null;
    rating: number | null;
    status: string;
    featured: boolean;
    createdAt: Date;
  }>;
}

export default function HeroSection({ movies }: HeroSectionProps) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="home">
      <div className="container">
        <div className="row">
          {/* home title */}
          <div className="col-12">
            <h1 className="home__title">
              <b>FEATURED</b> MOVIES
            </h1>
          </div>
          {/* end home title */}

          {/* home carousel */}
          <div className="col-12">
            <div className="home__carousel splide splide--home">
              <div className="splide__arrows">
                <button className="splide__arrow splide__arrow--prev" type="button">
                  <i className="ti ti-chevron-left"></i>
                </button>
                <button className="splide__arrow splide__arrow--next" type="button">
                  <i className="ti ti-chevron-right"></i>
                </button>
              </div>

              <div className="splide__track">
                <ul className="splide__list">
                  {movies.slice(0, 6).map((movie) => (
                    <li key={movie.id} className="splide__slide">
                      <MovieItem
                        id={movie.id}
                        title={movie.title}
                        cover={movie.poster || movie.banner || 'cover1.jpg'}
                        rating={movie.rating || 0}
                        categories={['Featured']}
                        variant="hero"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* end home carousel */}
        </div>
      </div>
    </section>
  );
} 