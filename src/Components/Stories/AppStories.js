import React, { useState, Component } from 'react';
// import { Modal, Button } from 'react-bootstrap';
import Stories from 'react-insta-stories';
import './Modal.css';

const AppStories = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const story = [
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
      styles: {
        width: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        margin: 'auto',
        background: 'red',
      },
      // currentIndex: 3,
    },
  ];
  const storyStart = () => {
    console.log('Story Started');
  };
  const storyEnd = () => {
    console.log('Story ended');
  };
  return (
    <div>
      <div className='App'>
        {!modalOpen && (
          <div>
            <h1>click on the button to open the modal.</h1>
            <button type='button' className='openModalBtn' onClick={() => setModalOpen(true)}>
              Open
            </button>
          </div>
        )}

        {modalOpen && (
          <div className='modalBackground'>
            <div className='modalContainer'>
              <div className='titleCloseBtn'>
                <button type='button' onClick={() => setModalOpen(false)}>
                  X
                </button>
              </div>
              <div className='body'>
                <Stories
                  width='100%'
                  height='100%'
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AppStories;
