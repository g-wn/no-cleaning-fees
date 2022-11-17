import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';

import { faker } from '@faker-js/faker';
import { HiOutlineKey } from 'react-icons/hi';
import { CiMedal } from 'react-icons/ci';
import { AiOutlineCalendar } from 'react-icons/ai';
import './SpotDetail.css';
import BookingDetails from '../BookingDetails';

export default function SpotDetail() {
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.spotDetail);
  const { spotId } = useParams();
  const hostName = faker.name.firstName();

  const randomNumber = num => {
    return Math.floor(Math.random() * num);
  };

  useEffect(() => {
    dispatch(spotActions.getSpot(spotId));
  }, [spotId, dispatch]);

  return (
    <>
      {spot && (
        <>
          <div className='spot-overview-container'>
            <header className='spot-header'>
              <h1 className='spot-header-h1'>{spot.name}</h1>
              <div className='spot-stats'>
                <i className='fas fa-star' />
                <span> {spot.avgStarRating} - </span>
                <span className='reviews-text'>{spot.numReviews} reviews</span>
                {' - '}
                <span className='location-text'>
                  {' '}
                  {spot.city}, {spot.state}, {spot.country}
                </span>
              </div>
            </header>
            <div className='img-container'>
              <div
                className='preview-img'
                style={{ backgroundImage: `url(${spot.SpotImages.find(image => image.preview === true)?.url})` }}
              ></div>
              <div className='imgs'>
                <div
                  className='img1'
                  style={{ backgroundImage: `url(${spot.SpotImages[1]?.url})` }}
                ></div>
                <div
                  className='img2'
                  style={{ backgroundImage: `url(${spot.SpotImages[2]?.url})` }}
                ></div>
                <div
                  className='img3'
                  style={{ backgroundImage: `url(${spot.SpotImages[3]?.url})` }}
                ></div>
                <div
                  className='img4'
                  style={{ backgroundImage: `url(${spot.SpotImages[4]?.url})` }}
                ></div>
              </div>
            </div>
          </div>

          <div className='details-container'>
            <div className='details-sizing-container'>
              <div className='spot-details-container'>
                <header className='spot-details-header'>
                  <div>
                    <h2 className='main-text bold'>Entire home hosted by {hostName}</h2>
                    <p className='spot-info'>
                      {randomNumber(15)} guests - {randomNumber(10)} bedrooms - {randomNumber(10)} beds -{' '}
                      {randomNumber(8)} baths
                    </p>
                  </div>
                  <div className='host-avatar-img-container'>
                    <img
                      src={faker.image.avatar()}
                      alt=''
                      className='host-avatar-img'
                    />
                  </div>
                </header>

                <div className='host-checkin-cancel'>
                  <div className='host-info'>
                    <div className='host-icon'>
                      <CiMedal size={30} />
                    </div>
                    <div>
                      <span className='host bold'>{hostName} is a superhost</span>
                      <p className='host-disclaimer'>
                        Superhosts would probably be experienced, if they were hosting on a site where you could
                        actually rent a place.
                      </p>
                    </div>
                  </div>
                  <div className='check-in-info'>
                    <div className='check-in-icon'>
                      <HiOutlineKey size={30} />
                    </div>
                    <div>
                      <span className='check-in bold'> Great check-in experience</span>
                      <p className='check-in-disclaimer'>
                        {randomNumber(100)}% of guests gave the check-in process a {randomNumber(5)}-star rating.
                      </p>
                    </div>
                  </div>
                  <div className='cancel-info'>
                    <div className='cancel-icon'>
                      <AiOutlineCalendar size={30} />
                    </div>
                    <div>
                      <span className='cancel bold'>Free cancellation for {randomNumber(72)} hours</span>
                      <p className='cancel-disclaimer'>
                        If you could actually book this place, you would have that many hours to cancel.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='fake-coverage-container'>
                  <div className='coverage-title'>
                    <span>clean</span>
                    <span className='coverage-red'>fee</span>
                    <span>cover</span>
                  </div>
                  <p className="coverage-text">We don't provide coverage for anything because if you actually manage to book through this website somehow, you've already won...</p>
                </div>
                <div className="reviews-container">
                  REVIEWS COMPONENT PLACEHOLDER
                </div>
              </div>
              <div className='booking-details-container'>
                <div className="booking-details-component">
                  <BookingDetails spot={spot} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
