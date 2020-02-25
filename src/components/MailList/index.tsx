import React, { FunctionComponent, useState, useEffect } from "react";
import { Dictionary, EmailData } from "../../model";
import { Box, Flex, Text } from "rebass";
import { t } from "../../i18n";
import { rankMapper } from "../../utils/mapper";
import styled from "styled-components";
import { sendEmail } from "../../api/EmailApi";

interface MailListProps {
  emailList: EmailData[];
  bodyList: string[];
  subjectList: string[];
  rankDict: Dictionary;
  submitted: boolean;
  submittedCallback: (value: boolean) => void;
}

const TableWrapper = styled(Box)`
  & :last-child {
    border-bottom: none;
  }
`;

const HeaderRow = styled(Box)`
  padding: 16px;
  border-bottom: #f1e5e5 1px solid;
`;

const ContentRow = styled(Box)`
  padding: 16px;
  border-bottom: #f8f0f0 1px solid;
`;

const Row = styled(Flex)`
  justify-content: space-around;
  flex-wrap: wrap;
`;

const MailList: FunctionComponent<MailListProps> = ({
  emailList,
  bodyList,
  subjectList,
  rankDict,
  submitted,
  submittedCallback
}) => {
  const [statusList, setStatusList] = useState(Array(emailList.length));
  const [statusListColor, setStatusListColor] = useState(
    Array(emailList.length).fill("#00000f")
  );
  const [syncSubmitted, setSyncSubmitted] = useState<Boolean>();

  const updateStatusListByCode = (code: number, index: number) => {
    if (code === 204) {
      statusListColor[index] = "#3F922A";
      statusList[index] = t.status.success;
    }

    setStatusList([...statusList]);
    setStatusListColor([...statusListColor]);

    const isSendMailSuccessAll = () =>
      statusList.every(
        status => status === statusList[0] && statusList[0] === t.status.success
      );
    // set flag when send all mail success
    // setSendMailsSuccess(isSendMailSuccessAll);
  };

  const handleSendMail = () => {
    emailList.forEach(async (usr, index) => {
      try {
        setSyncSubmitted(false);

        const response = await sendEmail(
          emailList[index].email,
          bodyList[index],
          subjectList[index]
        );

        // pending resposne
        statusList[index] = t.status.sending;
        statusListColor[index] = "#3656C7";

        updateStatusListByCode(response.status, index);
      } catch (error) {
        const code = error.response && error.response.status;

        if (code === 400 || code === 500) {
          console.log(code);

          // statusListColor[index] = "#ff0000";
          // statusList[index] = t.status.failed;
          // setStatusList([...statusList]);
          // setStatusListColor([...statusListColor]);
        }
      }
    });

    // axios.all(requests);
  };

  if (syncSubmitted) {
    handleSendMail();
  } else {
    submittedCallback(false);
  }

  useEffect(() => {}, [emailList]);
  useEffect(() => {}, [bodyList]);
  useEffect(() => {}, [subjectList]);
  useEffect(() => {}, [rankDict]);
  useEffect(() => {
    setSyncSubmitted(submitted);
  }, [submitted]);

  return (
    <Box>
      <HeaderRow>
        <Row>
          <Text width={[1, 1 / 3]}>{t.listHeader.email}</Text>
          <Text width={[1, 1 / 3]}>{t.listHeader.message}</Text>
          <Text width={[1, 1 / 3]}>{t.listHeader.status}</Text>
        </Row>
      </HeaderRow>
      <TableWrapper>
        {emailList.map((usr, index) => {
          return (
            <ContentRow key={index}>
              <Row>
                <Text width={[1, 1 / 3]}>{usr.email}</Text>
                <Text width={[1, 1 / 3]}>
                  {subjectList[index]}
                  <br />
                  <br />
                  {bodyList[index]}
                </Text>
                <Text width={[1, 1 / 3]} color={statusListColor[index]}>
                  {t.status.toSend}
                  {/* {statusList[index]} */}
                </Text>
              </Row>
            </ContentRow>
          );
        })}
      </TableWrapper>
    </Box>
  );
};

export default MailList;
