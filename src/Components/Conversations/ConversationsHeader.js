import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import ArrowBack from '@material-ui/icons/ArrowBack';
import MoreVert from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import { get, apiValidation } from '../../Utilities';
import { formatConversations } from './formatter';
import GlobalSearchBar from '../Common/GlobalSearchBar/GlobalSearchBar';
import { getConversations } from '../../redux/reducers/conversations.reducer';
import { getClientUserId } from '../../redux/reducers/clientUserId.reducer';
import { conversationsActions } from '../../redux/actions/conversations.action';

const ConversationsHeader = function ({
  title,
  goToHome,
  goToConversations,
  conversations,
  setConversations,
  clientUserId,
  searchBar,
}) {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    let timer;
    if (searchBar) {
      timer = setTimeout(() => {
        if (conversations.length > 0 && searchQuery.length > 0) {
          get(null, `/getConversationsOfUser?client_user_id=${clientUserId}`).then((res) => {
            const data = apiValidation(res);
            const fetchedConvo = formatConversations(data);
            const newConversations = fetchedConvo.filter((elem) => {
              return elem.name.toLowerCase().includes(searchQuery);
            });
            setConversations(newConversations);
          });
        } else {
          get(null, `/getConversationsOfUser?client_user_id=${clientUserId}`).then((res) => {
            const data = apiValidation(res);
            const fetchedConvo = formatConversations(data);
            setConversations(fetchedConvo);
          });
        }
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return (
    <Row noGutters>
      <Col xs={12}>
        <div
          className='p-2 d-flex flex-column justify-content-between'
          style={{ boxShadow: '0px 2px 2px 0px #00000029', marginTop: '10px' }}
        >
          <div className='d-flex justify-content-between'>
            <div className='d-flex align-items-center'>
              <ArrowBack
                className='mr-3 mb-2'
                role='button'
                tabIndex={0}
                /* eslint-disable */
                onClick={() =>
                  goToHome
                    ? history.push('/')
                    : goToConversations
                    ? history.push('/conversations')
                    : history.replace('/conversation')
                }
                onKeyDown={() => (goToHome ? history.push('/') : history.push('/conversation'))}
              />
              <h5 style={{ fontFamily: 'Montserrat-Bold' }} className='heading'>
                {title}
              </h5>
            </div>
            {/* <GlobalSearchBar /> */}
            <MoreVert className='justify-self-end' />
          </div>
          {searchBar ? (
            <div className='d-flex align-items-center mt-4'>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='chatsSearchInput'
                placeholder='Search for batches'
                type='text'
              />
              <SearchIcon />
            </div>
          ) : null}
        </div>
      </Col>
    </Row>
  );
};

ConversationsHeader.propTypes = {
  title: PropTypes.string,
  goToHome: PropTypes.bool,
  conversations: PropTypes.instanceOf(Array).isRequired,
  setConversations: PropTypes.func.isRequired,
  goToConversations: PropTypes.bool,
  clientUserId: PropTypes.number.isRequired,
  searchBar: PropTypes.bool,
};

ConversationsHeader.defaultProps = {
  title: 'Chats',
  goToHome: false,
  goToConversations: false,
  searchBar: false,
};

const mapStateToProps = (state) => {
  return {
    clientUserId: getClientUserId(state),
    conversations: getConversations(state),
  };
};
const mapActionsToProps = (dispatch) => {
  return {
    setConversations: (conversations) => {
      dispatch(conversationsActions.setConversations(conversations));
    },
  };
};
export default connect(mapStateToProps, mapActionsToProps)(ConversationsHeader);
