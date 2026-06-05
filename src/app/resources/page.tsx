import type { Metadata } from "next";
import { ExternalLink, BookOpen, Play, Globe, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources",
  description: "Islamic resources, links, and community information from the Islamic Center of Hattiesburg.",
};

const resources = [
  {
    category: "Quran & Hadith",
    icon: <BookOpen className="h-5 w-5" />,
    links: [
      { label: "Quran.com — Quran with Translation", url: "https://quran.com" },
      { label: "Sunnah.com — Hadith Collections", url: "https://sunnah.com" },
      { label: "IslamQA.info — Islamic Q&A", url: "https://islamqa.info" },
    ],
  },
  {
    category: "Islamic Media",
    icon: <Play className="h-5 w-5" />,
    links: [
      { label: "SeekersGuidance — Free Islamic Courses", url: "https://seekersguidance.org" },
      { label: "Yaqeen Institute — Islamic Research", url: "https://yaqeeninstitute.org" },
      { label: "MuslimMatters.org — Articles & Essays", url: "https://muslimmatters.org" },
    ],
  },
  {
    category: "Prayer & Zakat Tools",
    icon: <Heart className="h-5 w-5" />,
    links: [
      { label: "Islamic Society of North America (ISNA)", url: "https://isna.net" },
      { label: "National Zakat Foundation", url: "https://nzf.org.uk" },
      { label: "Zakat Calculator — IslamicRelief", url: "https://www.islamicrelief.org/zakat/calculator/" },
    ],
  },
  {
    category: "Community & Organizations",
    icon: <Globe className="h-5 w-5" />,
    links: [
      { label: "Islamic Society of North America (ISNA)", url: "https://isna.net" },
      { label: "Muslim American Society (MAS)", url: "https://mas-icna.org" },
      { label: "Council on American-Islamic Relations (CAIR)", url: "https://www.cair.com" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Islamic Resources</h1>
        <p className="text-muted-foreground">
          Curated resources for learning, practice, and community connection.
        </p>
      </div>

      {/* Ayah */}
      <div className="mb-12 p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center">
        <div className="font-arabic text-2xl text-primary mb-2">
          اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
        </div>
        <p className="text-muted-foreground text-sm">
          &ldquo;Read in the name of your Lord who created.&rdquo; (96:1)
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {resources.map((group) => (
          <div key={group.category} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-primary mb-5 font-semibold">
              {group.icon}
              {group.category}
            </div>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mt-0.5 shrink-0 group-hover:text-primary" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-xl bg-card border border-border">
        <h2 className="font-semibold mb-2">Suggest a Resource</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Have a useful Islamic resource to share with the community?
        </p>
        <a
          href="/contact?subject=Resource+Suggestion"
          className="text-sm text-primary hover:underline"
        >
          Contact us with your suggestion →
        </a>
      </div>
    </div>
  );
}
