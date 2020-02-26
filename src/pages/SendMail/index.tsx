import React, { FunctionComponent, useState } from "react";
import { Box, Text, Button, Flex } from "rebass";
import { InputUpload } from "../../components";
import { t } from "../../i18n";
import { EmailData, Dictionary } from "../../model";
import MailList from "../../components/MailList";
import axios from "axios";
import { getRankDict, getEmailData } from "../../utils/converter";
import { rankMapper } from "../../utils/mapper";

const SendMail: FunctionComponent = () => {
  const [submitted, setSubmitted] = useState(false);
  const [showMailList, setShowMailList] = useState(false);
  const [buttonText, setButtonText] = useState(t.button.sendMail);

  // dict
  const [rankDict, setRankDict] = useState<Dictionary>({});

  // data for display on MailList
  const [emailData, setEmailData] = useState<EmailData[]>([]);
  const [bodyList, setBodyList] = useState<string[]>([]);
  const [subjectList, setSubjectList] = useState<string[]>([]);

  // csv file
  const [emailFile, setEmailFile] = useState<File>();
  const [rankFile, setRankFile] = useState<File>();

  const uploadFile = (id: string): File => {
    const csvfile = document.querySelector(id) as any;
    const uploadedFile = csvfile.files[0];
    return uploadedFile;
  };

  const getEmailSubject = (usrName: string) => {
    return `${t.listMessage.greeting} ${usrName}`;
  };

  const getEmailFile = async () => {
    try {
      if (emailFile) {
        const selectFileReponse = await axios.get(
          `${process.env.PUBLIC_URL}/data/${emailFile.name}`
        );
        const data = selectFileReponse.data;
        setEmailData(getEmailData(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRankFile = async () => {
    try {
      if (rankFile) {
        const selectFileReponse = await axios.get(
          `${process.env.PUBLIC_URL}/data/${rankFile.name}`
        );
        const data = selectFileReponse.data;
        setRankDict(getRankDict(data));
      }
    } catch (error) {
      console.log(error);
    }
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
    try {
      if (buttonText === t.button.close) {
        console.log("close app");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyUploaded = () => {
    getEmailFile();
    getRankFile();

    if (rankFile && emailFile) {
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

      setShowMailList(true);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize={4} fontWeight="bold" pb={3}>
        {t.title}
      </Text>
      <InputUpload
        id="input-email"
        onClick={() => {
          setEmailFile(uploadFile("#input-email"));
        }}
        file={emailFile}
      >
        {t.inputs.emails}
      </InputUpload>

      <InputUpload
        id="input-rank"
        onClick={() => {
          setRankFile(uploadFile("#input-rank"));
          verifyUploaded();
        }}
        file={rankFile}
      >
        {t.inputs.ranks}
      </InputUpload>
      {showMailList && (
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
      )}
      <Flex justifyContent="center">
        {showMailList && (
          <Button
            p={"12px 36px"}
            backgroundColor="#81CC75"
            onClick={handleButton}
            style={{ fontFamily: "Prompt" }}
          >
            {buttonText}
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default SendMail;
