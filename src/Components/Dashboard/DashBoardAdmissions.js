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
      labels: {
        show: false,
      },
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
        style={{ backgroundColor: '#F5F7FF' }}
        className='Dashboard__noticeBoard admission_cards m-3 p-3 mt-3'
        onKeyDown={() => handleClick()}
        onClick={() => handleClick()}
        role='button'
        tabIndex={0}
      >
        {/* <span className='Dashboard__verticalDots'>
          <MoreVertIcon />
        </span> */}
        <Row className='my-2 mx-3'>
          <p className='Dashboard__todaysHitsText p-0 mb-3'>Admissions</p>
        </Row>
        <div
          onClick={() => goToAdmissions()}
          role='button'
          tabIndex={-1}
          onKeyDown={() => goToAdmissions()}
          className='mx-3 d-flex w-100'
        >
          <p className='admissionsSubHeading mb-0'>
            Manage all of your institute users here: Students, Teachers and Admins
          </p>
          <img
            src={heroImage}
            className='admissionImage'
            // style={{ maxWidth: '55px', position: 'relative', top: '-29px' }}
            alt='admissions'
          />
        </div>
        <div className='addUserBatchContainer mx-2 mb-4 px-0 pb-2'>
          <div className='text-center mt-3 mr-3 p-0'>
            <Button
              variant='noticeBoardPost'
              className='admission_button'
              onClick={(e) => {
                e.stopPropagation();
                openOptionsModal();
              }}
            >
              <PersonAddIcon className='personAddIcon' />
              <span className='ml-2'>Add User</span>
            </Button>
          </div>
          <div className='text-center mt-3 p-0'>
            <Button
              variant='noticeBoardPost'
              className='admission_button'
              onClick={(e) => {
                e.stopPropagation();
                goToAddBatch();
              }}
            >
              <PersonAddIcon className='personAddIcon' />
              <span className='ml-2'>Add Batch</span>
            </Button>
          </div>
        </div>
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
              <Card key={elem.title} className='my-3 mx-2 chartContainer'>
                <div className='px-2 react_chart'>
                  <div className='text-center NumberOfUserContainer p-2 my-auto'>
                    <p
                      className='Dashboard__attendanceSubHeading'
                      style={{ fontFamily: 'Montserrat-SemiBold' }}
                    >
                      {elem.title}
                    </p>
                    <p className='Dashboard__admissionsBlueText my-auto'>
                      {elem.pending + elem.active}
                    </p>
                  </div>
                  <div style={{ width: '60%' }}>
                    <ReactApexCharts options={options} series={series} type='bar' />
                  </div>
                </div>
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
