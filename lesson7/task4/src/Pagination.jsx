import React from 'react';

const Pagination = (props) => {
  const { goNext, goPrev, currentPage, itemsPerPage, totalItems } = props;
  const amountRemainingUsers = totalItems - itemsPerPage * currentPage;
  const isPrevPageAvailable = currentPage === 1;
  const isNextPageAvailable =
    amountRemainingUsers % 3 !== 0 || amountRemainingUsers !== 3;

  return (
    <div className="pagination">
      <button className="btn" disabled={isPrevPageAvailable} onClick={goPrev}>
        {isPrevPageAvailable ? null : '←'}
      </button>
      <span className="pagination__page">{currentPage}</span>
      <button className="btn" disabled={isNextPageAvailable} onClick={goNext}>
        {isNextPageAvailable ? null : '→'}
      </button>
    </div>
  );
};

export default Pagination;
