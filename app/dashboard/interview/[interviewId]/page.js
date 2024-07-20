"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Webcam from 'react-webcam'
import { WebcamIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Lightbulb } from 'lucide-react'

const Interview = ({params}) => {
    const [interviewData, setInterviewData] = useState([])
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    
    const GetInterviewDetails = async()=>{
      try {
        const result = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId,params.interviewId))
        console.log("InterviewDetails: ",result[0])
        setInterviewData(result[0]);
      } catch (error) {
        console.log("Error in DB Get Interview Details")
      }
        
    }
    
    useEffect(()=>{
        console.log(params.interviewId)
        GetInterviewDetails()
    },[])

  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Lets get started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col p-5  rounded-lg border gap-5">
            <h2 className="text-lg">
              <strong>Job Role/Job Position: </strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/tech Stack: </strong>
              {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>
          <div className="p-5 border-2 rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500 font-semibold">
                <Lightbulb />
              <span>Information</span>
            </h2>
            <h2 className="mt-3 text-yellow-500 font-semibold">
              <p>
                Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview. It has 5 questions which you have to answer and after submission, you will get the report on the basis of your answer.
                <br />
                NOTE: we won't record your video, you can disable webcam access at anytime if you want.
              </p>
            </h2>
          </div>
        </div>
        <div>

          {/* {webCamEnabled ? ( <> */}

          

          
            
            {
                 webCamEnabled ?
                  (
                 <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  mirrored={true}
                /> 
              ):
                ( 
                  <WebcamIcon className="h-72 my-7 border rounded-lg w-full p-20 bg-secondary" />
                )

            }



              {  
              !webCamEnabled ? (
                  <Button
                  className="w-full my-2"
                  // variant="ghost"
                  onClick={() =>{
                    setWebCamEnabled(true)
                    console.log("Web value ", webCamEnabled)
                  }}
              >
                  Enable Web Cam 
              </Button>
              ) : 
              (
                <Button
                     className="w-full my-2"
                     // variant="ghost"
                     onClick={() =>{
                       setWebCamEnabled(false)
                       console.log("Web value ", webCamEnabled)
                     }}
                     >
                     Disable Web Cam
                 </Button>
              )

  
              }
            
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  )
}

export default Interview
