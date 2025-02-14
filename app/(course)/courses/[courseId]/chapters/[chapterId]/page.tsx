import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import InteractiveAvatar from "@/components/InteractiveAvatar"; // Import the InteractiveAvatar component

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!course || !chapter) {
    return redirect("/dashboard");
  }

  const isLocked = !chapter.isFree && !purchase;
  // const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  // If there's no playback ID, we should handle that case
  if (!muxData?.playbackId) {
    return (
      <div>
        <Banner
          variant="warning"
          label="This chapter's video is not available."
        />
      </div>
    );
  }

  // Get the PDF content from the attachments
  const pdfAttachment = attachments ? attachments[0] : null;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          {/* <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          /> */}
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    key={attachment.id}
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Render the InteractiveAvatar component for Chapter 1 */}
        {pdfAttachment && (
          <div className="p-4">
            <InteractiveAvatar pdfContent={pdfAttachment.url} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
