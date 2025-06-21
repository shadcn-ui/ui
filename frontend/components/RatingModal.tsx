'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; feedback: string }) => void;
  maxRating?: number;
}

export default function RatingModal({
  open,
  onClose,
  onSubmit,
  maxRating = 5,
}: RatingModalProps) {
  const [value, setValue] = useState<number>(maxRating);
  const [hover, setHover] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (open) {
      setValue(maxRating);
      setHover(null);
      setFeedback("");
    }
  }, [open, maxRating]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Blur background */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-[2.5px]"
            onClick={onClose}
            tabIndex={-1}
            aria-label="Закрыть"
          />
          {/* Modal window */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.18, duration: 0.23 }}
            className="relative z-10 bg-gradient-to-br from-[#17253a]/95 to-[#2a3d59]/95 border border-cyan-400/20 p-7 w-full max-w-sm rounded-2xl shadow-2xl text-white space-y-6"
            onClick={e => e.stopPropagation()}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl font-bold text-center mb-1 text-cyan-200">Оцените решение заявки</h2>
              <div className="flex items-center gap-2 mt-3 mb-2">
                {[...Array(maxRating)].map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setValue(i + 1)}
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(null)}
                    className="focus:outline-none"
                    aria-label={`Поставить ${i + 1} звёзд`}
                  >
                    <Star
                      className={`w-8 h-8 transition
                        ${((hover ?? value) > i)
                          ? "fill-cyan-400 text-cyan-300 drop-shadow"
                          : "text-white/30"}
                        hover:scale-110 active:scale-90`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Комментарий (необязательно)"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full mt-1 p-3 bg-white/10 border border-cyan-300/10 rounded-xl text-white min-h-[80px] focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none"
                maxLength={500}
              />
              <div className="flex justify-end gap-3 w-full mt-2">
                <Button variant="ghost" type="button" onClick={onClose}>Отмена</Button>
                <Button
                  variant="accent"
                  type="button"
                  onClick={() => onSubmit({ rating: value, feedback })}
                  disabled={value < 1}
                >
                  Отправить
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
