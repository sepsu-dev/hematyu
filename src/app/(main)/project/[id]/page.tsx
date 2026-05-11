import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, GitBranch, Globe, Terminal, Code2 } from "lucide-react";
import { ProjectImages } from "@/components/project-images";
import { cn, type Project } from "@/lib/utils";
import { Highlighter } from "@/components/highlighter";

const projects: Project[] = [
  {
    id: "ecommerce-api-core",
    title: "E-Commerce Core API",
    description: "Architecting a high-performance, microservices-based API designed to handle millions of transactions. Optimized with Nest.js and Prisma for ultimate reliability.",
    startDate: "Jan 2024",
    endDate: "Present",
    tags: ["Nest.js", "Prisma", "Postgre", "Rest API", "Docker", "Redis"],
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "hr-management-sys",
    title: "HRIS Enterprise Portal",
    description: "A sophisticated Human Resource platform streamlining payroll and attendance for large-scale enterprises. Built with Laravel to ensure maximum security.",
    startDate: "Aug 2023",
    endDate: "Dec 2023",
    tags: ["Laravel", "Mysql", "Bootstrap", "VPS", "Github"],
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "realtime-collab",
    title: "Real-time Team Collaboration",
    description: "Breaking communication barriers with a lightning-fast collaboration hub. Features real-time sync across devices using Node.js and Redis.",
    startDate: "May 2023",
    endDate: "Jul 2023",
    tags: ["React.js", "Node.js", "Express.js", "Redis", "JS"],
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "inventory-dashboard",
    title: "Smart Inventory Dashboard",
    description: "Visualizing complex warehouse data through an intuitive, high-fidelity dashboard. Crafted with React.js and Shadcn UI for a premium aesthetic.",
    startDate: "Feb 2023",
    endDate: "Apr 2023",
    tags: ["React.js", "Tailwind CSS", "Shadcn UI", "PHP", "Mysql"],
    imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "mobile-pos",
    title: "Mobile Point of Sale",
    description: "Revolutionizing retail with a powerful, cross-platform mobile POS. Built using React Native to provide a native-feel experience on all platforms.",
    startDate: "Nov 2022",
    endDate: "Jan 2023",
    tags: ["React Native", "JS", "Node.js", "SQL server"],
    imageUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "log-monitoring",
    title: "Centralized Log Analytics",
    description: "Mastering infrastructure visibility with a specialized log aggregation system. Leverages the ELK stack to provide real-time proactive alerting.",
    startDate: "Sep 2022",
    endDate: "Oct 2022",
    tags: ["Elasticsearch", "Kibana", "Docker", "VPS"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "legacy-crm",
    title: "Legacy CRM System",
    description: "Maintaining and scaling business-critical infrastructure for enterprise clients. Revitalizing legacy systems with modern performance optimizations.",
    startDate: "Apr 2022",
    endDate: "Aug 2022",
    tags: ["Codeigniter", "PHP", "Mysql", "Bootstrap"],
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "freelance-market",
    title: "Freelance Marketplace",
    description: "Empowering the global workforce with a feature-rich talent marketplace. Engineered to handle complex matching and secure interactions.",
    startDate: "Jan 2022",
    endDate: "Mar 2022",
    tags: ["Laravel", "React.js", "Tailwind CSS", "Postgre", "Gitlab"],
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
  {
    id: "task-api",
    title: "Task Management Backend",
    description: "Powering productivity with a robust, type-safe REST API. Focused on data integrity and high-speed delivery using Nest.js and SQL Server.",
    startDate: "Oct 2021",
    endDate: "Dec 2021",
    tags: ["Nest.js", "Prisma", "Express.js", "Rest API", "SQL server"],
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop"],
    href: "#",
  },
];

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}


export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  };
}

// Re-using highlighter components from main page
// Using centralized Highlighter component

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  return (
    <div className="relative min-h-screen bg-background pb-32 font-sans overflow-hidden">
      {/* Background Ornaments from main page */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="fixed top-32 left-10 text-primary/5 text-8xl font-mono font-bold select-none pointer-events-none rotate-12 hidden md:block">
        {`{ }`}
      </div>
      <div className="fixed bottom-40 right-10 text-primary/5 text-8xl font-mono font-bold select-none pointer-events-none -rotate-12 hidden md:block">
        {`< />`}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Back Button - Main style */}
        <div className="mb-10">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono font-semibold tracking-tight transition-all hover:bg-primary/20 group"
          >
            <Terminal className="w-3 h-3" />
            <span>~/projects/{id}.sh</span>
            <ChevronLeft className="w-3 h-3 ml-1 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-12 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            <span className="relative inline-block z-10">
              {project.title}
              <Highlighter variant={1} className="-rotate-2" />
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </header>

        {/* Project Image Slider - Main card style */}
        <div className="mb-16 rounded-2xl overflow-hidden border border-border bg-card/40 backdrop-blur-sm shadow-xl transition-all hover:shadow-2xl hover:border-primary/20">
          <ProjectImages
            images={project.images || (project.imageUrl ? [project.imageUrl] : [])}
            title={project.title}
          />
        </div>

        {/* Content Body */}
        <div className="space-y-20">

          {/* Overview Section */}
          <section className="relative">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-8 flex items-center gap-2 font-mono">
              <GitBranch className="w-5 h-5 text-primary" />
              <span className="relative inline-block z-10">
                Project Overview
                <Highlighter variant={2} className="rotate-1" />
              </span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed text-sm sm:text-base max-w-2xl">
              <p>
                This project was developed with a primary focus on high-performance data handling and seamless user experience.
                Utilizing modern technologies to ensure scalability and reliability across all modules.
              </p>
              <div className="rounded-xl overflow-hidden border border-border bg-card/40 backdrop-blur-sm p-6 text-sm italic leading-relaxed">
                "Technical excellence is not just about writing code, but about architecting systems that are sustainable, scalable, and intuitive for both users and developers alike."
              </div>
            </div>
          </section>

          {/* Tech Stack & Links combined to match main style flow */}
          <section className="space-y-12">

            {/* Tech Stack */}
            <div className="space-y-6">
              <div className="space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-8 flex items-center gap-2 font-mono">
                  <Code2 className="w-5 h-5 text-primary" />
                  <span className="relative inline-block z-10">
                    Tech Stack
                    <Highlighter variant={2} className="rotate-1" />
                  </span>
                </h2>
                <p className="text-sm text-muted-foreground -mt-4 mb-6 leading-relaxed">The core technologies utilized to build this specific project.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card/40 backdrop-blur-sm text-xs font-mono font-medium hover:border-primary/40 hover:text-primary transition-all cursor-default"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Links - Main style buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pt-8">
              <a
                href={project.href}
                target="_blank"
                className="group flex items-center justify-between p-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4" />
                  <span>LAUNCH LIVE SITE</span>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#"
                className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card/40 backdrop-blur-sm text-sm font-bold hover:bg-card hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                  <GitBranch className="w-4 h-4" />
                  <span>BROWSE SOURCE</span>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}
