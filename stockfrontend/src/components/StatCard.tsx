import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
}

const StatCard = ({
  title,
  value,
  change,
  icon,
}: StatCardProps) => {
  return (
    <div>
      {icon}
      <h3>{title}</h3>
      <p>{value}</p>
      {change && <span>{change}</span>}
    </div>
  );
};

export default StatCard;