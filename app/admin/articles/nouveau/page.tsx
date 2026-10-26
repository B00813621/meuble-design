import { ArticleForm } from "../ArticleForm";

export const metadata = { title: "Nouvel article — Admin" };

export default function NouvelArticlePage() {
  return <ArticleForm isNew />;
}
