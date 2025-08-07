'use client';

import React, { useState } from 'react';
import { createReview } from '../../../core/entities/reviews/actions';

interface Review {
  id: string;
  content: string;
  rating: number;
  status: string;
  movieId: string;
  userId: string;
  createdAt: Date;
}

interface MovieReviewsProps {
  movieId: string;
  reviews: Review[];
}

export default function MovieReviews({ movieId, reviews }: MovieReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    content: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createReview({
        content: reviewForm.content,
        rating: reviewForm.rating,
        movieId: movieId,
        userId: 'user-123' // TODO: Get actual user ID from auth
      });

      if (result.success) {
        setReviewForm({ content: '', rating: 5 });
        setShowReviewForm(false);
        // TODO: Refresh reviews list
        window.location.reload();
      } else {
        alert('Failed to submit review: ' + result.error);
      }
    } catch (error) {
      alert('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`ti ${i < rating ? 'ti-star-filled' : 'ti-star'}`}
        style={{ color: i < rating ? '#f9ab00' : '#666' }}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const approvedReviews = reviews.filter(review => review.status === 'approved');

  return (
    <div className="movie-reviews">
      <div className="movie-reviews__header">
        <h3 className="movie-reviews__title">
          <i className="ti ti-message-circle"></i>
          Reviews & Comments
        </h3>
        <button
          className="btn btn--primary"
          onClick={() => setShowReviewForm(!showReviewForm)}
          type="button"
        >
          <i className="ti ti-plus"></i>
          Write Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="review-form">
          <form onSubmit={handleSubmitReview}>
            <div className="review-form__rating">
              <label className="review-form__label">Rating:</label>
              <div className="review-form__stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="review-form__star"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: i + 1 }))}
                  >
                    <i
                      className={`ti ${i < reviewForm.rating ? 'ti-star-filled' : 'ti-star'}`}
                      style={{ color: i < reviewForm.rating ? '#f9ab00' : '#666' }}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="review-form__content">
              <label className="review-form__label">Review:</label>
              <textarea
                className="review-form__textarea"
                value={reviewForm.content}
                onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your review here..."
                rows={4}
                required
                minLength={10}
              />
            </div>
            
            <div className="review-form__actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSubmitting || reviewForm.content.length < 10}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {approvedReviews.length === 0 ? (
          <div className="reviews-empty">
            <i className="ti ti-message-off"></i>
            <p>No reviews yet. Be the first to review this movie!</p>
          </div>
        ) : (
          approvedReviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-item__header">
                <div className="review-item__rating">
                  {getRatingStars(review.rating)}
                  <span className="review-item__rating-text">
                    {review.rating}/5
                  </span>
                </div>
                <div className="review-item__date">
                  {formatDate(review.createdAt)}
                </div>
              </div>
              
              <div className="review-item__content">
                <p>{review.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {approvedReviews.length > 0 && (
        <div className="reviews-summary">
          <div className="reviews-summary__stats">
            <span className="reviews-summary__count">
              {approvedReviews.length} review{approvedReviews.length !== 1 ? 's' : ''}
            </span>
            <span className="reviews-summary__average">
              Average: {(approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length).toFixed(1)}/5
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 