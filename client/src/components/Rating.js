import React from 'react';
import PropTypes from 'prop-types';

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className='rating'>
      <span>
        {[1, 2, 3, 4, 5].map((index) => (
          <i
            key={index}
            style={{ color }}
            className={
              value >= index
                ? 'fas fa-star'
                : value >= index - 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        ))}
      </span>
      <span>{text && text}</span>
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default Rating;
