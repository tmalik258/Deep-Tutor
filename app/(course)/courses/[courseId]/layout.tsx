import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";
import CourseNavbar from "./_components/course-navbar";
import { Suspense } from "react";
import Loading from "./_components/loading";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/dashboard");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/dashboard");
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="bg-gradient-to-r from-violet-200 to-white min-h-screen">
      <div className="h-[50px] left-[16.5rem] rounded-xl shadow-xl fixed top-5 right-5 bg-white inset-y-0 inset-x-16 z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex w-56 flex-col fixed inset-y-5 rounded-xl left-5 bg-white shadow-xl z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-[16.5rem] pr-5 pt-[90px] h-full">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
};

export default CourseLayout;
