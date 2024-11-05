import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "./_components/video-player";
<<<<<<< HEAD
import CourseEnrollButton from "./_components/course-enroll-button";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
=======
import {CourseProgressButton} from "./_components/course-progress-button";
>>>>>>> 37eb509 (add courses functionality)

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
		return redirect("/");
	}

	const isLocked = !chapter.isFree && !purchase;
	const completeOnEnd = !!purchase && !userProgress?.isCompleted;

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

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner
					variant="success"
					label="You already completed this chapter."
				/>
			)}
			{isLocked && (
				<Banner
					variant="warning"
					label="You need to purchase this course to watch this chapter."
				/>
			)}
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4">
					<VideoPlayer
						chapterId={params.chapterId}
						title={chapter.title}
						courseId={params.courseId}
						nextChapterId={nextChapter?.id}
						playbackId={muxData.playbackId}
						isLocked={isLocked}
						completeOnEnd={completeOnEnd}
					/>
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">
							{chapter.title}
						</h2>
<<<<<<< HEAD
						{purchase ? (
							<div>{/* // TODO: Add CourseProgressButton */}</div>
=======
						{ {purchase ? (
							<CourseProgressButton
							chapterId={params.chapterId}
							courseId={params.courseId}
							nextChapterId={nextChapter?.id}
							isCompleted={!!userProgress?.isCompleted}
							/>
>>>>>>> 37eb509 (add courses functionality)
						) : (
							<CourseEnrollButton
								courseId={params.courseId}
								price={course.price!}
							/>
<<<<<<< HEAD
						)}
=======
						)} }
>>>>>>> 37eb509 (add courses functionality)
					</div>
					<Separator />
					<div>
						<Preview value={chapter.description!} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div className="p-4">
								{attachments.map(attachment => (
									<a href={attachment.url} target="_blank" className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline" key={attachment.id}>
										<File />
										<p className="line-clamp-1">{attachment.name}</p>
									</a>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;
