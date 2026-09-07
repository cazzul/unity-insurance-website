import { SectionHeading } from "@/components/ui/SectionHeading";
import { blogPosts } from "@/lib/content";

export function BlogPreview() {
  return (
    <section id="blog" className="scroll-mt-24 lg:scroll-mt-[150px] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Blog y recursos educativos"
          subtitle="Aprende sobre tipos de cobertura sin jerga complicada."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl border border-unity-navy/10 bg-unity-light p-6 transition-shadow hover:shadow-md"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-unity-teal">
                {post.date}
              </span>
              <h3 className="mt-2 font-bold text-unity-navy">{post.title}</h3>
              <p className="mt-2 text-sm text-unity-gray">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
