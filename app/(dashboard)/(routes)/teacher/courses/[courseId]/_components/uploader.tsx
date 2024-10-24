"use client";

import { Button } from "@/components/ui/button";
import { useEdgeStore } from "@/lib/edgestore";
import Link from "next/link";
import { useState } from "react";
import { SingleImageDropzone } from "./single-image-dropzone";

export default function Uploader() {
	const [file, setFile] = useState<File>();
	const [progress, setProgress] = useState(0);
	const [urls, setUrls] = useState<{
		url: string;
		thumbnailUrl: string | null;
	}>();
	const { edgestore } = useEdgeStore();

	return (
		<div className="flex flex-col items-center m-6 gap-2">
			<SingleImageDropzone
				width={200}
				height={200}
				value={file}
				dropzoneOptions={{
					maxSize: 1024 * 1024 * 4, // 4MB
				}}
				onChange={(file) => {
					setFile(file);
				}}
			/>
			{file && (
				<div className="h-[6px] w-44 border rounded overflow-hidden">
					<div
						className="h-full bg-black transition-all duration-150"
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}
			<Button
				onClick={async () => {
					if (file) {
						const res = await edgestore.myPublicImages.upload({
							file,
							input: {type: "course"},
							onProgressChange: (progress) => {
								setProgress(progress);
							},
						});
						// save your files
						setUrls({
							url: res.url,
							thumbnailUrl: res.thumbnailUrl,
						});
					}
				}}
			>
				Upload
			</Button>
			{urls?.url && (
				<Link href={urls.url} target="_blank">
					URL
				</Link>
			)}
			{urls?.thumbnailUrl && (
				<Link href={urls.thumbnailUrl} target="_blank">
					THUMBNAILURL
				</Link>
			)}
		</div>
	);
}
