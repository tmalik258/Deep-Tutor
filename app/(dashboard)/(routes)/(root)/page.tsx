"use client";

import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import {
  getDashboardCourses,
  CourseWithProgressWithCategory,
} from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import InfoCard from "./_components/info-card";
import { InteractiveAvatar } from "@/components/InteractiveAvatar";
import { useAuth } from "@clerk/nextjs";

export default function Dashboard() {
  
  const [completedCourses, setCompletedCourses] = useState<
    CourseWithProgressWithCategory[]
  >([]);
  const [coursesInProgress, setCoursesInProgress] = useState<
    CourseWithProgressWithCategory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userId } = useAuth();

  useEffect(() => {
    // If there's no userId, we can't proceed with data fetching
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Load courses first
        const { completedCourses, coursesInProgress } =
          await getDashboardCourses(userId);
        setCompletedCourses(completedCourses);
        setCoursesInProgress(coursesInProgress);

      
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // Early return for no userId
  if (!userId) {
    return redirect("/");
  }

  // Render loading state or content
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-4">
    <InteractiveAvatar />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
      
    </div>
  );
}
