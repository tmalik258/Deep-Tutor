"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { IconType } from "react-icons/lib";

interface CategoryItemProps {
	label: string;
	value?: string;
	icon?: IconType;
}

const CategoryItem = ({ label, value, icon: Icon }: CategoryItemProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentCategoryId = searchParams.get("categoryId");
	const currentTitle = searchParams.get("title");

	const isSelected = currentCategoryId === value;

	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					title: currentTitle,
					categoryId: isSelected ? null : value,
				},
			},
			{ skipNull: true, skipEmptyString: true }
		);

		router.push(url);
	};

	return (
		<button
			className={cn(
				"py-2 px-3 text-sm bg-white shadow-xl rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
				isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
			)}
			type="button"
			onClick={onClick}
		>
			{Icon && <Icon size={20} />}
			<div className="truncate">{label}</div>
		</button>
	);
};

export default CategoryItem;
