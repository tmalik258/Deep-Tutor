import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const ChapterIdPage = async ({
	params,
}: {
	params: { courseId: string; chapterId: string; };
}) => {
	const {userId} = auth()

	if(!userId) {
		return redirect("/")
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
			},
		},
	});

	if (!course) {
		return redirect("/");
	}

	return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};
