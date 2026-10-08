export interface GitHubStatusResult {
  branch: string;
  lastCommit: string;
  clean: boolean;
  uncommittedFiles: string[];
  totalCommits: number;
  remoteUrl: string | null;
  recentCommits: Array<{ hash: string; date: string; message: string }>;
  isGitHubApi?: boolean;
}

export interface CommitFilePayload {
  path: string;
  content: string;
}

export interface GitHubCommitResult {
  success: boolean;
  committed: boolean;
  commitHash?: string;
  fullSha?: string;
  message: string;
  remotePushed?: boolean;
  buildTriggered?: boolean;
}

const DEFAULT_OWNER = 'khuynhtroc';
const DEFAULT_REPO = 'angiabinhv4';
const DEFAULT_BRANCH = 'main';

export function resolveGitHubToken(customToken?: string): string {
  if (customToken && customToken.trim()) return customToken.trim();
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim()) return process.env.GITHUB_TOKEN.trim();
  if (process.env.GITHUB_PAT && process.env.GITHUB_PAT.trim()) return process.env.GITHUB_PAT.trim();
  return '';
}

export function resolveGitHubRepo(customRemoteUrl?: string): { owner: string; repo: string; branch: string } {
  let owner = process.env.GITHUB_OWNER || DEFAULT_OWNER;
  let repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;

  if (customRemoteUrl && typeof customRemoteUrl === 'string') {
    const match = customRemoteUrl.match(/github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?$/i);
    if (match) {
      owner = match[1];
      repo = match[2];
    }
  }

  return { owner, repo, branch };
}

/**
 * Fetch real-time Git repository status directly from GitHub REST API.
 * Works seamlessly on Vercel Serverless environment where local git CLI is not available.
 */
export async function getGitHubStatusViaApi(
  customToken?: string,
  customRemoteUrl?: string
): Promise<GitHubStatusResult | null> {
  const token = resolveGitHubToken(customToken);
  const { owner, repo, branch } = resolveGitHubRepo(customRemoteUrl);

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'AnGiaBinh-NextApp'
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 1. Fetch branch information (latest commit)
    const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, {
      headers,
      cache: 'no-store'
    });

    if (!branchRes.ok) {
      console.warn(`[github-api] Failed to fetch branch ${branch}: HTTP ${branchRes.status}`);
      return null;
    }

    const branchData = await branchRes.json();
    const latestCommit = branchData.commit;
    const shortSha = latestCommit.sha.slice(0, 7);
    const commitMsg = (latestCommit.commit?.message || '').split('\n')[0];
    const commitDate = latestCommit.commit?.committer?.date || latestCommit.commit?.author?.date || '';

    // 2. Fetch last 5 commits for history log
    let recentCommits: Array<{ hash: string; date: string; message: string }> = [];
    try {
      const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=5`, {
        headers,
        cache: 'no-store'
      });
      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        if (Array.isArray(commitsData)) {
          recentCommits = commitsData.map((c: any) => ({
            hash: c.sha ? c.sha.slice(0, 7) : '',
            date: c.commit?.author?.date ? c.commit.author.date.split('T')[0] : '',
            message: (c.commit?.message || '').split('\n')[0]
          }));
        }
      }
    } catch {}

    return {
      branch,
      lastCommit: `${shortSha} - ${commitMsg} (${commitDate ? new Date(commitDate).toLocaleDateString('vi-VN') : 'gần đây'})`,
      clean: true,
      uncommittedFiles: [],
      totalCommits: recentCommits.length > 0 ? 5 : 1,
      remoteUrl: `https://github.com/${owner}/${repo}.git`,
      recentCommits,
      isGitHubApi: true
    };
  } catch (err) {
    console.error('[github-api] getGitHubStatusViaApi error:', err);
    return null;
  }
}

/**
 * Commit one or multiple files directly to GitHub using GitHub Git Database API (blobs, trees, commits, refs).
 * This creates a real, atomic Git commit in GitHub without needing local git CLI or a writable disk.
 * Vercel will automatically detect the commit webhook and rebuild the live website.
 */
