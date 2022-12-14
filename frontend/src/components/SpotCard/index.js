import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { currentUserSpotsModal } from '../../store/modal';
import * as spotActions from '../../store/spots';

import TimeAgo from 'react-timeago';

import './SpotCard.css';

export default function SpotCard({ spot }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const added = spot.createdAt;

  useEffect(() => {
    dispatch(spotActions.getSpots());
  }, [dispatch, spot.id, spot.avgRating]);

  const handleRedirect = async e => {
    e.preventDefault();

    await dispatch(currentUserSpotsModal(false));
    await dispatch(spotActions.getSpot(spot.id));
    history.push(`/spots/${spot.id}`);
  };

  return (
    <div className='spot-card-container'>
      {spot && (
        <div
          onClick={handleRedirect}
          className='spot-card'
        >
          <div
            className='spot-card-img'
            style={{ backgroundImage: `url('${spot.previewImage}')` }}
          ></div>

          <div className='spot-text-container'>
            <div className='top-row'>
              <span className='city-state bold'>
                {spot.city}, {spot.state}
              </span>
              <span className='rating-icon'>
                <i className='fas fa-star' />
                <span> {spot.avgRating ? spot.avgRating : 'New'}</span>
              </span>
            </div>
            <div className='bottom-row'>
              <div className='time-ago'>
                Added <TimeAgo date={added} />
              </div>
              <div className="dates">Mar 23 - Apr 1</div>
              <span className='bold'>$</span>
              <span className='bold'>{spot.price}</span>
              <span> night</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
