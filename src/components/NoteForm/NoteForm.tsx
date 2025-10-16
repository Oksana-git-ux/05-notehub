import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik'; 
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { createNote } from '../../services/noteService';
import { type NewNote, type NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
    onClose: () => void;
}

const TAG_OPTIONS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, 'Title must be at least 3 characters')
        .max(50, 'Title cannot exceed 50 characters')
        .required('Title is required'),
    content: Yup.string()
        .max(500, 'Content cannot exceed 500 characters'),
    tag: Yup.string()
        .oneOf(TAG_OPTIONS, 'Invalid Tag selection')
        .required('Tag is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ onClose }) => {
    const queryClient = useQueryClient();
    
    const createMutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            toast.success('Note successfully created!');
            onClose();
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onError: (error) => {
            toast.error(`Creation failed: ${error.message}`); 
        }
    });

    const handleSubmit = (values: NewNote) => {
        createMutation.mutate(values);
    };

    return (
        <Formik
            initialValues={{ title: '', content: '', tag: 'Todo' } as NewNote}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className={css.form}>
                    
                    <div className={css.formGroup}>
                        <label htmlFor="title">Title</label>
                        <Field 
                            id="title" 
                            type="text" 
                            name="title" 
                            className={css.input} 
                        />
                        <FormikError name="title" component="span" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="content">Content</label>
                        <Field
                            id="content"
                            name="content"
                            component="textarea"
                            rows={8}
                            className={css.textarea}
                        />
                        <FormikError name="content" component="span" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="tag">Tag</label>
                        <Field id="tag" name="tag" as="select" className={css.select}>
                            {TAG_OPTIONS.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </Field>
                        <FormikError name="tag" component="span" className={css.error} />
                    </div>

                    <div className={css.actions}>
                         <button 
                             type="button" 
                             className={css.cancelButton} 
                             onClick={onClose}
                         >
                             Cancel
                         </button>
                         <button
                             type="submit"
                             className={css.submitButton}
                             disabled={isSubmitting || createMutation.isPending} 
                         >
                             {createMutation.isPending ? 'Creating...' : 'Create note'}
                         </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default NoteForm;