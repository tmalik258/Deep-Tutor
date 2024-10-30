interface GetChapterProps {
	userId: string;
	courseId: string;
	chapterId: string;
};

export const getChapter = async ({
	userId,
	courseId,
	chapterId
}: GetChapterProps) => {
	try {
		console.log(userId, courseId, chapterId)
	} catch (error) {
		console.log("[GET_CHAPTER]", error)
		return {
			chapter: null,
			course: null,
			muxData: null,
			attachments: [],
			nextChapter: null
		}
	}

}