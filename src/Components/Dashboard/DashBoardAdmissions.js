import React from 'react';
import PropTypes from 'prop-types';
import ReactApexCharts from 'react-apexcharts';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const DashBoardAdmissions = (props) => {
  const { admissions, goToAdmissions, openOptionsModal, goToAddBatch, heroImage } = props;

  const options = {
    legend: {
      show: false,
    },
    colors: ['var(--primary-blue)', 'rgba(0, 0, 0, 0.54)'],
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    fill: {
      colors: ['var(--primary-blue)', 'rgba(0, 0, 0, 0.54)'],
    },
    grid: { show: false },

    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Active', 'Inactive'],
    },
  };
  const handleClick = () => {
    goToAdmissions();
  };

  return (
    <div className='mx-auto d-flex justify-content-center'>
      <div
        className='Dashboard__noticeBoard admission_cards m-3 p-3 mt-3'
        onKeyDown={() => handleClick()}
        onClick={() => handleClick()}
        role='button'
        tabIndex={0}
      >
        <span className='Dashboard__verticalDots'>
          <MoreVertIcon />
        </span>
        <Row className='m-2'>
          <p className='Dashboard__todaysHitsText p-0'>Admissions</p>
        </Row>
        <div
          onClick={() => goToAdmissions()}
          role='button'
          tabIndex='-1'
          onKeyDown={() => goToAdmissions()}
          className='admission_heroImage'
        >
          <img
            src={heroImage}
            className='img-fluid'
            style={{ maxWidth: '200px' }}
            alt='yourcoaching'
          />
        </div>
        <Row className='justify-content-center m-2 mb-4 p-2'>
          <Col className='text-center mt-3 p-0'>
            <Button
              variant='noticeBoardPost'
              className='admission_button'
              onClick={(e) => {
                e.stopPropagation();
                openOptionsModal();
              }}
            >
              <PersonAddIcon />
              <span>Add User</span>
            </Button>
          </Col>
          <Col className='text-center mt-3 p-0'>
            <Button
              variant='noticeBoardPost'
              className='admission_button'
              onClick={(e) => {
                e.stopPropagation();
                goToAddBatch();
              }}
            >
              <PersonAddIcon />
              <span>Add Batch</span>
            </Button>
          </Col>
        </Row>
        <div
          onClick={() => goToAdmissions()}
          role='button'
          tabIndex='-1'
          onKeyDown={() => goToAdmissions()}
          className='admission_charts'
        >
          {[
            {
              title: 'Student',
              active: admissions.active_students,
              pending: admissions.pending_students,
            },
            {
              title: 'Teacher',
              active: admissions.active_teachers,
              pending: admissions.pending_teachers,
            },
            {
              title: 'Admin',
              active: admissions.active_admins,
              pending: admissions.pending_admins,
            },
          ].map((elem) => {
            const series = [
              {
                data: [elem.active, elem.pending],
              },
            ];
            return (
              <Card key={elem.title} className='my-3 mx-2'>
                <Row className='p-2 react_chart'>
                  <Col xs={4} className='text-center p-2 my-auto'>
                    <p
                      className='Dashboard__attendanceSubHeading'
                      style={{ fontFamily: 'Montserrat-SemiBold' }}
                    >
                      {elem.title}
                    </p>
                    <p className='Dashboard__admissionsBlueText my-auto'>
                      {elem.pending + elem.active}
                    </p>
                  </Col>
                  <Col xs={8}>
                    <ReactApexCharts options={options} series={series} type='bar' />
                  </Col>
                </Row>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashBoardAdmissions;

DashBoardAdmissions.propTypes = {
  admissions: PropTypes.instanceOf(Object).isRequired,
  goToAdmissions: PropTypes.func.isRequired,
  goToAddBatch: PropTypes.func.isRequired,
  openOptionsModal: PropTypes.func.isRequired,
  heroImage: PropTypes.string.isRequired,
};
