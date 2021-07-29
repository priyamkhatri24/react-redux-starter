import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './AddButton.scss';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { uploadMultipleImages } from '../../../Utilities/customUpload';
import { loadingActions } from '../../../redux/actions/loading.action';

const AddButton = (props) => {
  const { addButtonArray, onlyUseButton, triggerButton } = props;
  const courseFileRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);
  const divlengthClass = classNames({
    AddButton__innerDiv: !openMenu,
    AddButton__innerDivLong: openMenu,
  });

  // const getImageInput = (e) => {

  // };

  const upload = (elem, e) => {
    const reader = new FileReader();
    console.log(e.target.files);
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(e.target.files[0]);

      // uploadingImage(file).then((res) => {
      //   console.log('fileu;lod ', res);
      //   elem.func(file.name, res.filename);
      // });

      uploadMultipleImages(e.target.files).then((res) => {
        elem.func(res);
      });
    }
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
            <div className='pt-5'>
              {addButtonArray.map((elem) => {
                return (
                  <>
                    <input
                      type='file'
                      name='upload-photo'
                      id='upload-photo'
                      multiple
                      onChange={(e) => upload(addButtonArray[0], e)}
                      style={{ display: 'none' }}
                      ref={courseFileRef}
                    />
                    {elem.name === 'add File' ? (
                      <Row
                        className='AddButton__menuContents mx-1 mt-2'
                        key={elem.name}
                        onClick={() => courseFileRef.current.click()}
                      >
                        <Col xs={8} className='p-0 my-auto'>
                          {elem.name}
                        </Col>
                        <Col xs={4}>
                          <span
                            style={{
                              height: '28px',
                              width: '28px',
                              border: '1px solid #fff',
                              borderRadius: '50%',
                              padding: '8px',
                              backgroundColor: '#fff',
                              color: '#000',
                            }}
                            className='my-auto'
                          >
                            <PersonAddRoundedIcon />
                          </span>
                        </Col>
                      </Row>
                    ) : (
                      <Row
                        className='AddButton__menuContents mx-1 mt-4'
                        key={elem.name}
                        onClick={elem.func}
                      >
                        <Col xs={8} className='p-0 my-auto'>
                          {elem.name}
                        </Col>
                        <Col xs={4}>
                          <span
                            style={{
                              height: '28px',
                              width: '28px',
                              border: '1px solid #fff',
                              borderRadius: '50%',
                              padding: '8px',
                              backgroundColor: '#fff',
                              color: '#000',
                            }}
                            className='my-auto'
                          >
                            <PersonAddRoundedIcon />
                          </span>
                        </Col>
                      </Row>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoadingPendingToStore: (payload) => {
      dispatch(loadingActions.pending());
    },

    setLoadingSuccessToStore: (payload) => {
      dispatch(loadingActions.success());
    },
  };
};

export default connect(null, mapDispatchToProps)(AddButton);

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
