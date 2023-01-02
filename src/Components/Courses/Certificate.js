import React, { useState, useRef } from 'react';
import PropTypes, { element } from 'prop-types';
import { connect } from 'react-redux';
import domtoimage from 'dom-to-image';
import Button from 'react-bootstrap/Button';
// import { toPng } from 'html-to-image';
import background from '../../assets/images/Courses/certificate.png';
import { getCurrentBranding } from '../../redux/reducers/branding.reducer';
import './Courses.scss';

const Certificate = (props) => {
  const {
    history: {
      location: { state },
    },
    currentbranding: {
      branding: {
        client_color: clientColor,
        client_name: clientName,
        client_logo: clientLogo,
        client_title: clientTitle,
        client_icon: clientIcon,
      },
    },
  } = props;

  const downloadURI = (uri, name) => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // delete link;
  };

  //   const node = useRef(null);

  const downloadCertificate = () => {
    const node = document.querySelector('.certiMain');

    domtoimage
      .toPng(node)
      .then(function (dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        console.log(dataUrl, 'jahahah');
        // document.querySelector('.source').appendChild(img);
        downloadURI(dataUrl, 'image.png');
      })
      .catch(function (error) {
        console.log('oops, something went wrong!', error);
      });
    // domtoimage.toBlob(node).then(function (blob) {
    //   window.saveAs(blob, 'my-node.png');
    // });
  };

  console.log(state);

  return (
    <>
      <div className='certiMain text-center'>
        <div className='text-center certiborder'>
          <div className=' certiborder-inner'>
            <h1 className='mb-0'>CERTIFICATE</h1>
            <h4 className='mb-0'>OF APPRECIATION</h4>

            <div className='w-100 text-center Courses__cetificateNameDiv'>
              <h1 style={{ color: clientColor }} className='Courses__certificateName'>
                Priyam Khatri
              </h1>
              <p className='w-100 mx-auto Courses__certificateNormalText mt-4'>
                This is to certify that Mr/Mrs/Ms {state?.user} has successfully completed the
                course {state?.course} of total duration {state?.duration} hours on {state?.date} as
                taught by {state?.instructor}.
              </p>
            </div>

            <div className='d-flex align-items-end justify-content-around w-100'>
              <div>
                <p className='mb-0 Courses__certificateNormalText'>{state?.date}</p>
                <hr className='my-0' />
                <p className='mt-2 mb-0 Courses__certificateNormalText'>Date</p>
              </div>

              {/* <img src={clientLogo} alt={clientName} className='Courses__certificateLogo' /> */}

              <div style={{ marginTop: '120px' }}>
                <p className='mb-0 signature '>{state?.instructor}</p>

                <hr className='my-0' />
                <p className='mt-2 mb-0 Courses__certificateNormalText'>{state?.instructor}</p>
              </div>
            </div>
          </div>

          {/* <img className='Courses__certificateBody m-auto' src={background} /> */}
        </div>
      </div>
      <div className='w-100 text-center'>
        <Button
          style={{
            fontSize: '12px',
            position: 'relative',
            marginTop: '20px',
            minWidth: '200px',
          }}
          variant='customPrimary'
          onClick={downloadCertificate}
        >
          Download Certificate
        </Button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  currentbranding: getCurrentBranding(state),
});

export default connect(mapStateToProps, null)(Certificate);

Certificate.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.instanceOf(Object).isRequired,
    }),
  }).isRequired,
  currentbranding: PropTypes.shape({
    branding: PropTypes.shape({
      client_logo: PropTypes.string,
      client_color: PropTypes.string,
      client_icon: PropTypes.string,
      client_title: PropTypes.string,
      client_name: PropTypes.string,
    }),
  }).isRequired,
};
