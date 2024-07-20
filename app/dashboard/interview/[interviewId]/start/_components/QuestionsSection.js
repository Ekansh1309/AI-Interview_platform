"use client"
import React from 'react'
import { Lightbulb, Volume2 } from 'lucide-react'

import { toast } from "react-hot-toast"

const QuestionsSection = ({mockInterviewQuestion,activeQuestionIndex,interviewData}) => {

  const textToSpeach=(text)=>{
    
    if('speechSynthesis' in window){
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech)
    }else{
        toast.error("Sorry, your browser does not support text to speech")
    }
  }


  return (
    <div>
      {
        mockInterviewQuestion ? 
        (
        <div className='p-5 border rounded-lg my-10'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
              {
              mockInterviewQuestion.length>0 ? 
              (
                mockInterviewQuestion.map((question,index)=>(
                  <h2 className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'bg-blue-700 text-white'}`}>Question #{index+1}</h2>
                ))
              ) :
              (
                <div className='spinner'></div>
              )
            }
          </div>
              {
                mockInterviewQuestion ? 
                (
                  <h2 className='my-5 text-md md:text-lg'>
                    {mockInterviewQuestion[activeQuestionIndex]?.question}
                  </h2>
                ):
                (<div className='spinner'></div>)
              }
              
              <Volume2 className='cursor-pointer' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
              
              <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
                  <h2 className='flex gap-2 items-center text-primary'>
                      <Lightbulb/>
                      <strong>Note:</strong>
                  </h2>
                  <h2 className='text-sm font-bold text-primary my-2'>Click on record answer when you want to answer the question. At the end of the interview, we will give you the feedback along with the correct way to answer each question. You can compare your answer.
                    <br/>
                    Make sure to record in high and clear note
                    <br/>
                    After record, please wait for some time to save the data before moving to next question
                     </h2>
              </div>
        </div>
        ) : 
        
        (
        <div className="spinner"></div>
        )
      }
      
    </div>
  )
}

export default QuestionsSection
