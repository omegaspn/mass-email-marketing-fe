import React, { FunctionComponent } from "react";
import { Button } from "rebass";
import styled from "styled-components";

const UploadButton = styled(Button)`
  margin: 12px 0;
  color: #000000;
  border: #000000 0.5px solid;
`;

const InputUpload: FunctionComponent = props => {
  return <UploadButton>{props.children}</UploadButton>;
};

export default InputUpload;
