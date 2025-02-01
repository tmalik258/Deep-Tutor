"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

interface ImageFormProps {
	initialData: Course;
	courseId: string;
}

const formSchema = z.object({
	imageUrl: z.string().min(1, {
		message: "Image is required",
	}),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const toggleEdit = () => setIsEditing((current) => !current);

	const router = useRouter();

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			// Validate the values
			const validated = formSchema.parse(values);
			await axios.patch(`/api/courses/${courseId}`, validated);
			toast.success("Course updated");
			toggleEdit();
			router.refresh();
		} catch {
			toast.error("Something went wrong");
		}
	};

	return (
    <div className="mt-6 bg-white shadow-xl rounded-xl p-4">
      <div className="font-medium flex item-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-3 w-3 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-8 w-8 text-slate-10" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) onSubmit({ imageUrl: url });
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
