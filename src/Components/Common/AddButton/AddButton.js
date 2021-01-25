import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddButton.scss';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';

export const AddButton = (props) => {
  const { addButtonArray, onlyUseButton, triggerButton } = props;
  const [openMenu, setOpenMenu] = useState(false);
  const divlengthClass = classNames({
    AddButton__innerDiv: !openMenu,
    AddButton__innerDivLong: openMenu,
  });

  const uploadFile = (elem, e) => {
    const formdata = new FormData();
    formdata.append('data', e.target.files[0]);
    // reader.readAsDataURL(e.target.files[0]);
    // reader.onloadend = function getFile() {
    //   const base64data = reader.result;
    elem.func(formdata);
    // };
  };

  const openMenuOrTriggerFunction = () => {
    if (onlyUseButton) {
      triggerButton();
    } else {
      setOpenMenu(true);
    }
  };

  return (
    <div className='AddButton__wrap' style={{ zIndex: '999' }}>
      <div className='AddButton__folded'>
        <div className={divlengthClass}>
          {!openMenu && (
            <AddIcon
              className='AddButton__addIcon'
              onClick={() => openMenuOrTriggerFunction()}
              onKeyDown={() => openMenuOrTriggerFunction()}
              role='button'
              tabIndex='-1'
            />
          )}
          {openMenu && (
            <>
              {addButtonArray.map((elem) => {
                return (
                  <>
                    {elem.name === 'add File' ? (
                      <>
                        <label htmlFor='upload-photo'>Browse...</label>
                        <input
                          type='file'
                          name='upload-photo'
                          id='upload-photo'
                          onChange={(e) => uploadFile(elem, e)}
                        />
                      </>
                    ) : (
                      <p
                        className='AddButton__menuContents mr-1 mt-4'
                        key={elem.name}
                        onClick={elem.func}
                        onKeyDown={elem.func}
                        role='button' // eslint-disable-line
                        tabIndex='-1'
                      >
                        {elem.name}{' '}
                        <span>
                          <PersonAddRoundedIcon />
                        </span>
                      </p>
                    )}
                  </>
                );
              })}
              <CloseIcon
                className='AddButton__closeIcon'
                onClick={() => setOpenMenu(false)}
                onKeyDown={() => setOpenMenu(false)}
                role='button'
                tabIndex='-1'
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

AddButton.propTypes = {
  addButtonArray: PropTypes.instanceOf(Array),
  onlyUseButton: PropTypes.bool,
  triggerButton: PropTypes.func,
};

AddButton.defaultProps = {
  onlyUseButton: false,
  addButtonArray: [],
  triggerButton: () => {},
};
