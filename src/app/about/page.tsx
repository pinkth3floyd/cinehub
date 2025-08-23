'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer, Carousel } from '../core/ui';

// Feature data
const features = [
  {
    icon: 'ti ti-badge-hd',
    title: 'Ultra HD',
    text: 'Experience movies like never before with our Ultra HD feature. Immerse yourself in stunning visuals, vibrant colors, and crystal-clear detail.'
  },
  {
    icon: 'ti ti-movie',
    title: 'Large movie database',
    text: 'Discover a vast and diverse collection of movies in our extensive database. With thousands of titles to choose from, you\'ll never run out of options.'
  },
  {
    icon: 'ti ti-device-tv',
    title: 'Online TV',
    text: 'Expand your entertainment horizons with our Online TV. Stream live TV channels, catch up on your favorite shows, and enjoy a wide range of television content online.'
  },
  {
    icon: 'ti ti-ticket',
    title: 'Early access to new items',
    text: 'Be the first to experience the latest movies and exclusive content with our Early Access feature. Get a sneak peek into upcoming releases, gain access to special screenings, and stay ahead of the curve.'
  },
  {
    icon: 'ti ti-cast',
    title: 'Airplay',
    text: 'Seamlessly stream movies from your device to the big screen with Airplay integration. Experience the cinematic magic in the comfort of your living room and share the excitement with friends and family.'
  },
  {
    icon: 'ti ti-language',
    title: 'Multi language subtitles',
    text: 'Break language barriers and enjoy movies from around the world with our multi-language subtitles. Explore different cultures, expand your cinematic horizons, and appreciate the beauty of global cinema.'
  }
];

// How it works data
const howItWorks = [
  {
    number: '01',
    title: 'Create an account',
    text: 'Start your movie-watching journey by creating a personalized account on our platform. Sign up easily and gain access to a world of entertainment.'
  },
  {
    number: '02',
    title: 'Choose your plan',
    text: 'Select the perfect plan that suits your preferences and watching habits. We offer a range of subs options from basic plans to premium plans.'
  },
  {
    number: '03',
    title: 'Enjoy CineHub',
    text: 'Immerse yourself in the world of CineHub, where unlimited movie streaming awaits. With our vast collection of movies there\'s something for everyone.'
  }
];

// Roadmap data
const roadmap = [
  {
    title: '2023 Q4',
    items: [
      'Conduct market research on movies and TV series, study the needs and preferences of the target audience.',
      'Determine the main goals and objectives of the site: providing content, functionality and design.'
    ],
    active: true
  },
  {
    title: '2024 Q1',
    items: [
      'Create an information architecture for the site, defining the main sections and content categories.',
      'Development of an attractive and intuitive site design, providing easy navigation and high user interactivity.'
    ],
    active: true
  },
  {
    title: '2024 Q2',
    items: [
      'Creating a database for movies and TV series including information on title, genre, actors, ratings and reviews.',
      'Development of a powerful search engine which will allow users to easily find films and TV series.'
    ],
    active: false
  },
  {
    title: '2024 Q3',
    items: [
      'Developing a user registration and authorization system to create personal accounts.',
      'Implementation of the ability to save films or series in the "Favorites" list, leave reviews and ratings.'
    ],
    active: false
  },
  {
    title: '2024 Q4',
    items: [
      'Protection of user data, applying appropriate security protocols.',
      'Testing the site on different devices and browsers, fixing bugs and improving performance.'
    ],
    active: false
  }
];

// Partners data
const partners = [
  'themeforest-light-background.png',
  'audiojungle-light-background.png',
  'codecanyon-light-background.png',
  'photodune-light-background.png',
  'activeden-light-background.png',
  '3docean-light-background.png'
];

export default function AboutPage() {
  return (
    <>
      <Header />
      
      {/* Page Title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">About Us</h1>
                
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">About Us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title"><b>CineHub</b> – Best Place for Movies</h2>
              <p className="section__text">
                Welcome to <b>CineHub</b> movie site, the ultimate destination for all film enthusiasts. 
                Immerse yourself in a world of captivating stories, stunning visuals, and unforgettable performances. 
                Explore our extensive library of movies, spanning across genres, eras, and cultures.
              </p>
              <p className="section__text">
                Indulge in the joy of cinema with our curated collections, featuring handpicked movies grouped by themes, 
                directors, or actors. Dive into the world of cinematic magic and let yourself be transported to new realms 
                of imagination and emotion.
              </p>
            </div>

            {/* Features */}
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="feature">
                  <i className={feature.icon}></i>
                  <h3 className="feature__title">{feature.title}</h3>
                  <p className="feature__text">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section--border">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title">How it works?</h2>
            </div>

            {howItWorks.map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="how">
                  <span className="how__number">{item.number}</span>
                  <h3 className="how__title">{item.title}</h3>
                  <p className="how__text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section section--border">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title">Roadmap</h2>
            </div>

            <div className="col-12">
              <Carousel variant="roadmap" showArrows={true}>
                {roadmap.map((item, index) => (
                  <div key={index} className={`roadmap ${item.active ? 'roadmap--active' : ''}`}>
                    <h3 className="roadmap__title">{item.title}</h3>
                    <ul className="roadmap__list">
                      {item.items.map((listItem, itemIndex) => (
                        <li key={itemIndex}>{listItem}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section>

    
      <Footer />
    </>
  );
}