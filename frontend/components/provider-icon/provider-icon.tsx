import React from "react";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaDatabase } from "react-icons/fa";
import { FaAws, FaFly } from "react-icons/fa6";
import { GrMysql } from "react-icons/gr";
import { SiMicrosoftsqlserver, SiRailway } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";
import NeonLogo from "../logo/neon-logo";
import XataLogo from "../logo/xata-logo";
import { RiSupabaseFill } from "react-icons/ri";
import useDatabaseProviders from "@/hooks/useDatabaseProviders";

interface Props {
  provider: string;
  type: string;
}

export default function ProviderIcon({ provider, type }: Props) {
  const { providers, systems } = useDatabaseProviders();

  const getProviderIcon = () => {
    return providers.find((p) => p.value === provider)?.icon || <FaDatabase />;
  };

  const getTypeIcon = () => {
    return systems.find((s) => s.value === type)?.icon || <FaDatabase />;
  };

  return (
    <div className="relative flex justify-center items-center">
      <span>{getTypeIcon()}</span>
      <span className="absolute bg-white/70 backdrop-blur-md rounded-md text-base p-0.5 -right-2  -bottom-1">
        {getProviderIcon()}
      </span>
    </div>
  );
}
