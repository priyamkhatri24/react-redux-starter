import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { BackButton } from '../BackButton/BackButton';
import './PageHeader.scss';

export const PageHeader = (props) => {
  const { title, search, placeholder, searchFilter, customBack, handleBack } = props;

  const [searchBar, triggerSearchBar] = useState(false);
  return (
    <div className='PageHeader p-3 d-flex'>
      {!searchBar && (
        <>
          {customBack ? <ArrowBackIcon onClick={() => handleBack()} /> : <BackButton />}
          <span className='ml-3 PageHeader__title'>{title}</span>
          <div className='ml-auto'>
            {search && (
              <span
                role='button'
                tabIndex='-1'
                onKeyDown={() => triggerSearchBar(true)}
                onClick={() => triggerSearchBar(true)}
              >
                <SearchIcon className='mr-3' />
              </span>
            )}
            <MoreVertIcon />
          </div>
        </>
      )}

      {searchBar && (
        <>
          <SearchIcon />
          <input
            autoFocus
            placeholder={placeholder}
            className='PageHeader__input mx-2'
            onChange={(e) => searchFilter(e.target.value)}
          />
          <span
            role='button'
            tabIndex='-1'
            onKeyDown={() => triggerSearchBar(false)}
            onClick={() => triggerSearchBar(false)}
            className='ml-auto'
          >
            <ClearIcon className='mr-3' />
          </span>
        </>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  search: PropTypes.bool,
  placeholder: PropTypes.string,
  searchFilter: PropTypes.func,
  customBack: PropTypes.bool,
  handleBack: PropTypes.func,
};

PageHeader.defaultProps = {
  search: false,
  placeholder: '',
  searchFilter: () => {},
  customBack: false,
  handleBack: () => {},
};
