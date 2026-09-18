import type { Metadata } from 'next';
import { getProjectBySlugServer } from '@/lib/server-data';
import ProjectDetailClient from '@/components/ProjectDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const cleanSlug = decodeURIComponent(rawSlug || '').replace(/\.html$/, '');

  const project = getProjectBySlugServer(cleanSlug) || getProjectBySlugServer(rawSlug);
  if (project) {
    const finalTitle = `${project.title} | Dự Án Bê Tông An Gia Bình`;
    const finalDesc = project.description || `Dự án ${project.title} tại ${project.location}, cung ứng bê tông thương phẩm chất lượng cao An Gia Bình Ninh Bình.`;
    const canonicalUrl = `https://betongangiabinh.vn/du-an/${project.slug || project.id}`;

    return {
      title: finalTitle,
      description: finalDesc,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: finalTitle,
        description: finalDesc,
        url: canonicalUrl,
        images: project.image ? [{ url: project.image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: finalTitle,
        description: finalDesc,
        images: project.image ? [project.image] : undefined,
      }
    };
  }

  return {
    title: `${cleanSlug.replace(/-/g, ' ')} | Dự Án Bê Tông An Gia Bình`,
    description: 'Dự án cung ứng bê tông thương phẩm và dịch vụ bơm bê tông tại Ninh Bình.',
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || '').replace(/\.html$/, '');
  const initialProject = getProjectBySlugServer(cleanSlug) || getProjectBySlugServer(slug);

  return <ProjectDetailClient rawSlug={slug} initialProject={initialProject} />;
}
