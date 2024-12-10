import React, { useEffect, useState } from "react";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/info-card";
import Avatar from "@/components/Avatar";
import {
  createAnonymousUser,
  fetchTemplates,
  createDraftAvatar,
  saveDraftAvatar,
  fetchFinalAvatar,
} from "@/services/apiService";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

  // State to store the dynamically created avatar URL
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
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

    loadAvatar();
  }, []);

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

