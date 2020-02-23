import React, { FunctionComponent, useState } from "react";
import { EmailList } from "../../model";
import { Box, Flex, Text, Button } from "rebass";
import { t } from "../../i18n";
import { rankMapper } from "../../utils/mapper";
import styled from "styled-components";
import { sendEmail } from "../../api/EmailApi";
import { getRankDict } from "../../utils/converter";
import axios, { AxiosResponse } from "axios";

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

const getEmailSubject = (usrName: string) => {
  return `${t.listMessage.greeting} ${usrName}`;
};

const getEmailBody = (reviewsLeft: number, nexRankId: number) => {
  return `
    ${t.listMessage.more}  
    ${reviewsLeft.toString()}
    ${t.listMessage.review}
    ${t.listMessage.nextRank}  
    ${rankMapper(getRankDict(), nexRankId)}
    ${t.listMessage.pleaseShare}  
    `;
};

const MailList: FunctionComponent<EmailList> = ({ email_list }) => {
  const emailSubjectList = Array(email_list.length);
  const emailBodyList = Array(email_list.length);
  const [statusList, setStatusList] = useState(
    Array(email_list.length).fill(t.status.toSend)
  );
  const [statusListColor, setStatusListColor] = useState(
    Array(email_list.length).fill("#00000f")
  );
  const [sendMailsSuccess, setSendMailsSuccess] = useState(false);

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
    setSendMailsSuccess(isSendMailSuccessAll);
  };

  const handleSendMail = () => {
    try {
      const requests: AxiosResponse<any>[] = [];

      email_list.map(async (usr, index) => {
        const response = await sendEmail(
          email_list[index].email,
          emailSubjectList[index],
          emailBodyList[index]
        );

        // pending resposne
        statusList[index] = t.status.sending;
        statusListColor[index] = "#3656C7";

        updateStatusListByCode(response.status, index);
        requests.push(response);
      });

      axios.all(requests);
    } catch (error) {
      const code = error.response && error.response.status;
      console.log(code);

      if (code === 400 || code === 500) {
        // statusListColor[index] = "#ff0000";
        // statusList[index] = t.status.failed;
        // setStatusList([...statusList]);
        // setStatusListColor([...statusListColor]);
      }
    }
  };

  const getButtonMessage = () => {
    if (sendMailsSuccess) return t.button.close;
    else if (statusList.includes(t.status.failed)) return t.button.resendMail;
    else return t.button.sendMail;
  };

  return (
    <Box>
      <HeaderRow>
        <Flex justifyContent="space-around">
          <Text width={1 / 3}>{t.listHeader.email}</Text>
          <Text width={1 / 3}>{t.listHeader.message}</Text>
          <Text width={1 / 3}>{t.listHeader.status}</Text>
        </Flex>
      </HeaderRow>
      <TableWrapper>
        {email_list.map((usr, index) => {
          return (
            <ContentRow key={index}>
              <Flex justifyContent="space-around">
                <Text width={1 / 3}>{usr.email}</Text>
                <Text width={1 / 3}>
                  {(emailSubjectList[index] = getEmailSubject(usr.user_name))}
                  <br />
                  <br />
                  {
                    (emailBodyList[index] = getEmailBody(
                      usr.reviews_left_to_uprank,
                      usr.user_next_rank_id
                    ))
                  }
                </Text>
                <Text width={1 / 3} color={statusListColor[index]}>
                  {statusList[index]}
                </Text>
              </Flex>
            </ContentRow>
          );
        })}
      </TableWrapper>
      <Button
        backgroundColor="#81CC75"
        onClick={sendMailsSuccess ? () => window.close() : handleSendMail}
      >
        {getButtonMessage()}
      </Button>
    </Box>
  );
};

export default MailList;
