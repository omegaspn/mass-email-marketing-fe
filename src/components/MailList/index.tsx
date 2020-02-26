import React, { FunctionComponent, useState, useEffect } from "react";
import { Dictionary, EmailData } from "../../model";
import { Box, Flex, Text } from "rebass";
import { t } from "../../i18n";
import styled from "styled-components";
import { sendEmail } from "../../api/EmailApi";

interface MailListProps {
  emailList: EmailData[];
  bodyList: string[];
  subjectList: string[];
  rankDict: Dictionary;
  submitted: boolean;
  submittedCallback: (value: boolean) => void;
  successAllCallback: (success: boolean) => void;
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
  submittedCallback,
  successAllCallback
}) => {
  const [statusList, setStatusList] = useState(
    Array(emailList.length).fill(t.status.toSend)
  );
  const [statusListColor, setStatusListColor] = useState(
    Array(emailList.length).fill("#00000f")
  );
  const [syncSubmitted, setSyncSubmitted] = useState<Boolean>();

  const updateStatusListByCode = (code: number, index: number) => {
    if (code === 204) {
      statusListColor[index] = "#3F922A";
      statusList[index] = t.status.success;
    }
    // add new status code here in the future
    // (when requirement changes)

    setStatusList([...statusList]);
    setStatusListColor([...statusListColor]);

    const isSendMailSuccessAll = () =>
      statusList.every(
        status => status === statusList[0] && statusList[0] === t.status.success
      );
    // set flag when send all mail success
    successAllCallback(isSendMailSuccessAll());
  };

  const handleSendMail = () => {
    emailList.forEach(async (usr, index) => {
      try {
        const response = await sendEmail(
          emailList[index].email,
          bodyList[index],
          subjectList[index]
        );
        setSyncSubmitted(false);

        // pending response
        statusList[index] = t.status.sending;
        statusListColor[index] = "#3656C7";

        if (response.status !== 204) throw response;
        updateStatusListByCode(response.status, index);
      } catch (error) {
        const code = error.response && error.response.status;
        if (code === 400 || code === 500) {
          statusListColor[index] = "#ff0000";
          statusList[index] = t.status.failed;
          setStatusList([...statusList]);
          setStatusListColor([...statusListColor]);
        }
      }
    });
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
          <Text width={[1 / 3]} px={3} fontWeight="bold">
            {t.listHeader.email}
          </Text>
          <Text width={[1 / 3]} px={3} fontWeight="bold">
            {t.listHeader.message}
          </Text>
          <Text width={[1 / 3]} px={3} fontWeight="bold">
            {t.listHeader.status}
          </Text>
        </Row>
      </HeaderRow>
      <TableWrapper>
        {emailList.map((usr, index) => {
          return (
            <ContentRow key={index}>
              <Row>
                <Text width={[1, 1 / 3]} px={3}>
                  {usr.email}
                </Text>
                <Text width={[1, 1 / 3]} px={3}>
                  {subjectList[index]}
                  <br />
                  <br />
                  {bodyList[index]}
                  <br />
                  <br />
                </Text>
                <Text width={[1, 1 / 3]} px={3} color={statusListColor[index]}>
                  {statusList[index]}
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
