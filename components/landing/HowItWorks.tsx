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

export function HowItWorks() {
  return (
    <section className="w-full min-h-screen snap-start flex items-center" id="how-it-works">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <motion.h2 className={title({ size: "md", fullWidth: true })} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          How it works
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          {[
            { step: 1, h: "Upload one photo", p: "Any clear portrait. Selfie or headshot works great." },
            { step: 2, h: "Pick styles", p: "Choose themes like professional, athleisure, travel, and more." },
            { step: 3, h: "Generate", p: "Create a consistent gallery of you across every setting." },
          ].map((s) => (
            <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp}>
                <Card className="bg-content1/60 border border-default-100">
                  <CardHeader className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold">
                      {s.step}
                    </div>
                    <div className="font-semibold">{s.h}</div>
                  </CardHeader>
                  <CardBody className="text-default-600">{s.p}</CardBody>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


