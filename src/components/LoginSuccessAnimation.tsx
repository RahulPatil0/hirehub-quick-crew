import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface LoginSuccessAnimationProps {
  userName: string;
  role: string;
  onComplete: () => void;
}

export const LoginSuccessAnimation = ({
  userName,
  role,
  onComplete,
}: LoginSuccessAnimationProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Trigger confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#0EA5E9", "#F59E0B", "#10B981"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Hide animation after 3 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-success/20 p-12 rounded-3xl shadow-2xl border border-primary/30">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex flex-col items-center gap-6"
              >
                {/* Success Icon with Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-success/30 rounded-full blur-2xl animate-pulse" />
                  <CheckCircle2 className="h-24 w-24 text-success relative z-10" />
                </motion.div>

                {/* Welcome Message */}
                <div className="text-center space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-5 w-5 text-secondary" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                      Welcome Back!
                    </h2>
                    <Sparkles className="h-5 w-5 text-secondary" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl font-semibold text-foreground"
                  >
                    {userName}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-muted-foreground"
                  >
                    Logged in as <span className="font-medium text-primary">{role}</span>
                  </motion.p>
                </div>

                {/* Animated Dots */}
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        backgroundColor: [
                          "hsl(195, 85%, 45%)",
                          "hsl(35, 90%, 55%)",
                          "hsl(142, 75%, 45%)",
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="h-3 w-3 rounded-full"
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
