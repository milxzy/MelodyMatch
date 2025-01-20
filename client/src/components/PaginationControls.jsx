const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange('prev')}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange('next')}
        >
          Next
        </button>
      </div>
    );
  };
  
  export default PaginationControls;
  