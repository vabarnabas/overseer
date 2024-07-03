import React from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaDatabase } from "react-icons/fa";
import { FaFly } from "react-icons/fa6";
import { GrMysql } from "react-icons/gr";
import { SiMysql, SiRailway } from "react-icons/si";

interface Props {
  provider: string;
  type: string;
}

export default function ProviderIcon({ provider, type }: Props) {
  const getProviderIcon = () => {
    switch (provider) {
      case "railway":
        return <SiRailway scale={50} />;
      case "fly":
        return <FaFly />;
      default:
        return <FaDatabase />;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "postgres":
        return <BiLogoPostgresql />;
      case "mysql":
        return <GrMysql />;
      default:
        return <FaDatabase />;
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      <span>{getTypeIcon()}</span>
      <span className="absolute bg-white rounded-full text-base p-0.5 -right-2  -bottom-1">
        {getProviderIcon()}
      </span>
    </div>
  );
}
