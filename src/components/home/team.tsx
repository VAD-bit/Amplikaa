"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { TEAM, type Member } from "@/lib/config";
import { portraitURI } from "@/lib/placeholders";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/home/section-head";

function RiseCard({
  member,
  progress,
  index,
  reduce,
}: {
  member: Member;
  progress: MotionValue<number>;
  index: number;
  reduce: boolean;
}) {
  const start = 0.04 + index * 0.07;
  const end = start + 0.34;
  const y = useTransform(progress, [start, end], [170, 0]);
  const opacity = useTransform(progress, [start, start + 0.16], [0, 1]);
  const scale = useTransform(progress, [start, end], [0.94, 1]);

  return (
    <motion.article
      style={reduce ? undefined : { y, opacity, scale }}
      className={
        member.ceo
          ? "relative sm:col-span-2 lg:col-span-2"
          : "relative"
      }
    >
      <div
        className={
          member.ceo
            ? "glass group flex h-full flex-col-reverse p-5 sm:flex-row sm:items-center sm:gap-6"
            : "glass group flex h-full flex-col p-5"
        }
      >
        <span className="tape -top-3 left-6 w-20 -rotate-3" aria-hidden="true" />
        <div
          className={
            member.ceo
              ? "w-full shrink-0 border border-ink/25 sm:w-44"
              : "w-full border border-ink/25"
          }
        >
          <div className={`aspect-4/5 overflow-hidden${member.photo ? " photo-comic" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo || portraitURI(member.name)}
              alt={`${member.name}, ${member.role}`}
              loading="lazy"
              className={
                member.photo
                  ? "photo-cutout h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:-translate-y-1"
                  : "h-full w-full object-cover grayscale-[35%] transition-all duration-500 group-hover:grayscale-0"
              }
            />
          </div>
        </div>
        <div className={member.ceo ? "min-w-0 flex-1 py-1" : "mt-4 flex-1"}>
          {member.ceo && (
            <span className="sticker mb-3 inline-block -rotate-2 bg-elec px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink">
              Redacción fundadora
            </span>
          )}
          <h3 className="headline text-xl uppercase">{member.name}</h3>
          <p className="label-mono mt-1 text-[10px]">{member.role}</p>
          {member.note && (
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{member.note}</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  });

  return (
    <section
      id="equipo"
      ref={ref}
      className="relative border-y-2 border-ink bg-paper-2 py-24 sm:py-32"
      aria-labelledby="tit-equipo"
    >
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          id="tit-equipo"
          no="04"
          kicker="Quiénes somos"
          title={
            <>
              El equipo detrás<br />
              <span className="text-gradient italic">de la edición</span>
            </>
          }
          deck="Fundador y cabeza de la redacción: estrategia, crecimiento y alianzas. El equipo se suma proyecto a proyecto desde Maracay."
          meta="Redacción fundadora"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <RiseCard key={`${m.name}-${i}`} member={m} progress={scrollYProgress} index={i} reduce={reduce} />
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="sticker mt-10 inline-block rotate-[1.5deg] bg-paper-3 px-6 py-4">
            <p className="font-syne text-lg font-bold uppercase leading-none">
              Redacción en expansión
            </p>
            <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Estrategia · Creatividad · Performance · Código
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
