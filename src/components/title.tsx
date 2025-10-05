"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { SITETITLE } from "@/lib/constants";

type SubtitleItem = { name: string; link: string };
type TitleProps = {
  title: string;
  subtitle?: SubtitleItem[];
};

export const Title: React.FC<TitleProps> = ({ title, subtitle = [] }) => {
  useEffect(() => {
    document.title = `${title} ${SITETITLE}`;
  }, [title]);

  return (
    <h1 className="text-2xl text-brand-blue font-semibold">
      {subtitle.map((s, i) => (
        <Link
          href={s?.link}
          key={`k-${i}`}
          className="text-[#00336666] cursor-pointer"
        >
          {s?.name} /{" "}
        </Link>
      ))}
      {title}
    </h1>
  );
};
