'use client';

import Link from 'next/link';
import MovieItem from '../elements/MovieItem';

const premiereMovies = [
  {
    id: '1',
    title: 'I Dream in Another Language',
    cover: 'cover.jpg',
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
    title: 'Whitney',
    cover: 'cover3.jpg',
    rating: 6.3,
    categories: ['Romance', 'Drama', 'Music']
  },
  {
    id: '4',
    title: 'Blindspotting',
    cover: 'cover4.jpg',
    rating: 6.9,
    categories: ['Comedy', 'Drama']
  },
  {
    id: '5',
    title: 'I Dream in Another Language',
    cover: 'cover5.jpg',
    rating: 8.4,
    categories: ['Action', 'Thriller']
  },
  {
    id: '6',
    title: 'Benched',
    cover: 'cover6.jpg',
    rating: 7.1,
    categories: ['Comedy']
  },
  {
    id: '7',
    title: 'Benched',
    cover: 'cover7.jpg',
    rating: 7.1,
    categories: ['Comedy']
  },
  {
    id: '8',
    title: 'I Dream in Another Language',
    cover: 'cover8.jpg',
    rating: 5.5,
    categories: ['Action', 'Thriller']
  },
  {
    id: '9',
    title: 'Blindspotting',
    cover: 'cover9.jpg',
    rating: 6.7,
    categories: ['Comedy', 'Drama']
  },
  {
    id: '10',
    title: 'Whitney',
    cover: 'cover10.jpg',
    rating: 5.6,
    categories: ['Romance', 'Drama', 'Music']
  },
  {
    id: '11',
    title: 'Benched',
    cover: 'cover11.jpg',
    rating: 9.2,
    categories: ['Comedy']
  },
  {
    id: '12',
    title: 'I Dream in Another Language',
    cover: 'cover12.jpg',
    rating: 8.4,
    categories: ['Action', 'Thriller']
  }
];

export default function PremiereSection() {
  return (
    <section className="section section--border">
      <div className="container">
        <div className="row">
          {/* section title */}
          <div className="col-12">
            <div className="section__title-wrap">
              <h2 className="section__title">Expected premiere</h2>
              <Link href="/catalog" className="section__view section__view--carousel">View All</Link>
            </div>
          </div>
          {/* end section title */}

          {/* carousel */}
          <div className="col-12">
            <div className="section__carousel splide splide--content">
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
                  {premiereMovies.map((movie) => (
                    <li key={movie.id} className="splide__slide">
                      <MovieItem
                        id={movie.id}
                        title={movie.title}
                        cover={movie.cover}
                        rating={movie.rating}
                        categories={movie.categories}
                        variant="carousel"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* end carousel */}
        </div>
      </div>
    </section>
  );
} 