export async function commitFilesViaGitHubApi(
  files: CommitFilePayload[],
  commitMessage: string,
  customToken?: string,
  customRemoteUrl?: string
): Promise<GitHubCommitResult> {
  const token = resolveGitHubToken(customToken);
  const { owner, repo, branch } = resolveGitHubRepo(customRemoteUrl);

  if (!files || files.length === 0) {
    return {
      success: true,
      committed: false,
      message: 'Không có tệp nào cần commit.'
    };
  }

  if (!token) {
    return {
      success: false,
      committed: false,
      message: 'Chưa cấu hình GITHUB_TOKEN trên Vercel. Vui lòng cấu hình biến môi trường GITHUB_TOKEN trong Vercel Settings để kích hoạt đồng bộ tự động lên Livesite.'
    };
  }

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'AnGiaBinh-NextApp'
  };

  try {
    // 1. Get latest commit SHA on the branch
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, {
      headers,
      cache: 'no-store'
    });

    if (!refRes.ok) {
      const errText = await refRes.text();
      throw new Error(`Không thể lấy HEAD của nhánh ${branch} (HTTP ${refRes.status}): ${errText}`);
    }

    const refData = await refRes.json();
    const currentCommitSha: string = refData.object.sha;

    // 2. Get tree SHA of the current commit
    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${currentCommitSha}`, {
      headers,
      cache: 'no-store'
    });

    if (!commitRes.ok) {
      throw new Error(`Không thể lấy commit ${currentCommitSha} (HTTP ${commitRes.status})`);
    }

    const commitData = await commitRes.json();
    const baseTreeSha: string = commitData.tree.sha;

    // 3. Create Blobs for each file to commit
    const treeItems: Array<{ path: string; mode: string; type: string; sha: string }> = [];

    for (const file of files) {
      const cleanPath = file.path.replace(/^[/\\]+/, '').replace(/\\/g, '/');
      const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: file.content,
          encoding: 'utf-8'
        })
      });

      if (!blobRes.ok) {
        const errText = await blobRes.text();
        throw new Error(`Không thể tạo blob cho tệp ${cleanPath} (HTTP ${blobRes.status}): ${errText}`);
      }

      const blobData = await blobRes.json();
      treeItems.push({
        path: cleanPath,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha
      });
    }

    // 4. Create new Tree
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: treeItems
      })
    });

    if (!treeRes.ok) {
      const errText = await treeRes.text();
      throw new Error(`Không thể tạo Git tree mới (HTTP ${treeRes.status}): ${errText}`);
    }

    const treeData = await treeRes.json();
    const newTreeSha: string = treeData.sha;

    // 5. Create new Commit
    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message: commitMessage,
        tree: newTreeSha,
        parents: [currentCommitSha],
        author: {
          name: 'An Gia Binh Admin',
          email: 'admin@betongangiabinh.vn',
          date: new Date().toISOString()
        }
      })
    });

    if (!newCommitRes.ok) {
      const errText = await newCommitRes.text();
      throw new Error(`Không thể tạo commit mới trên GitHub (HTTP ${newCommitRes.status}): ${errText}`);
    }

    const newCommitData = await newCommitRes.json();
    const newCommitSha: string = newCommitData.sha;
    const shortSha = newCommitSha.slice(0, 7);

    // 6. Update branch reference (points branch to new commit)
    const updateRefRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        sha: newCommitSha,
        force: false
      })
    });

    if (!updateRefRes.ok) {
      const errText = await updateRefRes.text();
      throw new Error(`Không thể cập nhật nhánh ${branch} sang commit mới (HTTP ${updateRefRes.status}): ${errText}`);
    }

    return {
      success: true,
      committed: true,
      commitHash: shortSha,
      fullSha: newCommitSha,
      remotePushed: true,
      buildTriggered: true,
      message: `Đã tự động commit và đẩy lên GitHub thành công [${shortSha}]! Vercel đã nhận sự kiện và đang tự động build lại livesite (khoảng 1 - 2 phút).`
    };
  } catch (err: any) {
    console.error('[github-api] commitFilesViaGitHubApi error:', err);
    return {
      success: false,
      committed: false,
      message: err?.message || 'Lỗi không xác định khi commit qua GitHub API.'
    };
  }
}
