"use client";

import { Card, CardBody } from "@heroui/card";
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

export function Testimonials() {
  return (
    <section className="w-full min-h-screen snap-start flex items-center">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        <motion.h2 className={title({ size: "md", fullWidth: true })} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          Loved by creators and teams
        </motion.h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {["“I replaced my LinkedIn photos in 5 minutes.”", "“Looks like a real shoot, but faster.”", "“Finally consistent AI portraits.”"].map(
            (q, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.div variants={fadeUp}>
                  <Card className="bg-content1/60 border border-default-100">
                    <CardBody className="text-default-700">{q}</CardBody>
                  </Card>
                </motion.div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}


