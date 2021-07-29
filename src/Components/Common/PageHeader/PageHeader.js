import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FilterListIcon from '@material-ui/icons/FilterList';
import { BackButton } from '../BackButton/BackButton';

import './PageHeader.scss';

export const PageHeader = (props) => {
  const {
    title,
    search,
    placeholder,
    searchFilter,
    customBack,
    handleBack,
    transparent,
    filter,
    triggerFilters,
    customIcon,
    handleCustomIcon,
    notFixed,
    noBack,
  } = props;

  const [searchBar, triggerSearchBar] = useState(false);
  const closeSearchBar = () => {
    triggerSearchBar(false);
    searchFilter('');
  };
  return (
    <div
      className={
        notFixed ? 'p-3 d-flex align-items-center' : 'PageHeader p-3 d-flex align-items-center'
      }
      style={transparent ? { backgroundColor: 'transparent' } : {}}
    >
      {!searchBar && (
        <>
          {!noBack &&
            (customBack ? <ArrowBackIcon onClick={() => handleBack()} /> : <BackButton />)}
          <span className='ml-3 PageHeader__title'>{title}</span>
          <div className='ml-auto '>
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
            {filter && (
              <span role='button' tabIndex='-1' onKeyDown={triggerFilters} onClick={triggerFilters}>
                <FilterListIcon className='mr-3' />
              </span>
            )}
            {customIcon && (
              <span
                className='mr-3'
                onClick={() => handleCustomIcon()}
                onKeyDown={() => handleCustomIcon()}
                tabIndex='-1'
                role='button'
              >
                {customIcon}
              </span>
            )}
            {/* <MoreVertIcon /> */}
          </div>
        </>
      )}

      {searchBar && (
        <>
          <SearchIcon />
          <input
            autoFocus // eslint-disable-line
            placeholder={placeholder}
            className='PageHeader__input mx-2'
            onChange={(e) => searchFilter(e.target.value)}
          />
          <span
            role='button'
            tabIndex='-1'
            onKeyDown={() => closeSearchBar()}
            onClick={() => closeSearchBar()}
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
  title: PropTypes.string,
  search: PropTypes.bool,
  placeholder: PropTypes.string,
  searchFilter: PropTypes.func,
  triggerFilters: PropTypes.func,
  customBack: PropTypes.bool,
  handleBack: PropTypes.func,
  transparent: PropTypes.bool,
  filter: PropTypes.bool,
  notFixed: PropTypes.bool,
  noBack: PropTypes.bool,
  customIcon: PropTypes.element,
  handleCustomIcon: PropTypes.func,
};

PageHeader.defaultProps = {
  title: '',
  search: false,
  notFixed: false,
  noBack: false,
  placeholder: '',
  searchFilter: () => {},
  customBack: false,
  handleBack: () => {},
  triggerFilters: () => {},
  transparent: false,
  filter: false,
  customIcon: null,
  handleCustomIcon: () => {},
};
