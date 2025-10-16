import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast'; 

import { fetchNotes, type NotesQueryResult } from './services/noteService';
import SearchBox from './components/SearchBox/SearchBox'
import Pagination from './components/Pagination/Pagination';
import NoteList from './components/NoteList/NoteList';
import Modal from './components/Modal/Modal';
import NoteForm from './components/NoteForm/NoteForm';
import Loader from './components/Loader/Loader';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';

import css from './App.module.css';

const PER_PAGE = 12;

const App: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const { 
        data, 
        isLoading, 
        isError, 
        isFetching,
        error 
    } = useQuery<NotesQueryResult>({
        queryKey: ['notes', page, debouncedSearchTerm], 
        queryFn: () => fetchNotes({ 
            page, 
            perPage: PER_PAGE, 
            search: debouncedSearchTerm 
        }),
        placeholderData: (previousData) => previousData,
    });

    const notes = data?.notes || [];
    const totalPages = data?.totalPages || 0;
    
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((selected: number) => {
        setPage(selected + 1);
    }, []);

    const showPagination = totalPages > 1;

    useEffect(() => {
        if (isError) {
            toast.error(`Error: ${error?.message || 'Failed to load notes.'}`);
        }
    }, [isError, error]);

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
                
                <button 
                    className={css.button}
                    onClick={() => setIsModalOpen(true)}
                >
                    Create note +
                </button>
            </header>

            <main>
                {(isLoading || isFetching) && <Loader />}
                {isError && <ErrorMessage message={error?.message} />}
                
                {!isLoading && !isError && (
                    <NoteList notes={notes} currentPage={page} />
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