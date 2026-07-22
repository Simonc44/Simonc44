"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TitleRevealProps {
  text: string;
  className?: string;
}

export function TitleReveal({ text, className }: TitleRevealProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Rend un <h1> HTML standard côté serveur ET au 1er rendu client (0 Mismatch)
  if (!isMounted) {
    return (
      <h1 className={className} suppressHydrationWarning>
        {text}
      </h1>
    );
  }

  // 2. Découpage et animation uniquement APRÈS l'hydratation
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.35, ease: "easeOut" as const },

    },
  };

  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`char-${wordIndex}-${charIndex}`}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {/* Espace explicite pour éviter le décalage de texte */}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.h1>
  );
}

export default TitleReveal;