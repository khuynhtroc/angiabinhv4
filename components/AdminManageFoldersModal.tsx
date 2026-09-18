'use client';

import React, { useState } from 'react';
import { MediaFolderItem, MediaFile } from '@/lib/types';
import { Folder, FolderPlus, Edit2, Trash2, Check, X, AlertTriangle, Layers } from 'lucide-react';

interface AdminManageFoldersModalProps {
  folders: MediaFolderItem[];
  mediaFiles: MediaFile[];
  onClose: () => void;
  onSaveFolder: (folder: MediaFolderItem) => void;
  onDeleteFolder: (folderId: string, folderPath: string) => void;
  onCreateFolder: (name: string, path: string) => void;
}

export default function AdminManageFoldersModal({
  folders,
  mediaFiles,
  onClose,
  onSaveFolder,
  onDeleteFolder,
  onCreateFolder
}: AdminManageFoldersModalProps) {
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPath, setEditPath] = useState('');

  // Create new folder states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPath, setNewPath] = useState('');

  const handleStartEdit = (f: MediaFolderItem) => {
    setEditingFolderId(f.id);
    setEditName(f.name);
    setEditPath(f.path);
  };

  const handleSaveEdit = (f: MediaFolderItem) => {
    if (!editName.trim() || !editPath.trim()) return;
    onSaveFolder({
      ...f,
      name: editName.trim(),
      path: editPath.trim().startsWith('/') ? editPath.trim() : `/${editPath.trim()}`
    });
    setEditingFolderId(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const cleanPath = (newPath.trim() || `/images/${newName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)
      .replace(/\/+/g, '/');
    const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    onCreateFolder(newName.trim(), finalPath);
    setNewName('');
    setNewPath('');
    setShowCreateForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Folder className="w-5 h-5 text-amber-600" />
            <span>Quản Lý &amp; Chỉnh Sửa Danh Mục Thư Mục Tệp Tin</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 text-xs flex-1">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">
              Hiện có {folders.length} thư mục lưu trữ
            </span>
            <button
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>{showCreateForm ? 'Đóng Biểu Mẫu' : '+ Thư Mục Mới'}</span>
            </button>
          </div>

          {/* New Folder Form */}
          {showCreateForm && (
            <form onSubmit={handleCreate} className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                <FolderPlus className="w-4 h-4 text-amber-700" />
                <span>Thêm Thư Mục Chứa Tệp Mới</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Thư Mục</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Chứng chỉ & Hồ sơ LAS"
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      if (!newPath) {
                        const slug = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-");
                        setNewPath(`/images/${slug}`);
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đường Dẫn Lưu Trữ</label>
                  <input
                    type="text"
                    required
                    placeholder="/images/chung-chi"
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 font-black text-slate-950 hover:bg-amber-400"
                >
                  Tạo Thư Mục
                </button>
              </div>
            </form>
          )}

          {/* Folders List Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Tên Thư Mục</th>
                  <th className="py-2.5 px-3">Đường Dẫn (Path)</th>
                  <th className="py-2.5 px-3 text-center">Số Tệp</th>
                  <th className="py-2.5 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {folders.map((f) => {
                  const isEditing = editingFolderId === f.id;
                  const count = mediaFiles.filter(m => m.folder === f.path || (m.path && m.path.startsWith(f.path))).length;

                  return (
                    <tr key={f.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg p-1.5 font-bold w-full"
                          />
                        ) : (
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <Folder className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>{f.name}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPath}
                            onChange={(e) => setEditPath(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-xs w-full"
                          />
                        ) : (
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                            {f.path}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                          {count} tệp
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(f)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold"
                              title="Lưu chỉnh sửa"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingFolderId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-bold"
                              title="Hủy"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(f)}
                              className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                              title="Đổi tên hoặc đường dẫn thư mục"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (folders.length <= 1) {
                                  alert('Cần giữ lại ít nhất 1 thư mục mặc định!');
                                  return;
                                }
                                if (confirm(`Bạn có chắc chắn muốn xóa thư mục "${f.name}"? Các tệp bên trong sẽ được chuyển về thư mục mặc định an toàn.`)) {
                                  onDeleteFolder(f.id, f.path);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa thư mục"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
