import React from "react";
import { FaDatabase } from "react-icons/fa";
import { SiRailway } from "react-icons/si";

interface Props {
  provider: string;
}

export default function ProviderIcon({ provider }: Props) {
  switch (provider) {
    case "railway":
      return <SiRailway className="text-3xl" />;
    default:
      return <FaDatabase className="text-3xl" />;
  }
}
