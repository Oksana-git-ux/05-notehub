import React from 'react';
import css from './Loader.module.css';

const Loader: React.FC = () => (
       
        <div className={css.loaderContainer}>
            <div className={css.spinner}></div>
            <p>Loading...</p>
        </div>
    );

export default Loader; 