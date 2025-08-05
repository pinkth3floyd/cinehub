'use client';

import MovieItem from '../elements/MovieItem';

const movieData = [
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
  },
  {
    id: '13',
    title: 'I Dream in Another Language',
    cover: 'cover13.jpg',
    rating: 8.0,
    categories: ['Action', 'Thriller']
  },
  {
    id: '14',
    title: 'Benched',
    cover: 'cover14.jpg',
    rating: 7.2,
    categories: ['Comedy']
  },
  {
    id: '15',
    title: 'Whitney',
    cover: 'cover15.jpg',
    rating: 5.9,
    categories: ['Romance', 'Drama', 'Music']
  },
  {
    id: '16',
    title: 'Blindspotting',
    cover: 'cover16.jpg',
    rating: 8.3,
    categories: ['Comedy', 'Drama']
  },
  {
    id: '17',
    title: 'I Dream in Another Language',
    cover: 'cover17.jpg',
    rating: 8.0,
    categories: ['Action', 'Thriller']
  },
  {
    id: '18',
    title: 'Benched',
    cover: 'cover18.jpg',
    rating: 7.1,
    categories: ['Comedy']
  }
];

export default function ContentTabs() {
  return (
    <section className="content">
      <div className="content__head">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* content title */}
              <h2 className="content__title">Recently updated</h2>
              {/* end content title */}

              {/* content tabs nav */}
              <ul className="nav nav-tabs content__tabs" id="content__tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button id="1-tab" className="active" data-bs-toggle="tab" data-bs-target="#tab-1" type="button" role="tab" aria-controls="tab-1" aria-selected="true">
                    New items
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button id="2-tab" data-bs-toggle="tab" data-bs-target="#tab-2" type="button" role="tab" aria-controls="tab-2" aria-selected="false">
                    Movies
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button id="3-tab" data-bs-toggle="tab" data-bs-target="#tab-3" type="button" role="tab" aria-controls="tab-3" aria-selected="false">
                    TV Shows
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button id="4-tab" data-bs-toggle="tab" data-bs-target="#tab-4" type="button" role="tab" aria-controls="tab-4" aria-selected="false">
                    Anime
                  </button>
                </li>
              </ul>
              {/* end content tabs nav */}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* content tabs */}
        <div className="tab-content">
          <div className="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="1-tab" tabIndex={0}>
            <div className="row">
              {movieData.map((movie) => (
                <div key={movie.id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
                  <MovieItem
                    id={movie.id}
                    title={movie.title}
                    cover={movie.cover}
                    rating={movie.rating}
                    categories={movie.categories}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="tab-pane fade" id="tab-2" role="tabpanel" aria-labelledby="2-tab" tabIndex={0}>
            <div className="row">
              {movieData.slice(0, 12).map((movie) => (
                <div key={movie.id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
                  <MovieItem
                    id={movie.id}
                    title={movie.title}
                    cover={movie.cover}
                    rating={movie.rating}
                    categories={movie.categories}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="tab-pane fade" id="tab-3" role="tabpanel" aria-labelledby="3-tab" tabIndex={0}>
            <div className="row">
              {movieData.slice(0, 12).map((movie) => (
                <div key={movie.id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
                  <MovieItem
                    id={movie.id}
                    title={movie.title}
                    cover={movie.cover}
                    rating={movie.rating}
                    categories={movie.categories}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="tab-pane fade" id="tab-4" role="tabpanel" aria-labelledby="4-tab" tabIndex={0}>
            <div className="row">
              {movieData.slice(0, 12).map((movie) => (
                <div key={movie.id} className="col-6 col-sm-4 col-lg-3 col-xl-2">
                  <MovieItem
                    id={movie.id}
                    title={movie.title}
                    cover={movie.cover}
                    rating={movie.rating}
                    categories={movie.categories}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* end content tabs */}

        <div className="row">
          {/* more */}
          <div className="col-12">
            <a className="section__more" href="/catalog">View all</a>
          </div>
          {/* end more */}
        </div>
      </div>
    </section>
  );
} 