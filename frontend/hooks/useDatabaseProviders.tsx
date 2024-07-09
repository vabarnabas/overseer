import NeonLogo from "@/components/logo/neon-logo";
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
      icon: <SiRailway className="text-6xl" />,
    },
    {
      name: "Fly.io",
      value: "fly",
      icon: <FaFly className="text-6xl" />,
    },
    {
      name: "Azure",
      value: "azure",
      icon: <VscAzure className="text-6xl" />,
    },
    {
      name: "AWS",
      value: "aws",
      icon: <FaAws className="text-6xl" />,
    },
    {
      name: "Neon",
      value: "neon",
      icon: <NeonLogo className="text-6xl" />,
    },
    {
      name: "Supabase",
      value: "supabase",
      icon: <RiSupabaseFill className="text-6xl" />,
    },
    {
      name: "Other",
      value: "other",
      icon: <FaDatabase className="text-6xl" />,
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
