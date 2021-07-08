import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PhoneIcon from '@material-ui/icons/Phone';
import LinkIcon from '@material-ui/icons/Link';
import { apiValidation, get } from '../../Utilities';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import YCIcon from '../../assets/images/ycIcon.png';
import '../Dashboard/Dashboard.scss';
import './DummyDashboard.scss';
import fb from '../../assets/images/dummyDashboard/fb.png';
import linkedin from '../../assets/images/dummyDashboard/linkedin.svg';
import insta from '../../assets/images/dummyDashboard/instagram.svg';
import share from '../../assets/images/dummyDashboard/share.svg';
import whatsapp from '../../assets/images/dummyDashboard/whatsapp.svg';
import youtube from '../../assets/images/dummyDashboard/youtube.png';
import telegram from '../../assets/images/dummyDashboard/telegram.svg';
import form from '../../assets/images/dummyDashboard/form.svg';
import '../Common/ScrollableCards/ScrollableCards.scss';
import { AspectCards } from '../Common';
import { getClientId } from '../../redux/reducers/clientUserId.reducer';
import userAvatar from '../../assets/images/user.svg';

const DummyDashboard = (props) => {
  const {
    clientId,
    currentbranding: { branding },
    changeComponent,
    history,
  } = props;

  const [dummyData, setDummyData] = useState({});
  const [notices, setNotices] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    get({ client_id: clientId }, '/getRecentDataLatest').then((res) => {
      console.log(res);
      const result = apiValidation(res);
      setDummyData(result);
      setNotices(result.notice);
    });
  }, [clientId]);

  const shareThis = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Come Join Us`,
          // eslint-disable-next-line
          text: `Hey, ${dummyData.client_name} is a fast, simple and fun app that I use for learning and growing everyday`,
          url: window.location.href,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      setShowToast(true);
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const imgUrl = branding.client_logo;

  return (
    Object.keys(dummyData).length > 0 && (
      <div className='text-center'>
        <div className='Dashboard__headerCard pt-5 mb-5'>
          <h3 className='Dummy__coachingName'>{dummyData.client_name}</h3>
          <p className='Dummy__tagline mb-4'>{dummyData.client_tag_line}</p>

          <img
            src={imgUrl || YCIcon}
            className='img-fluid'
            alt='profile'
            width='100px'
            height='100px'
          />
        </div>
        <Button
          variant='customPrimarySmol'
          style={{
            letterSpacing: '0.09px',
            lineHeight: '18px',
            paddingLeft: '30px',
            paddingRight: '30px',
          }}
          onClick={
            history.location.pathname === '/displaypage/preview'
              ? () => {}
              : () => changeComponent('PhoneNo')
          }
        >
          Register Now!
        </Button>
        <div className='m-2 mt-4'>
          {dummyData.posters.length > 0 && (
            <>
              <AspectCards
                data={dummyData.posters}
                clickCard={() => {}}
                clickAddCard={() => {}}
                section='notice'
                noAddCard
                bigAspectCard
              />
            </>
          )}

          <>
            {dummyData.star_performers.length > 0 && (
              <>
                <h6
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    lineHeight: '20px',
                    textAlign: 'left',
                    fontSize: '14px',
                  }}
                  className='mx-3 mt-4 mb-0'
                >
                  Our Star Performers
                </h6>
                <AspectCards
                  data={dummyData.star_performers}
                  clickCard={() => {}}
                  clickAddCard={() => {}}
                  section='notice'
                  noAddCard
                />
              </>
            )}
          </>
          {dummyData.testimonials.length > 0 && (
            <>
              <h6
                style={{
                  fontFamily: 'Montserrat-Medium',
                  lineHeight: '20px',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
                className='mx-3 mt-4 mb-0'
              >
                Testimonials
              </h6>
              <AspectCards
                data={dummyData.testimonials}
                clickCard={() => {}}
                clickAddCard={() => {}}
                section='notice'
                noAddCard
              />
            </>
          )}
        </div>
        <div className='text-left m-3'>
          <h5 className='Dummy__aboutus mt-5'>About us</h5>
          <p className='Dummy__aboutData'>{dummyData.about_us}</p>

          <h6 className='Dummy__connect'>Connect with us</h6>

          <section className='Scrollable__card ' style={{ minHeight: '40px' }}>
            {[
              {
                key: 1,
                name: 'insta',
                link: dummyData.instagram_link,
                image: insta,
              },

              { key: 2, name: 'fb', link: dummyData.facebook_link, image: fb },
              {
                key: 3,
                name: 'watsapp',
                link: dummyData.whatsapp_link,
                image: whatsapp,
              },
              {
                key: 4,
                name: 'you',
                link: dummyData.youtube_link,
                image: youtube,
              },
              {
                key: 5,
                name: 'tele',
                link: dummyData.telegram_link,
                image: telegram,
              },
              {
                key: 6,
                name: 'linked',
                link: dummyData.linkedin_link,
                image: linkedin,
              },
            ]
              .filter((e) => e.link)
              .map((elem) => {
                return (
                  <a href={elem.link} className='text-center m-3' key={elem.key}>
                    <img src={elem.image} alt={elem.link} className='Dummy__socialLinks' />
                  </a>
                );
              })}
            <a
              href={dummyData.other_link}
              className='text-center m-3'
              style={{
                backgroundColor: 'rgba(112, 112, 112, 1)',
                color: '#fff',
                height: '36px',
                width: '36px',
                borderRadius: '36px',
                padding: '4px',
              }}
            >
              <LinkIcon />
            </a>
          </section>
        </div>

        <div
          className='Dashboard__noticeBoard mx-auto p-3'
          onClick={() => {}}
          role='button'
          tabIndex='-1'
          onKeyDown={() => {}}
        >
          <span className='Dashboard__verticalDots'>
            <MoreVertIcon />
          </span>
          <Row className='mt-2'>
            <Col xs={8}>
              <p className='Dashboard__todaysHitsText text-left'>Notice Board</p>
            </Col>
            <Col className='noticeboard_img' xs={4}>
              {/* <img src={dashboardAssignmentImage} alt='notice' height='80' width='80' /> */}
            </Col>
          </Row>

          <Row className='mt-5 mx-2 mb-3'>
            <span className='Dashboard__noticeBoardText my-auto'>Latest Notices</span>
            <span className='ml-auto' style={{ color: 'rgba(117, 117, 117, 1)' }}>
              <ChevronRightIcon />
            </span>
          </Row>

          {notices.map((elem) => (
            <div key={`elem${elem.notice_id}`} className='Dashboard__notice'>
              <Row>
                <Col xs={3} className='p-lg-4 py-3 text-center pr-0'>
                  <img
                    src={elem.profile_image ? elem.profile_image : userAvatar}
                    alt='profile'
                    className='Dashboard__noticeImage d-block mx-auto'
                  />
                </Col>
                <Col xs={9} className='pt-lg-4 py-3 pl-0 my-auto'>
                  <p className='Dashboard__scrollableCardHeading text-left m-0'>
                    {`${elem.first_name} ${elem.last_name}`}
                  </p>
                  <p className='Dashboard__noticeSubHeading text-left mb-0'>
                    {format(fromUnixTime(elem.time_of_notice), 'hh:m bbbb, do MMM yyy')}
                  </p>
                </Col>
              </Row>
              <p className='p-2 Dashboard__noticeText text-left'>{elem.notice_text}</p>
            </div>
          ))}
        </div>

        <Card className='m-3' style={{ border: '1px solid rgba(112, 112, 112, 0.5)' }}>
          <Row className='mx-0 justify-content-center mt-2'>
            <Col xs={8} className='text-left p-2'>
              <h6 className='Dummy__joinUs'>Join us NOW!</h6>
              <p className='mb-0 Dummy__joinDetails'>Your are not in any batch yet</p>
              <p className='Dummy__joinSmall'>Fill admission form to join us.</p>
            </Col>
            <Col xs={4} className='p-2'>
              <img src={form} alt='form' className='img-fluid' />
            </Col>
            <Button variant='customPrimarySmol' className='mb-3'>
              Fill admission form
            </Button>
          </Row>
        </Card>

        <Card className='m-3 mt-4' style={{ border: '1px solid rgba(112, 112, 112, 0.5)' }}>
          <Row className='mx-0 justify-content-center mt-2'>
            <Col xs={7} className='text-left p-2'>
              <h6 className='Dummy__connect'>Share app with friends</h6>
              <p className='mb-0 Dummy__joinDetails'>Enjoying the application?</p>
              <p className='Dummy__joinSmall'>Share with your friends</p>
              <Button
                variant='customPrimarySmol'
                className='mb-3'
                style={{ padding: '10px 20px' }}
                onClick={() => shareThis()}
              >
                Share
              </Button>
            </Col>
            <Col xs={5} className='p-2 mt-3 text-center'>
              <img src={share} alt='form' className='img-fluid' />
            </Col>
          </Row>
        </Card>

        {Object.keys(dummyData.address).length > 0 && (
          <Card className='m-3 mt-4' style={{ border: '1px solid rgba(112, 112, 112, 0.5)' }}>
            <Row className='mx-3 justify-content-left mt-2'>
              <h6 className='Dummy__joinUs'>Contact us</h6>
            </Row>
            {dummyData.address.location && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} className='pr-0'>
                  <LocationOnIcon />
                </Col>
                <Col xs={10} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__joinDetails'>{dummyData.address.location}</p>
                  <p className='Dummy__joinSmall'>Address</p>
                </Col>
              </Row>
            )}

            {dummyData.address.client_contact && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} className='pr-0'>
                  <PhoneIcon />
                </Col>
                <Col xs={10} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__joinDetails'>{dummyData.address.client_contact}</p>
                  <p className='Dummy__joinSmall'>Phone</p>
                </Col>
              </Row>
            )}
            {dummyData.address.client_email && (
              <Row className='mx-0 justify-content-center mt-2'>
                <Col xs={2} className='pr-0'>
                  <AlternateEmailIcon />
                </Col>
                <Col xs={10} className='text-left p-0 my-auto pr-4'>
                  <p className='mb-0 Dummy__joinDetails'>{dummyData.address.client_email}</p>
                  <p className='Dummy__joinSmall'>Email</p>
                </Col>
              </Row>
            )}
          </Card>
        )}
        <Toast
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '15%',
            zIndex: '999',
          }}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className='mr-auto'>Copied!</strong>
            <small>Just Now</small>
          </Toast.Header>
          <Toast.Body>The link has been copied to your clipboard!</Toast.Body>
        </Toast>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
  clientId: getClientId(state),
});

export default connect(mapStateToProps)(DummyDashboard);

DummyDashboard.propTypes = {
  clientId: PropTypes.number.isRequired,
  currentbranding: PropTypes.instanceOf(Object).isRequired,
  changeComponent: PropTypes.func.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};
