"use client";

import { MotionConfig, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function LikeProject({
  projectId,
  isLiked,
}: {
  projectId: string;
  isLiked: boolean;
}) {
  const [liked, setLiked] = useState(isLiked);
  const heartRef = useRef<SVGSVGElement>(null);

  const { toast } = useToast();

  const likeMutation = api.portfolio.toggleLike.useMutation({
    onError: (err) => {
      setLiked(isLiked);
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <MotionConfig
      transition={{
        duration: 0.5,
        type: "spring",
      }}
    >
      <motion.button
        whileTap={{
          scale: likeMutation.isPending ? 1 : 0.95,
        }}
        whileHover={{
          scale: likeMutation.isPending ? 1 : 1.05,
        }}
        onClick={() => {
          likeMutation.mutate({ id: projectId });
          setLiked(!liked);
        }}
        disabled={likeMutation.isPending}
        className="flex select-none items-center gap-1 disabled:animate-pulse disabled:cursor-not-allowed"
      >
        <Heart
          className="size-4 text-red-500"
          fill={liked ? "currentColor" : "transparent"}
          ref={heartRef}
        />
        <p>Понравилось</p>
      </motion.button>
    </MotionConfig>
  );
}