import Image from "next/image";
import { isImageUrl } from "@/lib/project-images";

/** CSS-drawn phone frame with a single screenshot (used on the project detail page). */
export function PhoneMockup({
  gradient,
  imageUrl,
  className = "",
}: {
  gradient: string;
  imageUrl?: string | null;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-55 max-w-full ${className}`}>
      <div className="relative rounded-[2.75rem] border-6 border-border bg-background p-1.5 shadow-xl">
        <div
          className={`relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.25rem] bg-linear-to-br ${gradient}`}
        >
          {isImageUrl(imageUrl) && (
            <Image src={imageUrl} alt="" fill sizes="260px" className="object-cover" />
          )}
          <div className="absolute top-2 left-1/2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-background" />
        </div>
        <div className="absolute top-16 -right-2 h-10 w-1.5 rounded-full bg-border" />
        <div className="absolute top-24 -left-2 h-6 w-1.5 rounded-full bg-border" />
        <div className="absolute top-32 -left-2 h-10 w-1.5 rounded-full bg-border" />
      </div>
    </div>
  );
}
