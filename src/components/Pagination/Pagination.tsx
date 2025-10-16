import React from 'react';
import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
    totalPages: number;
    currentPage: number; 
    onPageChange: (selected: number) => void; 
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const handlePageClick = ({ selected }: { selected: number }) => {
        onPageChange(selected); 
    };

    return (
        <ReactPaginate
            pageCount={totalPages} 
            onPageChange={handlePageClick}
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            nextLabel="→"
            previousLabel="←"
            breakLabel="..."
            renderOnZeroPageCount={null}
        />
    );
};
export default Pagination;