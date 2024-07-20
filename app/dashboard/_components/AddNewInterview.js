"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from "lucide-react";
import { db } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from "moment";
import { MockInterview } from '@/utils/schema';
import { useRouter } from 'next/navigation';

const AddNewInterview = () => {
    const [openDialog,setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [jsonResponse, setJsonResponse] = useState([]);
    const [loading, setLoading] = useState(false);
    const {user} = useUser()
    const router = useRouter()

    // console.log("User: ",user)

    const onSubmit = async(e)=>{
        setLoading(true)
        e.preventDefault();
        // console.log(jobPosition,jobDescription,jobExperience)

        const inputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}, Depends on Job Position, Job Description and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} Interview questions along with answer in JSON format,  Give us an array of objects contain question and answer field on JSON,Make sure each object have question and answer field. Data must be in this format:
        {
          "question": "Your question here",
          "answer": "Your answer here"
        }`;

        const result = await chatSession.sendMessage(inputPrompt)
        console.log("Result : ",result.response.text())
        let resultText =  result.response.text()
        resultText = resultText.replace('```json','')
        let arr = resultText.split('```')[0]
        console.log(arr)
        let jsonString = JSON.parse(arr)
        console.log(jsonString )
        setLoading(false)
        setJsonResponse(jsonString)

        if(jsonString){
            const res = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: JSON.stringify(jsonString),
            jobPosition: jobPosition,
            jobDesc: jobDescription,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-YYYY'),
          }).returning({mockId:MockInterview.mockId})
          console.log("Inserted Id : ",res)

          if(res){
            setOpenDialog(false)
            router.push(`/dashboard/interview/${res[0]?.mockId}`)
          }
          
        }
        else{
            console.log("ERROR IN DB INSERTION")
        }

    }


    // 
  return (
    <div>
    <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      onClick={() => setOpenDialog(true)}
    >
      <h1 className="font-bold text-lg text-center">+ Add New</h1>
    </div>
  
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Tell us more about your job Interviewing
          </DialogTitle>
        </DialogHeader>
        <div>
          <p>
            Add details about your job position/role, job description, and
            years of experience
          </p>
          <DialogDescription>
            <form onSubmit={onSubmit}>
              <div className="mt-7 my-3">
                <Label htmlFor='role'>Job Role/Job Position</Label>
                <Input
                  placeholder="Ex. Full Stack Developer"
                  required
                  id='role'
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>
  
              <div className="my-3">
                <Label htmlFor='description'>Job Description/Tech Stack (In short)</Label>
                <Textarea
                  placeholder="Ex. React, Angular, NodeJs, MySql etc"
                  required
                  id='description'
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
  
              <div className="my-3">
                <Label htmlFor='experience'>Years of Experience</Label>
                <Input
                  placeholder="Ex. 5"
                  type="number"
                  min="1"
                  max="70"
                  required
                  id='experience'
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Generating from AI
                    </>
                  ) : (
                  'Start Interview'
                  )} 
                </Button>
              </div>
            </form>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  
  )
}

export default AddNewInterview
