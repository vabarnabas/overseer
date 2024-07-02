import React from "react";
import { FaDatabase } from "react-icons/fa";
import { FaFly } from "react-icons/fa6";
import { SiRailway } from "react-icons/si";

interface Props {
  provider: string;
}

export default function ProviderIcon({ provider }: Props) {
  switch (provider) {
    case "railway":
      return <SiRailway />;
    case "fly":
      return <FaFly />;
    default:
      return <FaDatabase />;
  }
}
