import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast'; 

import { fetchNotes, type NotesQueryResult } from '../../api/noteService';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import css from './App.module.css';

const PER_PAGE = 12;

const App: React.FC = () => {
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { data, isError, isFetching, error } = useQuery<NotesQueryResult>({
        queryKey: ['notes', page, debouncedSearchTerm], 
        queryFn: () => fetchNotes({ 
            page: page + 1,
            perPage: PER_PAGE, 
            search: debouncedSearchTerm 
        }),
        placeholderData: (previousData) => previousData,
    });
    
    useEffect(() => {
        if (isError) {
            toast.error(`Error loading notes: ${error?.message || 'Failed to load notes.'}`);
        }
    }, [isError, error]);

    const notes = data?.notes || [];
    const totalPages = data?.totalPages || 0;
    
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setPage(0);
    }, []);

    const handlePageChange = useCallback((selected: number) => {
        setPage(selected);
    }, []);

    const showPagination = totalPages > 1;
    const shouldRenderList = notes.length > 0 && !isError;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onChange={handleSearchChange} value={searchTerm} />
                
                {showPagination && (
                    <Pagination 
                        totalPages={totalPages}
                        currentPage={page}
                        onPageChange={handlePageChange}
                    />
                )}
                
                <button className={css.button} onClick={() => setIsModalOpen(true)}>
                    Create note +
                </button>
            </header>

            <main>
                {isFetching && <Loader />} 
                {isError && <ErrorMessage message={error?.message} />}
                
                {shouldRenderList && (
                    <NoteList notes={notes} />
                )}
                
                {!isFetching && !isError && notes.length === 0 && (
                    <p className={css.noResults}>No notes found. Try changing your search query or creating a new note.</p>
                )}
            </main>
            
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onClose={() => setIsModalOpen(false)} />
                </Modal>
            )}

            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default App;