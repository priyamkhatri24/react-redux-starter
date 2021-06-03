import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
import { getCurrentcolor } from '../redux/reducers/color.reducer';
import { getCurrentBranding } from '../redux/reducers/branding.reducer';
import { setGlobalColors, changeFaviconAndDocumentTitle } from '../Utilities';
import { Loader } from '../Components/Common/Loader/Loading';
import './App.scss';
import { history, Routes } from '../Routing';
import { getCurrentLoadingStatus } from '../redux/reducers/loading.reducer';
import withClearCache from './BustCache';

function MainApp(props) {
  const { color, currentbranding, isLoading } = props;

  useEffect(() => {
    if (Object.keys(color.color) !== 0) {
      const { primary, light, lighter, superLight } = color.color;
      setGlobalColors(primary, light, lighter, superLight);
    }

    if (Object.keys(currentbranding.branding) !== 0) {
      const { client_icon: clientIcon, client_title: clientTitle } = currentbranding.branding;
      changeFaviconAndDocumentTitle(clientIcon, clientTitle);
    }
  }, [color, currentbranding]);

  return (
    <Container fluid className='p-0 m-0 overflow-hidden rootContainer mx-auto'>
      {isLoading && <Loader />}
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  color: getCurrentcolor(state),
  currentbranding: getCurrentBranding(state),
  isLoading: getCurrentLoadingStatus(state),
});

const BustCache = withClearCache(connect(mapStateToProps)(MainApp));

function App() {
  return <BustCache />;
}

export default App;

MainApp.propTypes = {
  color: PropTypes.shape({
    color: PropTypes.shape({
      primary: PropTypes.string,
      light: PropTypes.string,
      lighter: PropTypes.string,
      superLight: PropTypes.string,
    }),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.instanceOf(Object).isRequired,
  }).isRequired,
};
