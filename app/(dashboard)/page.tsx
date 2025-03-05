import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import CreateTranscationDialog from "./_components/CreateTranscationDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";
import { getGeminiFeedback } from "@/lib/gemini";

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!userSettings) {
    redirect("/wizard");
  }

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGetFeedback = async () => {
    try {
      const feedbackData = await getGeminiFeedback(user.id);
      setFeedback((feedbackData as { message: string }).message);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      setFeedback("Failed to fetch feedback. Please try again later.");
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-5">
          <p className="text-3xl font-bold">Hello, {user.firstName}! 👋🏻</p>
          <div className="flex items-center gap-3">
            <CreateTranscationDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 "
                >
                  New income 🤑
                </Button>
              }
              type="income"
            />
            <CreateTranscationDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 "
                >
                  New Expense 😥
                </Button>
              }
              type="expense"
            />
            <Button
              variant={"outline"}
              className="border-blue-500 bg-blue-950 text-white hover:bg-blue-700"
              onClick={handleGetFeedback}
            >
              Get Feedback
            </Button>
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
      {feedback && (
        <div className="container mt-6">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">Feedback</h2>
            <p>{feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;