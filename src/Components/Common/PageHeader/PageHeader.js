import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FilterListIcon from '@material-ui/icons/FilterList';
import { BackButton } from '../BackButton/BackButton';
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import GlobalSearchBar from '../GlobalSearchBar/GlobalSearchBar';

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
    transparentBlue,
    filter,
    triggerFilters,
    customIcon,
    handleCustomIcon,
    customIcon2,
    handleCustomIcon2,
    notFixed,
    shadow,
    noBack,
    iconColor,
    width,
    globalSearch,
  } = props;

  const [searchBar, triggerSearchBar] = useState(false);
  const closeSearchBar = () => {
    triggerSearchBar(false);
    searchFilter('');
  };
  return (
    <div
      className={
        notFixed
          ? 'notFixedPageHeader p-3 d-flex align-items-center'
          : 'PageHeader p-3 d-flex align-items-center'
      }
      style={{
        backgroundColor: transparent
          ? 'transparent'
          : transparentBlue
          ? 'rgba(241, 249, 255, 1)'
          : 'white',
        width,
        boxShadow: shadow ? '0px 2px 2px 0px rgba(0,0,0,0.29)' : 'transparent',
      }}
    >
      {!searchBar && (
        <>
          {!noBack &&
            (customBack ? (
              <ArrowBackIcon color={iconColor} onClick={() => handleBack()} />
            ) : (
              <BackButton color={iconColor} />
            ))}
          <span className='ml-3 PageHeader__title'>{title}</span>
          {globalSearch ? <GlobalSearchBar /> : null}
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
            {customIcon2 && (
              <span
                className='mr-3'
                onClick={() => handleCustomIcon2()}
                onKeyDown={() => handleCustomIcon2()}
                tabIndex='-1'
                role='button'
              >
                {customIcon2}
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
            className='PageHeader__input mx-2 p-2'
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
  shadow: PropTypes.bool,
  searchFilter: PropTypes.func,
  triggerFilters: PropTypes.func,
  customBack: PropTypes.bool,
  handleBack: PropTypes.func,
  transparent: PropTypes.bool,
  transparentBlue: PropTypes.bool,
  filter: PropTypes.bool,
  notFixed: PropTypes.bool,
  noBack: PropTypes.bool,
  iconColor: PropTypes.string,
  customIcon: PropTypes.element,
  handleCustomIcon: PropTypes.func,
  customIcon2: PropTypes.element,
  handleCustomIcon2: PropTypes.func,
  width: PropTypes.string,
  globalSearch: PropTypes.bool,
};

PageHeader.defaultProps = {
  title: '',
  width: '100%',
  search: false,
  iconColor: 'black',
  notFixed: false,
  shadow: false,
  noBack: false,
  placeholder: '',
  searchFilter: () => {},
  customBack: false,
  handleBack: () => {},
  triggerFilters: () => {},
  transparent: false,
  transparentBlue: false,
  filter: false,
  customIcon: null,
  handleCustomIcon: () => {},
  customIcon2: null,
  handleCustomIcon2: () => {},
  globalSearch: false,
};
