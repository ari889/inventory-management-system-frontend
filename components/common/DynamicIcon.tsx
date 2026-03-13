"use client";

import { icons, LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const Icon = icons[name as keyof typeof icons];

  if (!Icon) return null;

  return <Icon {...props} />;
};

export default DynamicIcon;
