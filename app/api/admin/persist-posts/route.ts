import { NextRequest, NextResponse } from 'next/server';
import {
  getAllPostsServer,
  getAllProjectsServer,
  getAllPagesServer,
  getAllCategoriesServer,
  getConfigServer,
  savePostsServer,
  saveProjectsServer,
  savePagesServer,
  saveCategoriesServer,
  saveConfigServer,
  saveSinglePostServer,
  getAdminConfigServer,
  saveAdminConfigServer,
  deleteSinglePostServer,
  getAllMediaServer,
  saveMediaServer,
  deleteMediaServer,
  getAllTrashServer,
  saveTrashServer,
  addToTrashServer,
  restoreFromTrashServer,
  deleteFromTrashPermanentlyServer,
  emptyTrashServer,
  getGitStatusServer,
  commitChangesToGit,
  syncDataToInitialCode,
  getUpdatedInitialDataCode,
  pushToGitHubServer
} from '@/lib/server-data';
import {
  commitFilesViaGitHubApi,
  getGitHubStatusViaApi,
  resolveGitHubToken
} from '@/lib/github-api';
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const summary = searchParams.get('summary') === 'true';
    const singleId = searchParams.get('id') || searchParams.get('slug');

    const posts = getAllPostsServer();

    if (singleId) {
      const cleanId = decodeURIComponent(singleId).replace(/\.html$/, '');
      const found = posts.find(p => p.id === cleanId || p.slug === cleanId || p.id === singleId || p.slug === singleId);
      if (found) {
        return NextResponse.json({ success: true, post: found });
      }
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    const projects = getAllProjectsServer();
    const pages = getAllPagesServer();
    const categories = getAllCategoriesServer();
    const jekyllConfig = getConfigServer();
    const adminConfig = getAdminConfigServer();
    const media = getAllMediaServer();
    const trash = getAllTrashServer();

    // In summary mode (used for high-performance store sync), omit heavy article content
    const returnedPosts = summary
      ? posts.map(({ content, ...rest }) => rest)
      : posts;

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts: returnedPosts,
      projects,
      pages,
      categories,
      jekyllConfig,
      adminConfig,
      media,
      trash,
      gitStatus: (await getGitHubStatusViaApi()) || getGitStatusServer(),
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

async function syncAndCommitToGitHub(
  files: Array<{ path: string; content: string }>,
  commitMessage: string,
  token?: string,
  remoteUrl?: string
) {
  // 1. Attempt GitHub API commit (works on Vercel Serverless & local)
  try {
    const apiResult = await commitFilesViaGitHubApi(files, commitMessage, token, remoteUrl);
    if (apiResult.success) {
      return apiResult;
    }
    console.warn('[route] commitFilesViaGitHubApi notice:', apiResult.message);
  } catch (err: any) {
    console.warn('[route] commitFilesViaGitHubApi exception:', err?.message);
  }

  // 2. Fallback to local git CLI (works in AI Studio / local environment)
  return commitChangesToGit(commitMessage);
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
      jekyllConfig,
      adminConfig
    } = isArrayBody ? { posts: body } as any : body;

    // Mode: Direct config save
    if (action === 'save_config' && (body.config || jekyllConfig)) {
      const targetConfig = body.config || jekyllConfig;
      const ok = saveConfigServer(targetConfig);
      if (body.adminConfig) {
        saveAdminConfigServer(body.adminConfig);
      }

      // Commit config to GitHub
      const filesToCommit: Array<{ path: string; content: string }> = [
        { path: 'public/data/config.json', content: JSON.stringify(targetConfig, null, 2) }
      ];
      const initialCode = getUpdatedInitialDataCode('config');
      if (initialCode) {
        filesToCommit.push({ path: 'lib/initial-data.ts', content: initialCode });
      }

      const gitResult = await syncAndCommitToGitHub(
        filesToCommit,
        'chore(config): update website and SEO settings from admin',
        body.token || body.customToken,
        body.remoteUrl
      );

      return NextResponse.json({
        success: true,
        action: 'save_config',
        config: getConfigServer(),
        gitResult,
        message: gitResult?.committed
          ? `Đã lưu cấu hình và đẩy lên GitHub [${gitResult.commitHash}]! Vercel đang cập nhật livesite.`
          : 'Đã lưu cấu hình Website & SEO thành công!',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Media file save / sync
    if (action === 'save_media' && Array.isArray(body.media)) {
      const ok = saveMediaServer(body.media);
      return NextResponse.json({
        success: ok,
        action: 'save_media',
        media: getAllMediaServer(),
        message: 'Đã lưu danh sách tệp media thành công!',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Media file delete (moves to Trash automatically)
    if (action === 'delete_media' && (id || body.deletedItem?.id || body.deletedItem?.path)) {
      const targetId = id || body.deletedItem?.id || body.deletedItem?.path;
      const targetItem = body.deletedItem;
      const targetList = Array.isArray(body.media) ? body.media : undefined;
      const result = deleteMediaServer(targetId, targetList, targetItem);
      return NextResponse.json({
        success: result.success,
        action: 'delete_media',
        deletedId: targetId,
        media: result.media,
        message: 'Đã chuyển tệp media vào thùng rác thành công (có thể khôi phục trong 30 ngày)!',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Trash Restore
    if (action === 'trash_restore' && (body.trashId || id)) {
      const targetId = body.trashId || id;
      const result = restoreFromTrashServer(targetId);
      return NextResponse.json({
        success: result.success,
        action: 'trash_restore',
        restoredItem: result.item,
        remainingTrash: result.remainingTrash,
        message: result.success ? `Đã khôi phục "${result.item?.title || 'mục'}" thành công!` : 'Không tìm thấy mục trong thùng rác',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Trash Delete Permanently
    if (action === 'trash_delete' && (body.trashId || id)) {
      const targetId = body.trashId || id;
      const result = deleteFromTrashPermanentlyServer(targetId);
      return NextResponse.json({
        success: result.success,
        action: 'trash_delete',
        remainingTrash: result.remainingTrash,
        message: 'Đã xóa vĩnh viễn mục khỏi thùng rác!',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Trash Empty
    if (action === 'trash_empty') {
      const ok = emptyTrashServer();
      return NextResponse.json({
        success: ok,
        action: 'trash_empty',
        message: 'Đã dọn sạch thùng rác thành công!',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Trash Add
    if (action === 'trash_add' && body.item) {
      const ok = addToTrashServer(body.item);
      return NextResponse.json({
        success: ok,
        action: 'trash_add',
        item: body.item,
        message: 'Đã đưa mục vào thùng rác!',
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Sync All Data To Codebase & Commit to Git / Push to GitHub
    if (action === 'sync_all_to_code' || action === 'commit_to_git' || action === 'git_push' || action === 'push_to_github') {
      if (Array.isArray(body.posts)) savePostsServer(body.posts);
      if (Array.isArray(body.projects)) saveProjectsServer(body.projects);
      if (Array.isArray(body.pages)) savePagesServer(body.pages);
      if (Array.isArray(body.categories)) saveCategoriesServer(body.categories);
      if (body.config || jekyllConfig) saveConfigServer(body.config || jekyllConfig);
      if (Array.isArray(body.media)) saveMediaServer(body.media);

      syncDataToInitialCode('all');

      const allPosts = getAllPostsServer();
      const allProjects = getAllProjectsServer();
      const allPages = getAllPagesServer();
      const allCategories = getAllCategoriesServer();
      const allConfig = getConfigServer();
      const allMedia = getAllMediaServer();

      const filesToCommit: Array<{ path: string; content: string }> = [
        { path: 'public/data/posts.json', content: JSON.stringify(allPosts, null, 2) },
        { path: 'public/data/projects.json', content: JSON.stringify(allProjects, null, 2) },
        { path: 'public/data/pages.json', content: JSON.stringify(allPages, null, 2) },
        { path: 'public/data/categories.json', content: JSON.stringify(allCategories, null, 2) },
        { path: 'public/data/config.json', content: JSON.stringify(allConfig, null, 2) },
        { path: 'public/data/media.json', content: JSON.stringify(allMedia, null, 2) },
      ];

      const initialCode = getUpdatedInitialDataCode('all');
      if (initialCode) {
        filesToCommit.push({ path: 'lib/initial-data.ts', content: initialCode });
      }

      const gitResult = await syncAndCommitToGitHub(
        filesToCommit,
        body.commitMessage || 'chore(admin): synchronize full website settings and content to GitHub',
        body.token || body.customToken,
        body.remoteUrl
      );

      const currentGitStatus = (await getGitHubStatusViaApi(body.token || body.customToken, body.remoteUrl)) || getGitStatusServer();

      return NextResponse.json({
        success: Boolean(gitResult?.success),
        action: action,
        gitResult,
        gitStatus: currentGitStatus,
        message: gitResult?.committed
          ? `Đã đồng bộ toàn bộ dữ liệu lên GitHub thành công [${gitResult.commitHash}]! Vercel đang tự động build và cập nhật livesite.`
          : (gitResult?.message || 'Đã đồng bộ dữ liệu.'),
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Get real-time Git status
    if (action === 'get_git_status') {
      const apiStatus = await getGitHubStatusViaApi(body?.token || body?.customToken, body?.remoteUrl);
      const currentGitStatus = apiStatus || getGitStatusServer();
      return NextResponse.json({
        success: true,
        action: 'get_git_status',
        gitStatus: currentGitStatus,
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Single post save / update
    if (action === 'save_post' && post) {
      const targetPost = post as BlogPost;
      const { posts: updatedPosts } = saveSinglePostServer(targetPost);

      const filesToCommit: Array<{ path: string; content: string }> = [
        { path: 'public/data/posts.json', content: JSON.stringify(updatedPosts, null, 2) }
      ];
      const initialCode = getUpdatedInitialDataCode('posts');
      if (initialCode) {
        filesToCommit.push({ path: 'lib/initial-data.ts', content: initialCode });
      }

      const gitResult = await syncAndCommitToGitHub(
        filesToCommit,
        `chore(posts): publish/update article "${targetPost.title.substring(0, 50)}"`,
        body.token || body.customToken,
        body.remoteUrl
      );

      const currentGitStatus = (await getGitHubStatusViaApi(body.token || body.customToken, body.remoteUrl)) || getGitStatusServer();

      return NextResponse.json({
        success: true,
        action: 'save_post',
        post: targetPost,
        totalPosts: updatedPosts.length,
        gitResult,
        gitStatus: currentGitStatus,
        message: gitResult?.committed
          ? `Đã lưu bài viết "${targetPost.title}" và đẩy lên GitHub [${gitResult.commitHash}]! Vercel đang tự động build livesite.`
          : `Đã lưu thành công bài viết "${targetPost.title}"!`,
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Single post delete
    if (action === 'delete_post' && id) {
      const { posts: filteredPosts } = deleteSinglePostServer(id);

      const filesToCommit: Array<{ path: string; content: string }> = [
        { path: 'public/data/posts.json', content: JSON.stringify(filteredPosts, null, 2) }
      ];
      const initialCode = getUpdatedInitialDataCode('posts');
      if (initialCode) {
        filesToCommit.push({ path: 'lib/initial-data.ts', content: initialCode });
      }

      const gitResult = await syncAndCommitToGitHub(
        filesToCommit,
        `chore(posts): delete post ${id} from admin`,
        body.token || body.customToken,
        body.remoteUrl
      );

      const currentGitStatus = (await getGitHubStatusViaApi(body.token || body.customToken, body.remoteUrl)) || getGitStatusServer();

      return NextResponse.json({
        success: true,
        action: 'delete_post',
        deletedId: id,
        totalPosts: filteredPosts.length,
        gitResult,
        gitStatus: currentGitStatus,
        message: gitResult?.committed
          ? `Đã xóa bài viết và cập nhật lên GitHub [${gitResult.commitHash}]!`
          : `Đã xóa bài viết khỏi danh sách thành công!`,
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

      const filesToCommit: Array<{ path: string; content: string }> = [
        { path: 'public/data/projects.json', content: JSON.stringify(currentProjects, null, 2) }
      ];
      const initialCode = getUpdatedInitialDataCode('projects');
      if (initialCode) {
        filesToCommit.push({ path: 'lib/initial-data.ts', content: initialCode });
      }

      const gitResult = await syncAndCommitToGitHub(
        filesToCommit,
        `chore(projects): save project "${targetProj.title.substring(0, 50)}"`,
        body.token || body.customToken,
        body.remoteUrl
      );

      const currentGitStatus = (await getGitHubStatusViaApi(body.token || body.customToken, body.remoteUrl)) || getGitStatusServer();

      return NextResponse.json({
        success: true,
        action: 'save_project',
        project: targetProj,
        totalProjects: currentProjects.length,
        gitResult,
        gitStatus: currentGitStatus,
        message: gitResult?.committed
          ? `Đã lưu dự án "${targetProj.title}" và đẩy lên GitHub [${gitResult.commitHash}]!`
          : `Đã lưu thành công dự án "${targetProj.title}"!`,
        timestamp: new Date().toISOString()
      });
    }

    // Mode: Single project delete
    if (action === 'delete_project' && id) {
      const currentProjects = getAllProjectsServer();
      const filtered = currentProjects.filter((p) => p.id !== id && p.slug !== id);
      saveProjectsServer(filtered);

      const filesToCommit: Array<{ path: string; content: string }> = [
        { path: 'public/data/projects.json', content: JSON.stringify(filtered, null, 2) }
      ];
      const initialCode = getUpdatedInitialDataCode('projects');
      if (initialCode) {
        filesToCommit.push({ path: 'lib/initial-data.ts', content: initialCode });
      }

      const gitResult = await syncAndCommitToGitHub(
        filesToCommit,
        `chore(projects): delete project ${id} from admin`,
        body.token || body.customToken,
        body.remoteUrl
      );

      const currentGitStatus = (await getGitHubStatusViaApi(body.token || body.customToken, body.remoteUrl)) || getGitStatusServer();

      return NextResponse.json({
        success: true,
        action: 'delete_project',
        deletedId: id,
        totalProjects: filtered.length,
        gitResult,
        gitStatus: currentGitStatus,
        message: gitResult?.committed
          ? `Đã xóa dự án và cập nhật lên GitHub [${gitResult.commitHash}]!`
          : `Đã xóa dự án thành công!`,
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
      const currentServerPosts = getAllPostsServer();
      let postsToSave: BlogPost[];

      // If client only sends a small subset (e.g. newly created AI post), safely upsert without wiping existing 900+ posts
      if (posts.length < 50 && currentServerPosts.length > 50) {
        const postMap = new Map<string, BlogPost>();
        posts.forEach((p) => {
          const key = p.id || p.slug;
          if (key) postMap.set(key, p);
        });
        currentServerPosts.forEach((p) => {
          const key = p.id || p.slug;
          if (key && !postMap.has(key)) {
            postMap.set(key, p);
          }
        });
        postsToSave = Array.from(postMap.values());
      } else {
        postsToSave = posts;
      }

      const sortedPosts = [...postsToSave].sort((a, b) => {
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
      const finalConfig = { ...jekyllConfig };
      // If logo is base64, save to static /logo.png & /images/logo.png
      if (finalConfig.logo && finalConfig.logo.startsWith('data:image/')) {
        try {
          const match = finalConfig.logo.match(/^data:image\/([a-zA-Z0-9\+\.]+);base64,(.+)$/);
          if (match) {
            const ext = match[1] === 'svg+xml' ? 'svg' : (match[1] === 'jpeg' ? 'jpg' : 'png');
            const buffer = Buffer.from(match[2], 'base64');
            const targetPath = path.join(process.cwd(), 'public', `logo.${ext}`);
            fs.writeFileSync(targetPath, buffer);
            const imgDir = path.join(process.cwd(), 'public', 'images');
            if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
            fs.writeFileSync(path.join(imgDir, `logo.${ext}`), buffer);
            finalConfig.logo = `/logo.${ext}`;
          }
        } catch (e) {
          console.warn('[persist-posts] Failed to extract logo image file:', e);
        }
      }
      // If favicon is base64, save to /favicon.ico
      if (finalConfig.favicon && finalConfig.favicon.startsWith('data:image/')) {
        try {
          const match = finalConfig.favicon.match(/^data:image\/([a-zA-Z0-9\+\.\-]+);base64,(.+)$/);
          if (match) {
            const buffer = Buffer.from(match[2], 'base64');
            fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.ico'), buffer);
            finalConfig.favicon = '/favicon.ico';
          }
        } catch (e) {
          console.warn('[persist-posts] Failed to extract favicon file:', e);
        }
      }
      saveConfigServer(finalConfig);
    }
    if (adminConfig && typeof adminConfig === 'object') {
      saveAdminConfigServer(adminConfig);
    }

    // Always synchronize changes to lib/initial-data.ts and create Git commit
    syncDataToInitialCode('all');
    const gitResult = commitChangesToGit('chore(sync): synchronize content and settings from admin');
    const currentGitStatus = getGitStatusServer();

    return NextResponse.json({
      success: true,
      count: savedCount,
      gitResult,
      gitStatus: currentGitStatus,
      message: gitResult.committed
        ? `Đã đồng bộ thành công vào nguồn máy chủ & tạo commit Git mới [${gitResult.commitHash}]!`
        : `Đã đồng bộ thành công vào nguồn máy chủ và mã nguồn Git (${currentGitStatus.lastCommit})!`,
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
