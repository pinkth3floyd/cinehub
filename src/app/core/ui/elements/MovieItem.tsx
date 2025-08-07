'use client';

import Link from 'next/link';
import SafeImage from './SafeImage';

export interface MovieItemProps {
  id: string;
  title: string;
  cover: string;
  rating: number;
  categories: string[];
  variant?: 'hero' | 'carousel' | 'default';
}

export default function MovieItem({ id, title, cover, rating, categories, variant = 'default' }: MovieItemProps) {
  const getRatingClass = (rating: number) => {
    if (rating >= 8.0) return 'item__rate--green';
    if (rating >= 6.0) return 'item__rate--yellow';
    return 'item__rate--red';
  };

  const itemClass = variant === 'hero' ? 'item item--hero' : 
                   variant === 'carousel' ? 'item item--carousel' : 
                   'item';

  return (
    <div className={itemClass}>
      <div className="item__cover">
        <SafeImage 
          src={cover}
          alt={title}
          width={300}
          height={450}
          className="item__cover-img"
        />
        <Link href={`/details/${id}`} className="item__play">
          <i className="ti ti-player-play-filled"></i>
        </Link>
        <span className={`item__rate ${getRatingClass(rating)}`}>{rating}</span>
        <button className="item__favorite" type="button">
          <i className="ti ti-bookmark"></i>
        </button>
      </div>
      <div className="item__content">
        <h3 className="item__title">
          <Link href={`/details/${id}`}>{title}</Link>
        </h3>
        <span className="item__category">
          {categories.map((category, index) => (
            <Link key={index} href={`/catalog?category=${category.toLowerCase()}`}>
              {category}
            </Link>
          ))}
        </span>
      </div>
    </div>
  );
} 