import { getStories } from "@/lib/content";
import { StoriesView, type Story } from "@/components/pages/StoriesView";

export const metadata = {
  title: "Stories — Fits You",
  description:
    "Real people, real plans. Shared with consent. Results vary — individual outcomes depend on many factors.",
};

export default async function StoriesPage() {
  const articles = await getStories();
  // null/empty → StoriesView shows clearly-labeled SAMPLE placeholders.
  // Real consented stories render only when published pillar='stories' rows exist.
  const stories: Story[] | null =
    articles && articles.length > 0
      ? articles.map((a) => ({
          key: a.slug,
          title: a.title,
          quote: a.excerpt ?? a.subtitle ?? "",
          attribution: a.byline ?? "",
          img: a.image_url ?? "",
          imageAlt: a.image_alt ?? a.title,
        }))
      : null;
  return <StoriesView stories={stories} />;
}
