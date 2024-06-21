import { Section } from "@prisma/client";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

interface SectionListProps {
  items: Section[];
  onReorder: (updateData: { id: string; position: number }[]) => void; //Chức năng của hàm này là để xử lý logic cần thiết khi một phần tử trong danh sách được di chuyển đến một vị trí mới. Ví dụ, nó có thể được sử dụng trong một danh sách kéo thả (drag-and-drop list) để cập nhật vị trí của phần tử trong dữ liệu nguồn.
  onEdit: (id: string) => void;
}

const SectionList = ({ items, onReorder, onEdit }: SectionListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sections, setSections] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSections(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    //Nếu phần tử được kéo không có điểm đến hợp lệ (ví dụ như bị kéo ra ngoài vùng danh sách), hàm sẽ kết thúc và không thực hiện thay đổi gì.

    const items = Array.from(sections); //Tạo ra một bản sao của mảng sections để khi thực hiện các event không làm thay đổi dữ liệu

    const [reorderItem] = items.splice(result.source.index, 1); //Tao ra mot bien de lưu trữ phần tử kéo ra khỏi vị trí ban đầu
    items.splice(result.destination.index, 0, reorderItem);
    //Chèn phần tử vừa kéo ra vao một vị trí mới

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);
    //Tìm chỉ số ban đầu và chỉ số kết thúc trong mảng bị ảnh hưởng khi kéo phần từ để sắp xếp

    const updatedSections = items.slice(startIndex, endIndex + 1); //Lấy ra các phần tử trong mong khi kéo để thay đổi vị trí bị ảnh hưởng
    setSections(items); //cập nhật trạng thái sau khi thay đổi vị trí
    const burkUpdateData = updatedSections.map((section, index) => ({
      id: section.id,
      position: items.findIndex((item) => item.id === section.id),
    }));
    onReorder(burkUpdateData);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className={`${sections.length > 0 ? "my-10" : "mt-7"} flex flex-col gap-5`}>
            {sections.map((section, index) => (
              <Draggable draggableId={section.id} key={section.id} index={index}>
                {(provided) => (
                  <div {...provided.draggableProps} ref={provided.innerRef} className="flex items-center bg-[#FFF8EB] p-3 font-medium text-sm rounded-lg">
                    <div {...provided.dragHandleProps}>
                      <Grip className="w-4 h-4 mr-4 hover:text-[#FDAB04] cursor-pointer" />
                    </div>
                    {section.title}
                    <div className="ml-auto">
                      <Pencil className="w-4 h-4 cursor-pointer hover:text-[#FDAB04]" onClick={() => onEdit(section.id)} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SectionList;
