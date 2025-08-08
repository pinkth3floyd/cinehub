'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

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

interface HeroSectionProps {
  movies: Movie[];
}

export default function HeroSection({ movies }: HeroSectionProps) {
  // Convert featured movies to hero slides
  const heroSlides = movies.slice(0, 5).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    rating: movie.rating || 0,
    ratingClass: getRatingClass(movie.rating || 0),
    description: getMovieDescription(movie.title), // Generate description based on title
    categories: movie.genres || ['Action', 'Drama'],
    background: movie.banner || movie.poster || `/core/assets/img/bg/slide__bg-${(index % 3) + 1}.jpg`
  }));

  // Fallback slides if no movies are available
  const fallbackSlides = [
    {
      id: 'fallback-1',
      title: "Savage Beauty",
      rating: 9.8,
      ratingClass: "green",
      description: "A brilliant scientist discovers a way to harness the power of the ocean's currents to create a new, renewable energy source. But when her groundbreaking technology falls into the wrong hands, she must race against time to stop it from being used for evil.",
      categories: ["Action", "Drama", "Comedy"],
      background: "/core/assets/img/bg/slide__bg-1.jpg"
    },
    {
      id: 'fallback-2',
      title: "From the Other Side",
      rating: 6.9,
      ratingClass: "yellow",
      description: "In a world where magic is outlawed and hunted, a young witch must use her powers to fight back against the corrupt authorities who seek to destroy her kind.",
      categories: ["Adventure", "Thriller"],
      background: "/core/assets/img/bg/slide__bg-2.jpg"
    },
    {
      id: 'fallback-3',
      title: "Endless Horizon",
      rating: 6.2,
      ratingClass: "red",
      description: "When a renowned archaeologist goes missing, his daughter sets out on a perilous journey to the heart of the Amazon rainforest to find him. Along the way, she discovers a hidden city and a dangerous conspiracy that threatens the very balance of power in the world.",
      categories: ["Action", "Drama", "Thriller"],
      background: "/core/assets/img/bg/slide__bg-3.jpg"
    }
  ];

  // Use actual movies if available, otherwise use fallback
  const slidesToShow = heroSlides.length > 0 ? heroSlides : fallbackSlides;

  function getRatingClass(rating: number): string {
    if (rating >= 8.0) return 'green';
    if (rating >= 7.0) return 'yellow';
    return 'red';
  }

  function getMovieDescription(title: string): string {
    // Generate a description based on the movie title
    const descriptions = [
      "An epic journey that will take you to the edge of your seat with stunning visuals and heart-pounding action.",
      "A compelling story that explores the depths of human emotion and the complexities of relationships.",
      "A thrilling adventure that combines mystery, suspense, and unforgettable characters.",
      "A masterpiece of storytelling that will keep you guessing until the very end.",
      "An extraordinary tale of courage, love, and the power of the human spirit."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  useEffect(() => {
    // Initialize Splide carousel
    if (typeof window !== 'undefined' && window.Splide) {
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
    }
  }, [slidesToShow]);

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
                          <sub className={slide.ratingClass}>{slide.rating.toFixed(1)}</sub>
                        </h2>
                        <p className="hero__text">{slide.description}</p>
                        <p className="hero__category">
                          {slide.categories.map((category, catIndex) => (
                            <Link key={catIndex} href={`/catalog?genre=${category.toLowerCase()}`}>
                              {category}
                            </Link>
                          ))}
                        </p>
                        <div className="hero__actions">
                          <Link href={`/details/${slide.id}`} className="hero__btn">
                            <span>Watch now</span>
                          </Link>
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