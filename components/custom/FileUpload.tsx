"use client";
interface FileUploadProps {
  value: string;
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  page: string;
}
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import toast from "react-hot-toast";
const FileUpload = ({ value, onChange, endpoint, page }: FileUploadProps) => {
  return (
    <div className="flex flex-col gap-2">
      {page === "Edit Course" && value !== "" && <Image src={value} width={500} height={500} alt="course banner" className="w-[280px] h-[200px] object-cover rounded-xl" />}

      {page === "Edit Section" && value !== "" && <p className=" text-sm font-medium">{value}</p>}
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(error.message);
        }}
        className="w-[280px] h-[200px]"
      />
    </div>
  );
};

export default FileUpload;
