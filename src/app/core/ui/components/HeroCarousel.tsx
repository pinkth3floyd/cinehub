'use client';

import MovieItem from '../elements/MovieItem';

const heroMovies = [
  {
    id: '1',
    title: 'The Edge of Tomorrow',
    cover: 'cover12.jpg',
    rating: 8.4,
    categories: ['Action', 'Thriller']
  },
  {
    id: '2',
    title: 'Benched',
    cover: 'cover2.jpg',
    rating: 7.1,
    categories: ['Comedy']
  },
  {
    id: '3',
    title: 'Green Hell',
    cover: 'cover8.jpg',
    rating: 7.9,
    categories: ['Romance', 'Drama']
  },
  {
    id: '4',
    title: 'Survival Spliton',
    cover: 'cover9.jpg',
    rating: 6.8,
    categories: ['Comedy', 'Drama']
  },
  {
    id: '5',
    title: 'The Chebod',
    cover: 'cover13.jpg',
    rating: 9.1,
    categories: ['Drama']
  },
  {
    id: '6',
    title: 'Shadow',
    cover: 'cover5.jpg',
    rating: 6.7,
    categories: ['Drama']
  }
];

export default function HeroCarousel() {
  return (
    <section className="home">
      <div className="container">
        <div className="row">
          {/* home title */}
          <div className="col-12">
            <h1 className="home__title">
              <b>NEW ITEMS</b> OF THIS SEASON
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
                  {heroMovies.map((movie) => (
                    <li key={movie.id} className="splide__slide">
                      <MovieItem
                        id={movie.id}
                        title={movie.title}
                        cover={movie.cover}
                        rating={movie.rating}
                        categories={movie.categories}
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