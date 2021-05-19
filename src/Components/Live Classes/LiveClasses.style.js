import { css } from '@emotion/react';
import { colors, fonts, spacer } from '../../JsStyles/variable';

const LiveClassesStyle = {
  liveClasses: css`
    height: 100vh;
    overflow: scroll;
    overflow-x: hidden;
  `,
  card: css`
    width: 90%;

    @media (min-width: 768px) {
      width: 75%;
    }
  `,

  show: css`
    position: absolute;
    top: 10%;
    right: 3%;
    color: ${fonts.disabledGrey};
  `,
  adminHeading: css`
    font-family: ${fonts.semiBold};
  `,

  adminCard: css`
    border: 1px solid ${colors.disabledGrey};
    border-radius: 5px;
  `,
  adminCardTime: css`
    font-size: ${spacer * 0.875}rem;
    font-family: ${fonts.regular};
    color: ${colors.disabledGrey};
  `,

  adminDuration: css`
    font-size: ${spacer * 0.75}rem;
    font-family: ${fonts.regular};
    color: ${colors.dashboardGrey};
    font-weight: 700;
  `,

  adminDurationSpan: css`
    color: var(--primary-blue);
  `,

  adminBatches: css`
    font-size: ${spacer * 0.75}rem;
    font-family: ${fonts.regular};
    color: ${colors.dashboardGrey};
    font-weight: 700;
  `,

  adminBatchesSpan: css`
    font-size: ${spacer * 0.875}rem;
    color: ${colors.headingGrey};
  `,

  passcode: css`
    font-size: ${spacer * 2}rem;
    font-family: ${fonts.bold};
    color: ${colors.lightGrey};
  `,
};

export default LiveClassesStyle;
