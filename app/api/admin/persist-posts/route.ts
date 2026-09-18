import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPostsServer,
  getAllProjectsServer,
  getAllPagesServer,
  getAllCategoriesServer,
  savePostsServer,
  saveProjectsServer,
  savePagesServer,
  saveCategoriesServer,
  saveSinglePostServer,
  deleteSinglePostServer
} from '@/lib/server-data';
import fs from 'node:fs';
import path from 'node:path';
import { BlogPost, Project } from '@/lib/types';

export const dynamic = 'force-dynamic';

// In-memory buffer for chunked uploads
const uploadBuffers = new Map<string, { chunks: Map<number, BlogPost[]>; total: number; timestamp: number }>();

// Cleanup stale upload buffers every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of uploadBuffers.entries()) {
      if (now - val.timestamp > 10 * 60 * 1000) {
        uploadBuffers.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export async function GET() {
  try {
    const posts = getAllPostsServer();
    const projects = getAllProjectsServer();
    const pages = getAllPagesServer();
    const categories = getAllCategoriesServer();

    let jekyllConfig = null;
    const configPath = path.join(process.cwd(), 'public', 'data', 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        jekyllConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      } catch {}
    }

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
      projects,
      pages,
      categories,
      jekyllConfig,
      source: 'AI Studio Server Data (public/data/)',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Lỗi đọc dữ liệu từ máy chủ.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isArrayBody = Array.isArray(body);
    const {
      action,
      post,
      project,
      id,
      mode,
      uploadId,
      chunkIndex,
      totalChunks,
      chunkPosts,
      updates,
      posts,
      projects,
      pages,
      categories,
      jekyllConfig
    } = isArrayBody ? { posts: body } as any : body;

    // Mode: Single post save / update
    if (action === 'save_post' && post) {
      const targetPost = post as BlogPost;
      const { success, posts: updatedPosts } = saveSinglePostServer(targetPost);

      return NextResponse.json({
        success,
        action: 'save_post',
        post: targetPost,
        totalPosts: updatedPosts.length,
        message: success
          ? `Đã lưu thành công bài viết "${targetPost.title}" vào tệp máy chủ public/data/posts.json!`
          : 'Lỗi khi ghi tệp posts.json trên máy chủ',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Single post delete
    if (action === 'delete_post' && id) {
      const { success, posts: filteredPosts } = deleteSinglePostServer(id);

      return NextResponse.json({
        success,
        action: 'delete_post',
        deletedId: id,
        totalPosts: filteredPosts.length,
        message: success
          ? `Đã xóa bài viết khỏi public/data/posts.json thành công!`
          : 'Lỗi khi cập nhật posts.json trên máy chủ',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Single project save / update
    if (action === 'save_project' && project) {
      const targetProj = project as Project;
      const currentProjects = getAllProjectsServer();
      const existingIdx = currentProjects.findIndex(
        (p) => p.id === targetProj.id || (targetProj.slug && p.slug === targetProj.slug)
      );

      if (existingIdx >= 0) {
        currentProjects[existingIdx] = { ...currentProjects[existingIdx], ...targetProj };
      } else {
        currentProjects.unshift(targetProj);
      }

      saveProjectsServer(currentProjects);

      return NextResponse.json({
        success: true,
        action: 'save_project',
        project: targetProj,
        totalProjects: currentProjects.length,
        message: `Đã lưu thành công dự án "${targetProj.title}" vào tệp máy chủ public/data/projects.json!`,
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Single project delete
    if (action === 'delete_project' && id) {
      const currentProjects = getAllProjectsServer();
      const filtered = currentProjects.filter((p) => p.id !== id && p.slug !== id);
      saveProjectsServer(filtered);

      return NextResponse.json({
        success: true,
        action: 'delete_project',
        deletedId: id,
        totalProjects: filtered.length,
        message: `Đã xóa dự án khỏi public/data/projects.json thành công!`,
        timestamp: new Date().toISOString()
      });
    }

    // Mode 1: Batch update specific posts without sending full post list
    if (mode === 'batch_update' && Array.isArray(updates)) {
      const currentPosts = getAllPostsServer();
      const postMap = new Map<string, BlogPost>();
      currentPosts.forEach(p => postMap.set(p.id, p));

      let updatedCount = 0;
      updates.forEach((item: { id: string; updates: Partial<BlogPost> }) => {
        if (!item?.id) return;
        const existing = postMap.get(item.id);
        if (existing) {
          postMap.set(item.id, { ...existing, ...item.updates });
          updatedCount++;
        }
      });

      const updatedList = Array.from(postMap.values());
      savePostsServer(updatedList);

      return NextResponse.json({
        success: true,
        mode: 'batch_update',
        updatedCount,
        totalPosts: updatedList.length,
        message: `Đã cập nhật tối ưu thành công cho ${updatedCount} bài viết trên máy chủ!`,
        timestamp: new Date().toISOString()
      });
    }

    // Mode 2: Chunked upload for massive post lists (1,000 - 10,000+ posts)
    if (mode === 'chunk' && uploadId && typeof chunkIndex === 'number' && typeof totalChunks === 'number') {
      if (!uploadBuffers.has(uploadId)) {
        uploadBuffers.set(uploadId, {
          chunks: new Map(),
          total: totalChunks,
          timestamp: Date.now()
        });
      }

      const buffer = uploadBuffers.get(uploadId)!;
      buffer.chunks.set(chunkIndex, Array.isArray(chunkPosts) ? chunkPosts : []);
      buffer.timestamp = Date.now();

      // If all chunks received, assemble and persist to public/data/posts.json
      if (buffer.chunks.size >= totalChunks) {
        const assembledPosts: BlogPost[] = [];
        for (let i = 0; i < totalChunks; i++) {
          const chunk = buffer.chunks.get(i) || [];
          assembledPosts.push(...chunk);
        }

        // Deduplicate by ID and slug
        const uniqueMap = new Map<string, BlogPost>();
        assembledPosts.forEach(p => {
          const key = p.slug || p.id;
          if (key) uniqueMap.set(key, p);
        });
        const finalPosts = Array.from(uniqueMap.values());
        finalPosts.sort((a, b) => {
          if (a.updatedAt && b.updatedAt) {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          if (a.updatedAt) return -1;
          if (b.updatedAt) return 1;
          return 0;
        });

        savePostsServer(finalPosts);
        uploadBuffers.delete(uploadId);

        return NextResponse.json({
          success: true,
          mode: 'chunk_completed',
          totalReceived: finalPosts.length,
          message: `Đã tiếp nhận và lưu hoàn tất toàn bộ ${finalPosts.length} bài viết vào public/data/posts.json!`,
          timestamp: new Date().toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        mode: 'chunk_received',
        chunkIndex,
        totalChunks,
        receivedChunks: buffer.chunks.size,
        message: `Đã nhận gói ${chunkIndex + 1}/${totalChunks}`,
        timestamp: new Date().toISOString()
      });
    }

    // Mode 3: Direct standard full sync
    let savedCount = 0;

    if (posts && Array.isArray(posts)) {
      const sortedPosts = [...posts].sort((a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (a.updatedAt) return -1;
        if (b.updatedAt) return 1;
        return 0;
      });
      savePostsServer(sortedPosts);
      savedCount = sortedPosts.length;
    }

    if (projects && Array.isArray(projects)) {
      saveProjectsServer(projects);
    }

    if (pages && Array.isArray(pages)) {
      savePagesServer(pages);
    }

    if (categories && Array.isArray(categories)) {
      saveCategoriesServer(categories);
    }

    if (jekyllConfig) {
      const configPath = path.join(process.cwd(), 'public', 'data', 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(jekyllConfig, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      count: savedCount,
      message: `Đã đồng bộ thành công ${savedCount} bài viết vào nguồn máy chủ AI Studio (public/data/)!`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[persist-posts] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Lỗi khi ghi file dữ liệu máy chủ.' },
      { status: 500 }
    );
  }
}
