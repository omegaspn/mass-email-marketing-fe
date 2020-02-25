import React, { FunctionComponent, useState } from "react";
import { Box, Text, Button } from "rebass";
import { InputUpload } from "../../components";
import { t } from "../../i18n";
import { EmailData, Dictionary } from "../../model";
import MailList from "../../components/MailList";
import axios from "axios";
import { getRankDict, getEmailData } from "../../utils/converter";
import { rankMapper } from "../../utils/mapper";

const SendMail: FunctionComponent = () => {
  const [submitted, setSubmitted] = useState(false);
  const [buttonText, setButtonText] = useState(t.button.sendMail);
  const [rankDict, setRankDict] = useState<Dictionary>({});
  const [emailData, setEmailData] = useState<EmailData[]>([]);
  const [bodyList, setBodyList] = useState<string[]>([]);
  const [subjectList, setSubjectList] = useState<string[]>([]);

  const uploadApi = async (id: string) => {
    try {
      const csvfile = document.querySelector(id) as any;
      const uploadedFile = csvfile.files[0];
      if (uploadedFile) {
        const selectFileReponse = await axios.get(
          `${process.env.PUBLIC_URL}/data/${uploadedFile.name}`
        );
        const data = selectFileReponse.data;

        if (uploadedFile.name === "emails.csv")
          setEmailData(getEmailData(data));
        else if (uploadedFile.name === "ranks.csv")
          setRankDict(getRankDict(data));
        else console.log("please update emails.csv or ranks.csv");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEmailSubject = (usrName: string) => {
    return `${t.listMessage.greeting} ${usrName}`;
  };

  const getEmailBody = (reviewsLeft: number, nexRankId: number) => {
    return `
      ${t.listMessage.more}  
      ${reviewsLeft.toString()}
      ${t.listMessage.review}
      ${t.listMessage.nextRank}  
      ${rankMapper(rankDict, nexRankId)}
      ${t.listMessage.pleaseShare}  
      `;
  };

  const handleButton = () => {
    if (buttonText === t.button.close) {
      console.log("close app");
      return;
    }

    setSubmitted(true);
    const body_list: string[] = [];
    const subject_list: string[] = [];
    emailData.forEach(usr => {
      subject_list.push(getEmailSubject(usr.user_name));
      body_list.push(
        getEmailBody(usr.reviews_left_to_uprank, usr.user_next_rank_id)
      );
    });
    setBodyList(body_list);
    setSubjectList(subject_list);
  };

  return (
    <Box p={3}>
      <Text fontSize={4} fontWeight="bold" pb={3}>
        {t.title}
      </Text>
      <InputUpload
        id="input-id"
        onClick={() => {
          uploadApi("#input-id");
        }}
      >
        {t.inputs.emails}
      </InputUpload>
      <InputUpload
        id="input-rank"
        onClick={() => {
          uploadApi("#input-rank");
        }}
      >
        {t.inputs.ranks}
      </InputUpload>

      <MailList
        emailList={emailData}
        bodyList={bodyList}
        subjectList={subjectList}
        rankDict={rankDict}
        submitted={submitted}
        submittedCallback={value => setSubmitted(value)}
        successAllCallback={success => {
          if (success) setButtonText(t.button.close);
          else setButtonText(t.button.resendMail);
        }}
      />

      <Button backgroundColor="#81CC75" onClick={handleButton}>
        {buttonText}
      </Button>
    </Box>
  );
};

export default SendMail;
