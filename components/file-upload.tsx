"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

interface FileUploadProps {
	onChange: (url?: string) => void;
	endpoint: keyof typeof ourFileRouter;
}

export default function FileUpload({ onChange, endpoint }: FileUploadProps) {
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				toast.dismiss('image-upload-toast');
				toast.success("Upload complete!");

				onChange(res?.[0].url);
			}}
			onUploadError={(error: Error) => {
				toast.dismiss('image-upload-toast');
				toast.error(`ERROR! ${error?.message}`);
			}}
			onUploadBegin={(fileName) => {
				toast.loading(`Uploading: ${fileName}`, {
					// Optional: You can store the toast ID if you want to dismiss a specific toast
					id: "image-upload-toast",
				});
			}}
		/>
	);
}
