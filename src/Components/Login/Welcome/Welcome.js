import React from 'react';
import './Welcome.scss';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import MailIcon from '@material-ui/icons/Mail';
import MenuBookOutlinedIcon from '@material-ui/icons/MenuBookOutlined';
import CreateIcon from '@material-ui/icons/Create';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
import { ScrollableCards } from '../../Common';

const Welcome = (props) => {
  return (
    <>
      <Button
        variant='customSkip'
        className='Welcome__skip'
        onClick={() => props.changeComponent('PhoneNo')}
      >
        Skip
      </Button>
      <div className='Welcome__carouselPosition'>
        <Carousel
          autoPlay
          showThumbs={false}
          transitionTime={200}
          dynamicHeight={false}
          infiniteLoop
          className='Welcome__Carousel'
        >
          {props.data.posters.map((elem) => {
            return (
              <div key={`elem + ${elem.client_gallery_id} `}>
                <img
                  className=' d-block w-100 Welcome__imageCarousel'
                  src={elem.image}
                  alt={elem.image_type}
                  key={elem.client_gallery_id}
                />
              </div>
            );
          })}
        </Carousel>

        {props.data.features && (
          <div className='Welcome__features'>
            <Row className='Welcome__featuresRow mx-auto pt-2 px-1'>
              <Col className='text-center p-0'>
                <MailIcon />
                <p className='Welcome__featuresColumn'>{props.data.features[0].feature_name}</p>
              </Col>
              <Col className='text-center p-0'>
                <MenuBookOutlinedIcon />
                <p className='Welcome__featuresColumn'>{props.data.features[1].feature_name}</p>
              </Col>
              <Col className='text-center p-0'>
                <PhoneOutlinedIcon />
                <p className='Welcome__featuresColumn '>{props.data.features[2].feature_name}</p>
              </Col>
              <Col className='text-center p-0'>
                <CreateIcon />
                <p className='Welcome__featuresColumn '>{props.data.features[3].feature_name}</p>
              </Col>
            </Row>
          </div>
        )}
      </div>

      {props.data.result && (
        <div className='Welcome__result'>
          <h3 className='text-center Welcome__resultHeading my-5'>Results</h3>

          {props.data.result.map((elem) => {
            return (
              <div key={`elem+${elem.result_title_id}`}>
                <h3 className='Welcome__resultSubHeading ml-2 my-3 my-lg-5'>{elem.title_text}</h3>
                <ScrollableCards data={elem.final_result} />
              </div>
            );
          })}
        </div>
      )}

      {props.data.gallery && (
        <div className='Welcome__Gallery'>
          <h3 className='text-center Welcome__resultHeading my-5'>Gallery</h3>
          <Carousel
            autoPlay
            showThumbs={false}
            transitionTime={200}
            dynamicHeight={false}
            infiniteLoop
            className='Welcome__Carousel'
          >
            {props.data.gallery.map((elem, index) => {
              const source1 = elem[`url_${index * 4 + 1}`];
              const source2 = elem[`url_${index * 4 + 2}`];
              const source3 = elem[`url_${index * 4 + 3}`];
              const source4 = elem[`url_${index * 4 + 4}`];

              return (
                <div className='Welcome__imageGrid' key={`elem + ${elem.client_gallery_id} `}>
                  <img
                    className=' d-block w-100 Welcome__imageCarousel'
                    src={source1}
                    alt='gallery'
                  />
                  <img
                    className=' d-block w-100 Welcome__imageCarousel'
                    src={source2}
                    alt='gallery'
                  />
                  <img
                    className=' d-block w-100 Welcome__imageCarousel'
                    src={source3}
                    alt='gallery'
                  />
                  <img
                    className=' d-block w-100 Welcome__imageCarousel'
                    src={source4}
                    alt='gallery'
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}

      {props.data.batches && (
        <div className='Welcome__batch'>
          <h3 className='text-center Welcome__resultHeading my-5'>Batches</h3>
          <Row className='Welcome__batchRow'>
            {props.data.batches.map((elem) => {
              return (
                <Col key={`coaching+${elem.coaching_batch_id} `} xs={12} md={4}>
                  <Card className='my-3 mx-auto text-center Welcome__batchCard'>
                    <p className='Welcome__resultSubHeading mt-3'>{elem.batch_name}</p>
                    <p className='Welcome__resultHeading'>{elem.info}</p>
                    <div>
                      {elem.subject.map((e, index) => {
                        return (
                          <span key={`e+${e.subject_id}`}>
                            <span className='Welcome__resultHeading'>{e.subject_name}</span>
                            {index !== elem.subject.length - 1 && (
                              <span className='Welcome__resultHeading'> ,</span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <p className='Welcome__resultHeading'>{elem.starting_date}</p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
      <div className='Welcome__batchRow'>
        {props.data.testimonial && (
          <div className='Welcome__testimonials'>
            <h3 className='text-center Welcome__resultHeading my-5'>Testimonials</h3>
            <Carousel
              autoPlay
              showThumbs={false}
              transitionTime={500}
              dynamicHeight={false}
              infiniteLoop
              className='Welcome__testimonialCarousel'
            >
              {props.data.testimonial.map((elem) => {
                return (
                  <div key={`elem+${elem.client_testimonial_id} `}>
                    <p className='m-5 Welcome__testimonialText text-light'>{elem.text}</p>
                    <Row className='justify-content-center mb-3'>
                      <img
                        src={elem.image_url}
                        alt='student'
                        className='Welcome__testimonialImage mr-1'
                      />
                      <span className='Welcome__testimonialName text-light'>{elem.name}</span>
                    </Row>
                  </div>
                );
              })}
            </Carousel>
          </div>
        )}

        {props.data.team && (
          <div className='Welcome__result'>
            <h3 className='text-center Welcome__resultHeading my-5'>Team</h3>
            <ScrollableCards data={props.data.team} />
          </div>
        )}

        {props.data.director_message && (
          <div className='Welcome__directorMessage'>
            <h3 className='text-center Welcome__resultHeading my-5'>Director&apos;s Message</h3>
            <div className='d-flex justify-content-center'>
              <img
                src={props.data.director_message.image_url}
                alt='director'
                className='Welcome__directorImage'
              />
            </div>

            <p className='Welcome__resultSubHeading text-center mt-3 mt-mg-5'>
              {props.data.director_message.name}
            </p>

            <h5 className='text-danger font-weight-bold ml-2'>Dear Students,</h5>
            <p className='my-3 ml-2 pb-3'>{props.data.director_message.text}</p>
          </div>
        )}
      </div>

      {props.data.address && (
        <div className='Welcome__address pb-4 mb-2'>
          <h3 className='text-center Welcome__resultHeading my-5'>Address &amp; Contact</h3>

          {props.data.address.map((elem) => {
            return (
              <React.Fragment key={`elem+${elem.client_centre_id} `}>
                {elem.address_text && (
                  <p className='mx-2'>
                    <span className='mx-2'>
                      <LocationOnIcon />
                    </span>
                    <span>
                      <u>{elem.address_text}</u>
                    </span>
                  </p>
                )}
                {elem.address_contact.length !== 0 && (
                  <>
                    <p className='mx-2'>
                      <span className='mx-2'>
                        <PhoneIcon />
                      </span>
                      {elem.address_contact
                        .filter((e) => e.contact_type === 'mobile')
                        .map((e, index, arr) => {
                          return (
                            <React.Fragment key={`e+${e.contact} `}>
                              <span>
                                <u>{e.contact}</u>
                              </span>
                              {index !== arr.length - 1 && (
                                <span>
                                  <u> ,</u>
                                </span>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </p>
                    <p className='mx-2'>
                      <span className='mx-2'>
                        <MailIcon />
                      </span>
                      {elem.address_contact
                        .filter((e) => e.contact_type === 'email')
                        .map((e, index, arr) => {
                          return (
                            <React.Fragment key={`e+${e.contact} `}>
                              <span>
                                <u>{e.contact}</u>
                              </span>
                              {index !== arr.length - 1 && (
                                <span>
                                  <u> ,</u>
                                </span>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </p>
                    <hr className='w-75' />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <div className='Welcome__signInButton text-center py-3'>
        <Button variant='customPrimary' onClick={() => props.changeComponent('PhoneNo')}>
          SIGN IN
        </Button>
      </div>
    </>
  );
};

export default Welcome;
