import { FlashSaleSection } from "@/app/types/flash-sale";
import dayjs from "dayjs";
import { memo } from "react";

interface Props {
  selectedSection: string | null;
  onSelectSection: (sectionId: string) => void;
  sections: FlashSaleSection[];
}

const FlashSaleSectionsView = ({
  sections,
  selectedSection,
  onSelectSection,
}: Props) => {
  return (
    <div className="no-scrollbar overflow-x-scroll rounded-t-none md:rounded-t-lg">
      <div className="flex w-max">
        {" "}
        {sections.map((section) => {
          const isActive = selectedSection === section.id;

          let status = "Sắp diễn ra";
          if (dayjs().isAfter(dayjs(section.fromHour))) {
            status = "Đang diễn ra";
          }

          if (dayjs().isAfter(dayjs(section.toHour))) {
            status = "Đã kết thúc";
          }
          return (
            <div
              key={section.id}
              className={`text-md flex w-fit flex-col items-center gap-1 px-4 py-2 font-semibold ${
                isActive
                  ? "border-b-2 border-orange-700 bg-orange-200 text-orange-800"
                  : "bg-gray-50 text-gray-800"
              }`}
              onClick={() => onSelectSection(section.id)}
            >
              {section.title}
              <div className="text-sm font-normal">{status}</div>
            </div>
          );
        })}{" "}
      </div>
    </div>
  );
};

export default memo(FlashSaleSectionsView);
