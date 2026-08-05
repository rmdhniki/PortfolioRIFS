import Image from "next/image";

export function LaptopMockup({
  gradient,
  imageUrl,
  className = "",
}: {
  gradient: string;
  imageUrl?: string | null;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-t-xl border border-espresso/10 bg-espresso p-2 shadow-inner">
        <div
          className={`relative aspect-video w-full overflow-hidden rounded-md bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-[1.03]`}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 480px, 90vw"
              className="object-cover"
            />
          )}
        </div>
      </div>
      <div className="mx-auto h-2.5 w-2/3 rounded-b-xl bg-espresso/90" />
      <div className="mx-auto h-1 w-1/3 rounded-b-full bg-espresso/60" />
    </div>
  );
}

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
    <div className={`mx-auto w-[220px] max-w-full ${className}`}>
      <div className="relative rounded-[2.75rem] border-[6px] border-espresso bg-espresso p-1.5 shadow-xl">
        <div
          className={`relative aspect-[9/19.5] w-full overflow-hidden rounded-[2.25rem] bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-[1.03]`}
        >
          {imageUrl && (
            <Image src={imageUrl} alt="" fill sizes="220px" className="object-cover" />
          )}
          <div className="absolute top-2 left-1/2 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-espresso" />
        </div>
        <div className="absolute top-16 -right-[8px] h-10 w-[6px] rounded-full bg-espresso/80" />
        <div className="absolute top-24 -left-[8px] h-6 w-[6px] rounded-full bg-espresso/80" />
        <div className="absolute top-32 -left-[8px] h-10 w-[6px] rounded-full bg-espresso/80" />
      </div>
    </div>
  );
}
