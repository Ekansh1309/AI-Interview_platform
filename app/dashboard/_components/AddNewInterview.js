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

        const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of experience: ${jobExperience}

          Based on above info, give me five interview questions with answers in json format.

          E.g - [
        {
          "question": "",
          "answer": ""
        },
        {
          "question": "",
          "answer": ""
        },
        {
          "question": "",
          "answer": ""
        },
        {
          "question": "",
          "answer": ""
        },
        {
          "question": "",
          "answer": ""
        }
        ]
          Give question and answer as field in json. Note: don't give me anything else not even comments.`;

        const result = await chatSession.sendMessage(inputPrompt)
        // console.log("Result : ",result.response.text())

        const MockResponse = result.response
          .text()
          .replace("```json", "")
          .replace("```", "");

          console.log("Mock Response ",MockResponse)


        setLoading(false)
        setJsonResponse(MockResponse)
        let jsonString = MockResponse

        if(jsonString){
            const res = await db.insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: jsonString,
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
