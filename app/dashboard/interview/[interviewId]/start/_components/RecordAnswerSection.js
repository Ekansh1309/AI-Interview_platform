"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import toast from 'react-hot-toast';
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  useEffect(() => {
    results.map((result) =>
      setUserAnswer((prevAns) => prevAns + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      // if (userAnswer?.length < 10) {
      //   setLoading(false)
      //   toast("Error while saving your answer,please record again");
      //   return;
      // }
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);
      if(userAnswer.length>0){
        toast.success("Got your answer")
      }
      console.log(userAnswer, "########");
      const feedbackPrompt =
        "Question:" +
        mockInterviewQuestion[activeQuestionIndex]?.question +
        ", User Answer:" +
        userAnswer +
        ",Depends on question and user answer for given interview question " +
        " please give use rating for answer and feedback as area of improvement if any" +
        " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
      console.log(
        "🚀 ~ file: RecordAnswerSection.jsx:38 ~ SaveUserAnswer ~ feedbackPrompt:",
        feedbackPrompt
      );
      const result = await chatSession.sendMessage(feedbackPrompt);
      console.log(
        "🚀 ~ file: RecordAnswerSection.jsx:46 ~ SaveUserAnswer ~ result:",
        result
      );
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
  
      console.log(
        "🚀 ~ file: RecordAnswerSection.jsx:47 ~ SaveUserAnswer ~ mockJsonResp:",
        mockJsonResp
      );
      const JsonfeedbackResp = JSON.parse(mockJsonResp);
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });
  
      if (resp) {
        toast.success("Feedback recorded successfully");
        setUserAnswer("");
        setResults([]);
      }
      setResults([]);
      setLoading(false)

    } catch (error) {
      console.log("Error in Record Answer ")
    }

    ;
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
  return (
    <div className="flex justify-cente items-center flex-col">
      <div className="flex flex-col my-10 justify-center items-center bg-black rounded-lg p-5">

              {
                 webCamEnabled ?
                  (
                 <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  mirrored={true}
                  style={{ height: 300, width: "100%", zIndex: 10 }}
                /> 
              )
              :
                ( 
                  <Image
                      src={"/webcam.png"}
                      width={200}
                      height={200}
                      className=""
                      alt="webcam"
                      priority
                    />
                )

            }


            {  
              webCamEnabled ? 
              (
                  <Button
                  className="w-full"
                  // variant="ghost"
                  onClick={() =>{
                    setWebCamEnabled(false)
                    console.log("Web value ", webCamEnabled)
                  }}
              >
                  Disable Web Cam
              </Button>
              ) : 
              (
                <Button
                     className="w-full"
                     // variant="ghost"
                     onClick={() =>{
                       setWebCamEnabled(true)
                       console.log("Web value ", webCamEnabled)
                     }}
                     >
                     Enable Web Cam 
                 </Button>
              )
            }


      </div>
      <Button
        disabled={loading}
        variant="outline"
        className=""
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 items-center animate-pulse flex gap-2">
            <StopCircle /> Stop Recording...
          </h2>
        ) : (
          <h2 className="text-primary flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
      {/* <Button onClick={() => console.log("------", userAnswer)}>
        Show User Answer
      </Button> */}
    </div>
  );
};

export default RecordAnswerSection;