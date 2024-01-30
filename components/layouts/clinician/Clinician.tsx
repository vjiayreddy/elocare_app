import React from "react";

interface ClinicianLayoutComponentProps {
  children: React.ReactNode;
}
const ClinicianLayoutComponent = ({
  children,
}: ClinicianLayoutComponentProps) => {
  return <div>{children}</div>;
};

export default ClinicianLayoutComponent;
