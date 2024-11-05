"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollButtonProps {
	courseId: string;
	price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
	console.log(courseId)
	return <Button className="w-full md:w-auto">Enroll for {formatPrice(price)}</Button>;
};

export default CourseEnrollButton;
