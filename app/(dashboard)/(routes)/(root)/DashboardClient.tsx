"use client";

import React, { useEffect, useState } from "react";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { CheckCircle, Clock } from "lucide-react";
import InfoCard from "./_components/info-card";
import Avatar from "@/components/Avatar";
import {
  createAnonymousUser,
  fetchTemplates,
  createDraftAvatar,
  saveDraftAvatar,
  fetchFinalAvatar,
} from "@/services/apiService";

// Import the correct type
import { CourseWithProgressWithCategory } from "@/types"; // Adjust the path to match your project structure

export default function DashboardClient({ userId }: { userId: string }) {
  // Explicitly type the state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [courses, setCourses] = useState<{
    completedCourses: CourseWithProgressWithCategory[];
    coursesInProgress: CourseWithProgressWithCategory[];
  }>({
    completedCourses: [],
    coursesInProgress: [],
  });

  useEffect(() => {
    const loadCourses = async () => {
      const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);
      setCourses({ completedCourses, coursesInProgress });
    };

    const loadAvatar = async () => {
      try {
        const token = await createAnonymousUser();
        const templates = await fetchTemplates(token);
        const templateId = templates[0]?.id; // Use the first template
        const draftAvatarId = await createDraftAvatar(token, templateId);
        await saveDraftAvatar(token, draftAvatarId);
        const finalUrl = await fetchFinalAvatar(draftAvatarId);
        setAvatarUrl(finalUrl);
      } catch (error) {
        console.error("Error loading avatar:", error);
      }
    };

    loadCourses();
    loadAvatar();
  }, [userId]);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={courses.coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={courses.completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...courses.coursesInProgress, ...courses.completedCourses]} />
      {avatarUrl ? (
        <Avatar avatarUrl={avatarUrl} />
      ) : (
        <p>Loading your avatar...</p>
      )}
    </div>
  );
}
