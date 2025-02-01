"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
	courseId: string;
	price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
	const [loading, setLoading] = useState(false);

	const onClick = async () => {
		setLoading(true);

		try {
			const res = await axios.post(`/api/courses/${courseId}/checkout`);

			window.location.assign(res.data.url);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
			}
		
	}

	return <Button className="w-full md:w-auto" disabled={loading} onClick={onClick}>{loading ? "Loading..." : `Enroll for ${formatPrice(price)}`}</Button>;
};

export default CourseEnrollButton;
