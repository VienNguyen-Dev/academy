import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

interface RichEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
}
const RichEditor = ({ placeholder, onChange, value }: RichEditorProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []); //âu lệnh này giúp tối ưu hóa hiệu suất bằng cách chỉ tải và lưu trữ thành phần ReactQuill khi cần thiết và chỉ làm điều đó một lần duy nhất.

  return <ReactQuill theme="snow" placeholder={placeholder} value={value} onChange={onChange} />;
};

export default RichEditor;
