"use client"

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
	const {userId} = useAuth();
	const pathname = usePathname();

	const isTeacherPage = pathname?.includes("/teacher");
	const isCoursePage = pathname?.includes("/courses");
	const isSearchPage = pathname?.includes('/search');

	return (
		<>
			{isSearchPage && (
				<div className="hidden md:block">
					<SearchInput />
				</div>
			)}
			<div className="flex gap-x-3 ml-auto">
				{
					isTeacherPage || isCoursePage ? (
						<Link href="/dashboard">
							<Button size="sm" variant={"ghost"}>
								<LogOut className="h-4 w-4 mr-2" />
								Exit
							</Button>
						</Link>
					) : isTeacher(userId) ? (
						<Link href="/dashboard/teacher/courses">
							<Button size="sm" variant={"outline"}>
								Teacher Mode
							</Button>
						</Link>
					) : null
				}
				<UserButton />
			</div>
		</>
	);
};

export default NavbarRoutes;
