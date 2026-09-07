import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  id?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      id={id}
      className={cn("mb-14", centered && "text-center", className)}
    >
      <h2 className="text-3xl font-bold tracking-tight text-unity-navy md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-lg text-unity-gray">
          {subtitle}
        </p>
      )}
    </div>
  );
}
