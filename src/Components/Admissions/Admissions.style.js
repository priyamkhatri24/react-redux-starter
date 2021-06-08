import { css } from '@emotion/react';
import { colors, fonts, spacer } from '../../JsStyles/variable';

const AdmissionStyle = {
  card: css`
    border-radius: 5px;
    border: 1px solid ${colors.dashboardGreyLight};
    margin: 0.75rem;
  `,

  smallHeading: css`
    font-size: ${spacer * 0.75}rem;
    font-family: ${fonts.regular};
    line-height: 15px;
    color: ${colors.dashboardBlack};
  `,

  scrollable: css`
    background-color: #fff;
    min-width: 100%;
    min-height: 40px;
    display: flex;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  `,

  questionBubble: css`
    min-width: 40px;
    min-height: 40px;
    margin: 5px;
    font-size: ${spacer * 0.875}rem;
    font-family: ${fonts.regular};
    color: $white;
    background-color: var(--lighter-blue);
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;

    @media (min-width: 768px) {
      min-width: 50px;
    }
  `,

  subjectBubble: css`
    min-width: 120px;
    min-height: 30px;
    margin: 5px;
    font-size: ${spacer * 0.875}rem;
    font-family: ${fonts.regular};
    border-radius: 50px;

    display: flex;
    justify-content: center;
    align-items: center;

    @media (min-width: 768px) {
      min-width: 50px;
    }
  `,

  selected: css`
    background-color: var(--lighter-blue);
    color: ${colors.white};
  `,

  unselected: css`
    color: ${colors.dashboardBlack};
    background-color: ${colors.white};
    border: 1px solid ${colors.dashboardGrey};
  `,

  onlineIcon: css`
    transform: scale(0.5);
    color: ${colors.dialerBlack};
  `,

  avatarHeading: css`
    font-family: 'Montserrat-SemiBold';
    font-size: ${spacer * 0.75}rem;
    padding-bottom: 3px;

    @media (min-width: 768px) {
      font-size: ${spacer * 0.8}rem;
    }
  `,

  avatarStatus: css`
    font-family: 'Montserrat-Light';
    font-size: ${spacer * 0.625}rem;

    @media (min-width: 768px) {
      font-size: ${spacer * 0.7}rem;
    }
  `,

  avatar: css`
    border-radius: 50%;
  `,

  subHeading: css`
    font-size: ${spacer * 0.625}rem;
    font-family: 'Montserrat-Light';
    color: ${colors.headingGrey};
    line-height: 13px;
  `,

  batchStudents: css`
    color: ${colors.black};
    font-size: ${spacer * 1.5}rem;
    opacity: 0.16;
    font-family: ${fonts.bold};
  `,

  overlay: css`
    position: fixed;
    margin-top: ${spacer * 5}rem;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 95vh;
    background-color: ${colors.white};
    overflow: scroll;
    box-shadow: 0px -5px 6px 0px rgba(0, 0, 0, 0.16);
    border-radius: 20px 20px 0 0;
    padding-bottom: 20px;
  `,

  amount: css`
    font-size: ${spacer}rem;
    line-height: 19px;
    color: ${colors.black};
    font-family: ${fonts.regular};
    margin: 1.5rem;
    width: 100%;
    padding-bottom: 10px;

    @media (min-width: 768px) {
      width: 75%;
      margin: auto;
    }
  `,

  box: css`
    border: 1px solid ${colors.dashboardGreyLight};
    border-radius: 5px;
  `,

  verticalDots: css`
    position: absolute;
    top: 15px;
    right: 5px;
  `,

  batchName: css`
    font-size: ${spacer * 1}rem;
    font-family: ${fonts.semiBold};
    color: ${colors.black};

    @media (max-width: 768px) {
      font-size: ${spacer * 0.75}rem;
    }
  `,

  students: css`
    font-size: ${spacer * 0.625}rem;
    font-family: ${fonts.light};
  `,

  adminCard: css`
    border: 1px solid ${colors.disabledGrey};
    border-radius: 5px;
  `,

  UserCards: css`
    height: '65vh';
    overflow: 'scroll';
    width: 100%;

    @media (min-width: 768px) {
      width: 80%;
      margin: auto;
    }
  `,
  headerButtons: css`
    font-size: 1rem;
    width: 16rem;
    height: 2.125rem;
    @media (max-width: 768px) {
      width: 8.4375rem;
      height: 2.125rem;
    }
    @media (max-width: 300px) {
      font-size: 0.75rem;
    }
  `,
  horizonatalLine: css`
    border-top: 6px solid rgba(0, 0, 0, 0.1);
    width: 30%;

    @media (max-width: 768px) {
      border-top: 5px solid rgba(0, 0, 0, 0.1);
      width: 25%;
    }
  `,
  batchImg: css`
    height: 70px;
    width: 70px;

    @media (max-width: 768px) {
      height: 50px;
      width: 50px;
    }
  `,
};

export default AdmissionStyle;
