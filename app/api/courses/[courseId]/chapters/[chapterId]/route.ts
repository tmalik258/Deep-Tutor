import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const { video } = new Mux({
	tokenId: process.env.MUX_TOKEN_ID!,
	tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const courseOwner = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId: userId,
			},
		});

		if (!courseOwner) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const chapter = await db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			}
		})

		if(!chapter) {
			return new NextResponse("Not found", {status: 404});
		}

		if(chapter.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId: params.chapterId,
				}
			})

			if (existingMuxData) {
				await video.assets.delete(existingMuxData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					}
				})
			}
		}

		const deletedChapter = await db.chapter.delete({
			where: {
				id: params.chapterId,
			}
		})

		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true,
			}
		})

		if(!publishedChaptersInCourse.length){
			await db.course.update({
				where: {
					id: params.courseId,
				},
				data: {
					isPublished: false
				}
			})
		} 

		return NextResponse.json(deletedChapter)
	} catch (error) {
		console.log("[CHAPTER_ID_DELETE]", error)
		return new NextResponse("Internal Error", {status: 500})
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = auth();
		const values = await req.json();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const courseOwner = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId: userId,
			},
		});

		if (!courseOwner) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const chapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
			data: {
				...values,
			},
		});

		if (values.videoUrl) {
			try {
				const existingMuxData = await db.muxData.findFirst({
					where: {
						chapterId: params.chapterId,
					},
				});

				if (existingMuxData) {
					await video.assets
						.delete(existingMuxData.assetId)
						.catch(() => null);
					await db.muxData.delete({
						where: {
							id: existingMuxData.id,
						},
					});
				}

				const asset = await video.assets.create({
					input: values.videoUrl,
					playback_policy: ["public"],
					test: false,
				});

				if (!asset?.id || !asset?.playback_ids?.[0]?.id) {
					throw new Error("Failed to create Mux asset");
				}

				await db.muxData.create({
					data: {
						chapterId: params.chapterId,
						assetId: asset.id,
						playbackId: asset.playback_ids[0].id,
					},
				});
			} catch (error) {
				console.error("[MUX_UPLOAD_ERROR]", error);
				return new NextResponse("Error processing video", {
					status: 500,
				});
			}
		}

		return NextResponse.json(chapter);
	} catch (error) {
		console.log("[COURSES_CHAPTER_ID]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
