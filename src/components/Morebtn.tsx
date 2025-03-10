import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface MoreButtonProps {
  link: string;
}

const MoreButton: React.FC<MoreButtonProps> = ({ link }) => {
  return (
    <Link href={link}>
      <div className="flex items-center justify-center h-full w-full bg-gray-200/20 backdrop-blur-sm rounded-md hover:bg-gray-300/60 transition-colors duration-200">
        <span className="text-white flex gap-2 p-10 font-semibold">
          More <ArrowRight />
        </span>
      </div>
    </Link>
  );
};

export default MoreButton;