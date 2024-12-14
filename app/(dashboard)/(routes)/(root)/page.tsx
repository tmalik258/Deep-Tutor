"use client";

import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";

import {
  getDashboardCourses,
  CourseWithProgressWithCategory,
} from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import InfoCard from "./_components/info-card";
import Avatar from "@/components/Avatar";
import {
  createAnonymousUser,
  fetchTemplates,
  createDraftAvatar,
  saveDraftAvatar,
  fetchFinalAvatar,
} from "@/services/apiService";

export default function Dashboard() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [completedCourses, setCompletedCourses] = useState<
    CourseWithProgressWithCategory[]
  >([]);
  const [coursesInProgress, setCoursesInProgress] = useState<
    CourseWithProgressWithCategory[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userId } = auth();

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

        // Then load avatar
        const token = await createAnonymousUser();
        const templates = await fetchTemplates(token);
        const templateId = templates[0]?.id; // Use the first template
        const draftAvatarId = await createDraftAvatar(token, templateId);
        await saveDraftAvatar(token, draftAvatarId);
        const finalUrl = await fetchFinalAvatar(draftAvatarId);
        setAvatarUrl(finalUrl);
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
      {avatarUrl ? (
        <Avatar avatarUrl={avatarUrl} />
      ) : (
        <p>Loading your avatar...</p>
      )}
    </div>
  );
}
