"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { motion, Variants } from "framer-motion";

import { title } from "@/components/primitives";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function Features() {
  return (
    <section className="w-full min-h-screen snap-start flex items-center">
      <div className="container mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "High consistency",
              desc: "Your identity stays intact across every style and scene.",
            },
            {
              title: "Studio quality",
              desc: "Crisp lighting, clean compositions, and natural skin tones.",
            },
            {
              title: "Blazing fast",
              desc: "Generate dozens of looks in seconds — not hours.",
            },
          ].map((f) => (
            <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp}>
                <Card className="bg-content1/60 border border-default-100">
                  <CardHeader className="text-large font-semibold">{f.title}</CardHeader>
                  <CardBody className="text-default-600">{f.desc}</CardBody>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


