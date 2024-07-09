import NeonLogo from "@/components/logo/neon-logo";
import XataLogo from "@/components/logo/xata-logo";
import { BiLogoPostgresql } from "react-icons/bi";
import { FaFly, FaAws, FaDatabase } from "react-icons/fa6";
import { RiSupabaseFill } from "react-icons/ri";
import { SiMicrosoftsqlserver, SiMysql, SiRailway } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

export default function useDatabaseProviders() {
  const providers = [
    {
      name: "Railway.app",
      value: "railway",
      icon: <SiRailway />,
    },
    {
      name: "Fly.io",
      value: "fly",
      icon: <FaFly />,
    },
    {
      name: "Azure",
      value: "azure",
      icon: <VscAzure />,
    },
    {
      name: "AWS",
      value: "aws",
      icon: <FaAws />,
    },
    {
      name: "Neon",
      value: "neon",
      icon: <NeonLogo />,
    },
    {
      name: "Xata",
      value: "xata",
      icon: <XataLogo />,
    },
    {
      name: "Supabase",
      value: "supabase",
      icon: <RiSupabaseFill />,
    },
    {
      name: "Other",
      value: "other",
      icon: <FaDatabase />,
    },
  ];

  const systems = [
    {
      name: "PostgreSQL",
      value: "postgres",
      icon: <BiLogoPostgresql className="text-6xl" />,
    },
    {
      name: "MySQL",
      value: "mysql",
      icon: <SiMysql className="text-6xl" />,
    },
    {
      name: "MsSQL",
      value: "mssql",
      icon: <SiMicrosoftsqlserver className="text-6xl" />,
    },
  ];

  return { providers, systems };
}
