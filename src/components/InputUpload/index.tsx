import React, { FunctionComponent } from "react";
import { Box, Flex } from "rebass";
import styled from "styled-components";

interface PropsWithId {
  id?: string;
  file?: File;
  onClick: () => void;
}

const InputFile = styled.input.attrs({ type: "file" })`
  width: 180px;
  opacity: 0;
`;

const InputWrapper = styled(Box)`
  width: 180px;
  height: 30px;
  border: #000000 0.5px solid;
  border-radius: 5px;
  position: relative;
  background-color: #f1f1f1;
  :hover {
    border: #3656c7 0.5px solid;
    & > div {
      color: #3656c7;
    }
  }
`;

const InputText = styled(Box)`
  position: absolute;
  top: 3px;
  left: 26px;
  pointer-events: none;
`;

const FileName = styled(Box)`
  line-height: 2;
  padding-left: 8px;
`;

const InputUpload: FunctionComponent<PropsWithId> = ({
  id,
  onClick,
  file,
  ...props
}) => {
  return (
    <Flex>
      <InputWrapper mb={3} onClick={onClick}>
        <InputFile id={id} />
        <InputText>{props.children}</InputText>
      </InputWrapper>
      {file && <FileName>{file.name}</FileName>}
    </Flex>
  );
};

export default InputUpload;
