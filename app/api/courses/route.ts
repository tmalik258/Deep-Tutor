import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (
	req: Request,
) {
	try {
		const {userId} = auth();
		const {title} = await req.json();

		if (!userId) {
			return new NextResponse("Unauthenticated", {status: 401})
		}

		if(!isTeacher(userId)) {
			return new NextResponse("Unauthorized", { status: 403 });
		}

		const course = await db.course.create({
			data: {
				userId,
				title,
			}
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log("[COURSES]", error);
		return new NextResponse("Internal Error", {status: 500})
	}
}