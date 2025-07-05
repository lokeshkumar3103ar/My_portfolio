import React from 'react';
import { motion } from 'framer-motion';

const BuildPhilosophySection = () => {
  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold mb-6">My Build Philosophy</h2>
        <p className="text-lg italic text-gray-600 dark:text-gray-400">
          I think. I design. I build. Then I repeat.
        </p>
        <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          I don't wait to master every tool. I architect solutions first — then use AI, my mind, and fast learning to bring them to life. I've built portfolios, deployed ML systems, and led end-to-end architectures without prior stack knowledge — because my mindset isn't "Can I?" but "How fast can I?"
        </p>
        <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Every project I touch runs on one engine: <strong>Vision under my supervision, accelerated by AI</strong>.
        </p>
        <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          This is more than coding — it's intelligent building.
        </p>
      </motion.div>
    </section>
  );
};

export default BuildPhilosophySection;
