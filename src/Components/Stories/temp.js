import React, { useState, Component } from 'react';
import { Button } from 'react-bootstrap';
import Stories from 'react-insta-stories';
// import './AppStories.css';
import { Modal, Box, Typography, withStyles, makeStyles } from '@material-ui/core';

const useStyle = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgb(255 255 255)',
    position: 'relative',
    width: '70%',
    marginLeft: '16%',
    height: '100%',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const AppStories = () => {
  // const [show, setShow] = useState(false);
  // const [fullscreen, setFullscreen] = useState(true);
  // const handleClose = () => setShow(true);
  // const handleShow = () => setShow(true);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const story = [
    // 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    // 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    // 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615',
    {
      url: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
      duration: 3000,
      currentIndex: 0,
    },
    {
      url: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      duration: 3000,
      currentIndex: 1,
    },
    {
      url: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615',
      duration: 3000,
      currentIndex: 2,
    },
    {
      url: 'https://i.imgur.com/FwcWFeX.jpg',
      duration: 3000,
      currentIndex: 3,
    },
  ];
  const storyStart = () => {
    console.log('Story Started');
  };
  const storyEnd = () => {
    console.log('Story ended');
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 100,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // const modalClass = {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   background: 'rgb(255 255 255)',
  //   position: 'relative',
  //   width: '70%',
  //   marginLeft: '16%',
  //   height: '100%',
  //   flexWrap: 'wrap',
  //   alignContent: 'center',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  // };
  const classes = useStyle();
  return (
    <div>
      <Button onClick={handleOpen}>open stories</Button>

      {/* <Modal
        show={show}
        fullscreen
        onHide={handleClose}
        animation={false}
        dialogClassName='custom-modal'
        bsClass='my-modal'
      >
        <Modal.Body>
          <div>
            <Stories
              stories={story}
              loop='true'
              onStoryStart={storyStart}
              onStoryEnd={storyEnd}
              onAllStoriesEnd={() => {
                console.log('all ended');
              }}
              keyboardNavigation
            />
          </div>
        </Modal.Body>
      </Modal> */}
      {/* <div className='modal-main'> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        className={classes.root}
      >
        <Stories
          stories={story}
          loop='true'
          onStoryStart={storyStart}
          onStoryEnd={storyEnd}
          onAllStoriesEnd={() => {
            console.log('all ended');
          }}
          keyboardNavigation
        />
      </Modal>
      {/* </div> */}
    </div>
  );
};
export default AppStories;
