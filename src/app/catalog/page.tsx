'use client';

import { Header, Footer, MovieGrid, Section, SearchBar } from '../core/ui';

const catalogMovies = [
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

export default function CatalogPage() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Handle search functionality
  };

  const handleLoadMore = () => {
    console.log('Loading more movies...');
    // Handle load more functionality
  };

  return (
    <>
      <Header />
      
      <Section title="Movie Catalog" variant="border">
        <div className="catalog__filters">
          <div className="row">
            <div className="col-12">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search movies..."
                className="catalog__search"
              />
            </div>
          </div>
        </div>

        <MovieGrid
          movies={catalogMovies}
          columns={6}
          variant="default"
          showLoadMore={true}
          onLoadMore={handleLoadMore}
          hasMore={true}
        />
      </Section>

      <Footer />
    </>
  );
} 