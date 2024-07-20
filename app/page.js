"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    // code -r folder_name
    <div>
      <h1>Hello</h1>
      <Button 
      onClick={()=>{
        router.push('/dashboard')
      }} 
      >Go to Dashboard</Button>
    </div>
  );
}
