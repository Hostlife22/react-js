import React from 'react';

const Pagination = ({
  currentPage,
  goPrev,
  goNext,
  itemsPerPage,
  totalItems,
}) => {
  const amountRemainingUsers = totalItems - itemsPerPage * currentPage;
  const isPrevPageAvailable = currentPage === 1;
  const isNextPageAvailable = amountRemainingUsers <= 0;

  return (
    <div className="pagination">
      <button className="btn" disabled={isPrevPageAvailable} onClick={goPrev}>
        {!isPrevPageAvailable && '←'}
      </button>
      <span className="pagination__page">{currentPage}</span>
      <button className="btn" disabled={isNextPageAvailable} onClick={goNext}>
        {!isNextPageAvailable && '→'}
      </button>
    </div>
  );
};

export default Pagination;
