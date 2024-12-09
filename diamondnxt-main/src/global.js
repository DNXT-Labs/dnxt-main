import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    body {
      margin: 0; line-height: normal;
    }
:root {

/* fonts */
--font-inter: Inter;
--text-small-text: Mulish;

/* font sizes */
--text-small-text-size: 12px;
--chart-titles-chart-title-m-size: 16px;
--font-size-5xl: 24px;
--chart-titles-chart-title-l-size: 18px;

/* Colors */
--white: #fff;
--gray: #ececec;
--dark-theme-green: #2bebc8;
--black: #000;
--grayscale-black: #252733;

/* Gaps */
--gap-5xs: 8px;
--gap-lg: 18px;
--gap-mini: 15px;
--gap-4xs: 9px;

/* Paddings */
--padding-5xl: 24px;
--padding-xs: 12px;
--padding-lg: 18px;

/* Border radiuses */
--br-5xs: 8px;
--br-35xl: 54px;

}
`;
