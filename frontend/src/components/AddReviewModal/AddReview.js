import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReviewModal, editReviewModal } from '../../store/modal';

import * as reviewActions from '../../store/reviews';
import * as modalActions from '../../store/modal';
import * as spotActions from '../../store/spots';

import { IoCloseSharp } from 'react-icons/io5';

export default function AddReviewForm({ spot, formType, prevReview }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState(prevReview ? prevReview.review : '');
  const [stars, setStars] = useState(prevReview ? prevReview.stars : 0);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors([]);

    const newReview = {
      review,
      stars
    };

    return await dispatch(reviewActions.postReview(spot.id, newReview))
      .then(async res => {
        if (res.ok) {
          dispatch(modalActions.addReviewModal(false));
          dispatch(spotActions.getSpot(spot.id));
        }
      })
      .catch(async res => {
        const data = await res.json();
        if (data && data.message) setErrors([data.message]);
      });
  };

  const handleEdit = async e => {
    e.preventDefault();
    setErrors([]);

    const editedReview = {
      review,
      stars
    };

    return await dispatch(reviewActions.putReview(prevReview.id, editedReview))
      .then(async res => {
        if (res.ok) {
          dispatch(modalActions.editReviewModal(false));
          dispatch(spotActions.getSpot(spot.id));
        }
      })
      .catch(async res => {
        const data = await res.json();
        if (data && data.message) setErrors([data.message]);
      });
  };

  return (
    <div className='add-review-form-container'>
      <header className='add-review-form-header'>
        <button
          className='close-form-btn'
          onClick={() => dispatch(formType === 'create' ? addReviewModal(false) : editReviewModal(false))}
        >
          <IoCloseSharp size={20} />
        </button>
        <div className='header-text bold'>
          {formType === 'create' ? "Let 'em know what you think" : 'No worries... change your mind'}
        </div>
        <div className='hidden'></div>
      </header>

      <form
        className='add-review-form'
        onSubmit={formType === 'create' ? handleSubmit : handleEdit}
      >
        {errors.length > 0 ? (
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        ) : (
          <h2 className='add-review-form-h2'>
            {formType === 'create'
              ? "I'm sure they really want to know.."
              : "I'm sure they love when you switch it up..."}
            .
          </h2>
        )}

        <div className='inputs-container'>
          <textarea
            className='review-content-in-form'
            onChange={e => setReview(e.target.value)}
            placeholder='Leave a long and detailed review'
            required
            value={review}
          />
          <select
            className='review-stars'
            onChange={e => setStars(e.target.value)}
            required
            value={stars}
          >
            <option value=''>Pick a number 1 to 5, it will get translated to stars...</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <p className='reviews-disclaimer'>
            While we here at <span className='red-text'>nocleaningfees</span> understand that everyone thinks their
            opinion is extremely important, we can guarantee you that leaving a review here will have absolutely no
            effect on the Universe whatsoever.
          </p>
        </div>

        <button
          className='review-submit-btn'
          type={'submit'}
        >
          Overshare
        </button>
      </form>
    </div>
  );
}
