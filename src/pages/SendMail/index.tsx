import React, { FunctionComponent } from "react";
import { Box, Text } from "rebass";
import { InputUpload } from "../../components";
import { t } from "../../i18n";
import { EmailData } from "../../model";
import MailList from "../../components/MailList";

const SendMail: FunctionComponent = () => {
  const mockData: EmailData[] = [
    {
      email: "pear@gmail.com",
      user_name: "แพรกินจุ",
      user_next_rank_id: 3,
      reviews_left_to_uprank: 3
    },
    {
      email: "lilypup@gmail.com",
      user_name: "ลิลลี่พาไป",
      user_next_rank_id: 6,
      reviews_left_to_uprank: 10
    }
  ];
  return (
    <Box p={3}>
      <Text fontSize={4} fontWeight="bold" pb={3}>
        {t.title}
      </Text>
      <Box>
        <InputUpload>{t.inputs.emails}</InputUpload>
      </Box>
      <Box>
        <InputUpload>{t.inputs.ranks}</InputUpload>
      </Box>
      <MailList email_list={mockData}></MailList>
    </Box>
  );
};

export default SendMail;
