'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedMovies } from '../../entities/movies/actions';

interface Movie {
  id: string;
  title: string;
  poster?: string | null;
  banner?: string | null;
  rating: number | null;
  status: string;
  featured: boolean;
  createdAt: Date;
  genres?: string[];
}

interface HeroSlide {
  id: string;
  title: string;
  rating: number;
  ratingClass: string;
  description: string;
  categories: string[];
  background: string;
}

export default function HeroSection() {
  const [slidesToShow, setSlidesToShow] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch featured movies using TanStack Query
  const { data: featuredMovies, isLoading: isFetching, error } = useQuery({
    queryKey: ['featured-movies'],
    queryFn: async () => {
      const result = await getFeaturedMovies(5); // Get top 5 featured movies
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error(result.error || 'Failed to fetch featured movies');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Process movies into hero slides
  useEffect(() => {
    if (featuredMovies && featuredMovies.length > 0) {
      const heroSlides = featuredMovies.map((movie, index) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.rating || 0,
        ratingClass: getRatingClass(movie.rating || 0),
        description: movie.description || generateMovieDescription(movie.title),
        categories: ['Movie'], // We'll enhance this later with genre fetching
        background: movie.banner || movie.poster || `/core/assets/img/bg/slide__bg-${(index % 3) + 1}.jpg`
      }));
      
      setSlidesToShow(heroSlides);
    } else if (!isFetching) {
      // If no featured movies, show minimal fallback
      setSlidesToShow([{
        id: 'no-movies',
        title: "Welcome to CineHub",
        rating: 0,
        ratingClass: "green",
        description: "Discover amazing movies and TV shows. Browse our collection to find your next favorite entertainment.",
        categories: ["Movies", "TV Shows"],
        background: "/core/assets/img/bg/slide__bg-1.jpg"
      }]);
    }
    setIsLoading(false);
  }, [featuredMovies, isFetching]);

  function getRatingClass(rating: number): string {
    if (rating >= 8.0) return 'green';
    if (rating >= 7.0) return 'yellow';
    return 'red';
  }

  function generateMovieDescription(title: string): string {
    const descriptions = [
      "An epic journey that will take you to the edge of your seat with stunning visuals and heart-pounding action.",
      "A compelling story that explores the depths of human emotion and the complexities of relationships.",
      "A thrilling adventure that combines mystery, suspense, and unforgettable characters.",
      "A masterpiece of storytelling that will keep you guessing until the very end.",
      "An extraordinary tale of courage, love, and the power of the human spirit."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  // Initialize Splide carousel
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Splide && slidesToShow.length > 0) {
      // Destroy existing instance if any
      const existingSplide = document.querySelector('#splide01') as any;
      if (existingSplide && existingSplide.splide) {
        existingSplide.splide.destroy();
      }

      // Initialize new instance
      const splide = new window.Splide('#splide01', {
        type: 'loop',
        perPage: 1,
        drag: true,
        pagination: true,
        arrows: true,
        autoplay: true,
        interval: 5000,
        pauseOnHover: true,
        speed: 800,
        gap: 0,
        rewind: true,
        rewindSpeed: 1000,
        height: '600px',
        cover: true,
        focus: 'center'
      });
      
      splide.mount();

      // Cleanup function
      return () => {
        if (splide) {
          splide.destroy();
        }
      };
    }
  }, [slidesToShow]);

  // Loading state
  if (isLoading || isFetching) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="hero-loading">
              <div className="hero-loading__content">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading featured movies...</span>
                </div>
                <p className="mt-3">Loading featured movies...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="hero-error">
              <div className="hero-error__content">
                <i className="ti ti-alert-triangle"></i>
                <h3>Unable to Load Featured Movies</h3>
                <p>Please try refreshing the page or check your connection.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        {/* Hero Carousel */}
        <div className="col-12">
          <div className="hero splide splide--hero splide--loop splide--ltr splide--draggable" id="splide01">
            <div className="splide__arrows">
              <button className="splide__arrow splide__arrow--prev" type="button" aria-controls="splide01-track" aria-label="Go to last slide">
                <i className="ti ti-chevron-left"></i>
              </button>
              <button className="splide__arrow splide__arrow--next" type="button" aria-controls="splide01-track" aria-label="Next slide">
                <i className="ti ti-chevron-right"></i>
              </button>
            </div>
            
            <div className="splide__track" id="splide01-track">
              <ul className="splide__list" id="splide01-list">
                {slidesToShow.map((slide, index) => (
                  <li key={slide.id} className="splide__slide" id={`splide01-slide0${index + 1}`}>
                    <div 
                      className="hero__slide" 
                      data-bg={slide.background}
                      style={{
                        background: `url("${slide.background}") center center / cover no-repeat`
                      }}
                    >
                      <div className="hero__content">
                        <h2 className="hero__title">
                          {slide.title} 
                          {slide.rating > 0 && (
                            <sub className={slide.ratingClass}>{slide.rating.toFixed(1)}</sub>
                          )}
                        </h2>
                        <p className="hero__text">{slide.description}</p>
                        <p className="hero__category">
                          {/* {slide.categories.map((category, catIndex) => (
                            <Link key={catIndex} href={`/catalog?genre=${category.toLowerCase()}`}>
                              {category}
                            </Link>
                          ))} */}
                          {
                            
                          }
                        </p>
                        <div className="hero__actions">
                          {slide.id !== 'no-movies' ? (
                            <div>
                              <Link href={`/details/${slide.id}`} className="hero__btn">
                                <span>Watch now</span>
                              </Link>
                              <Link href="/catalog" className="hero__btn">
                              <span>Browse Movies</span>
                            </Link>
                            </div>
                          ) : (
                            <Link href="/catalog" className="hero__btn">
                              <span>Browse Movies</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <ul className="splide__pagination">
              {slidesToShow.map((_, index) => (
                <li key={index}>
                  <button 
                    className="splide__pagination__page" 
                    type="button" 
                    aria-controls={`splide01-slide0${index + 1}`} 
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* End Hero Carousel */}
      </div>
    </div>
  );
} 