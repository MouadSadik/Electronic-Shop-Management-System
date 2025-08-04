"use client";

import { MoveRight } from "lucide-react";
import {
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Tv2,
  Headphones,
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const brands = [
  { icon: Laptop, name: "Dell" },
  { icon: Monitor, name: "Samsung" },
  { icon: Smartphone, name: "Apple" },
  { icon: Tablet, name: "Huawei" },
  { icon: Tv2, name: "Sony" },
  { icon: Headphones, name: "JBL" },
];

export default function Marques() {
  return (
    <div className="w-full overflow-hidden py-8 bg-white dark:bg-black">
      <motion.div
        className="flex gap-10 items-center animate-move-left px-4"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...brands, ...brands].map((brand, index) => {
          const Icon = brand.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 p-4 rounded-xl w-32 h-32"
            >
              <Icon size={36} className="text-primary mb-2" />
              <p className="text-sm font-semibold">{brand.name}</p>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
