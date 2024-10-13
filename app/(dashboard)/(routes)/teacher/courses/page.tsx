import { Button } from "@/components/ui/button";
import Link from "next/link";

const CoursePage = () => {
	return ( <Link href={"/teacher/courses/create"}><Button>Create a New Course</Button></Link> );
}
 
export default CoursePage;