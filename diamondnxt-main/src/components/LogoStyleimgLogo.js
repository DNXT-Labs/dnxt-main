import styled from "styled-components";

const FrameIcon = styled.img`
  position: relative;
  width: 84px;
  height: 22px;
  object-fit: cover;
`;
const LogoStyleimglogoRoot = styled.div`
  width: 200px;
  height: 71px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--padding-5xl);
  box-sizing: border-box;
`;

const LogoStyleimgLogo = () => {
  return (
    <LogoStyleimglogoRoot>
      <FrameIcon alt="" src="/frame@2x.png" />
    </LogoStyleimglogoRoot>
  );
};

export default LogoStyleimgLogo;
