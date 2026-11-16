import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No Data Found',
  message = 'There are currently no items to display in this section.',
  actionText,
  actionLink,
  onActionClick
}) => {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="fw-bold text-dark mb-2">{title}</h5>
      <p className="text-secondary small mb-3 mx-auto" style={{ maxWidth: '420px' }}>
        {message}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary px-4 py-2 rounded-pill fw-medium shadow-sm">
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && (
        <button onClick={onActionClick} className="btn btn-primary px-4 py-2 rounded-pill fw-medium shadow-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
