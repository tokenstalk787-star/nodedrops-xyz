"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  status: "ACTIVE" | "SUSPENDED";
  lastLogin: string;
  permissions: {
    canManageUsers: boolean;
    canCreateContent: boolean;
    canPublishContent: boolean;
    canDeleteContent: boolean;
    canManageTheme: boolean;
    canManageNavigation: boolean;
    canManageSeo: boolean;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: "u-1",
      name: "Lead System Administrator",
      email: "admin@nodedrops.xyz",
      role: "ADMIN",
      status: "ACTIVE",
      lastLogin: "Today at 04:12 AM",
      permissions: {
        canManageUsers: true,
        canCreateContent: true,
        canPublishContent: true,
        canDeleteContent: true,
        canManageTheme: true,
        canManageNavigation: true,
        canManageSeo: true,
      },
    },
    {
      id: "u-2",
      name: "Validator Technical Writer",
      email: "editor@nodedrops.xyz",
      role: "EDITOR",
      status: "ACTIVE",
      lastLogin: "Yesterday at 09:30 PM",
      permissions: {
        canManageUsers: false,
        canCreateContent: true,
        canPublishContent: true,
        canDeleteContent: false,
        canManageTheme: false,
        canManageNavigation: false,
        canManageSeo: true,
      },
    },
    {
      id: "u-3",
      name: "Community Infrastructure Reviewer",
      email: "reviewer@nodedrops.xyz",
      role: "VIEWER",
      status: "ACTIVE",
      lastLogin: "Oct 14, 2026",
      permissions: {
        canManageUsers: false,
        canCreateContent: false,
        canPublishContent: false,
        canDeleteContent: false,
        canManageTheme: false,
        canManageNavigation: false,
        canManageSeo: false,
      },
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleOpenDrawer = (user: UserItem) => {
    setSelectedUser({ ...user, permissions: { ...user.permissions } });
    setShowDrawer(true);
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;
    setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
    setShowDrawer(false);
    setSuccessMsg(`Permissions updated for ${selectedUser.name}.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-card-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="text-brand-purple font-semibold uppercase">Access & Security</span>
            <span>/</span>
            <span className="text-text-primary">Users & Permissions</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-1">
            User Accounts & Granular Permissions
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage administrative access levels, role-based access control (RBAC), and inspect activity history.
          </p>
        </div>

        <div className="p-3 rounded-xl border border-brand-purple/30 bg-brand-purple/10 text-xs text-text-secondary max-w-md">
          <strong className="text-brand-cyan">Security Guard:</strong> Minimum 1 active administrator required. CLI provisioning via <code className="text-brand-cyan">npm run admin:create</code>.
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-dark-card-border flex items-center justify-between">
          <div className="text-sm font-semibold text-text-primary">Authorized Operators</div>
          <span className="text-xs font-mono text-text-muted">{users.length} registered accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-dark-bg/60 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-dark-card-border">
              <tr>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-card-border text-text-secondary">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-dark-card-hover/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-text-primary">{u.name}</div>
                    <div className="text-xs font-mono text-text-muted mt-0.5">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={u.role === "ADMIN" ? "default" : u.role === "EDITOR" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-text-muted">
                    {u.lastLogin}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDrawer(u)}
                      className="h-8 text-xs border-dark-card-border hover:bg-dark-card-hover text-brand-purple"
                    >
                      Manage Permissions
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent User Activity Timeline - Matching Image 9 */}
      <div className="bg-dark-card border border-dark-card-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-dark-card-border pb-3">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            User Activity & Security Audit Log
          </h3>
          <span className="text-xs font-mono text-text-muted">Real-time stream</span>
        </div>

        <div className="space-y-3">
          {[
            {
              user: "Lead System Administrator",
              action: "Updated Theme Tokens (Preset: Violet Bloom)",
              time: "10 minutes ago",
              ip: "192.168.1.1",
            },
            {
              user: "Validator Technical Writer",
              action: "Published Celestia Mocha Node Guide (v0.13.0)",
              time: "2 hours ago",
              ip: "10.0.4.15",
            },
            {
              user: "Lead System Administrator",
              action: "Configured 301 Redirect: /setup-celestia -> /guides/celestia-node-setup",
              time: "5 hours ago",
              ip: "192.168.1.1",
            },
            {
              user: "Validator Technical Writer",
              action: "Updated Header Navigation: Added Learn Link",
              time: "Yesterday at 4:10 PM",
              ip: "10.0.4.15",
            },
          ].map((log, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-dark-bg/60 border border-dark-card-border text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-purple flex-shrink-0" />
                <div>
                  <span className="font-semibold text-text-primary">{log.user}</span>
                  <span className="text-text-muted ml-1.5">{log.action}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-text-muted">
                <span>{log.time}</span>
                <span>•</span>
                <span>{log.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Slide-over Drawer - Matching Image 9 */}
      {showDrawer && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-end">
          <div className="bg-dark-card border-l border-dark-card-border w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6 overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-dark-card-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Permissions: {selectedUser.name}
                  </h3>
                  <div className="text-xs font-mono text-text-muted mt-0.5">
                    {selectedUser.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  ✕
                </button>
              </div>

              {/* Role Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Assigned System Role
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value as any })
                  }
                  className="w-full bg-dark-bg border border-dark-card-border rounded-md px-3 py-2 text-xs text-text-primary"
                >
                  <option value="ADMIN">ADMIN — Full Administrative Rights</option>
                  <option value="EDITOR">EDITOR — Content Authoring & Publishing</option>
                  <option value="VIEWER">VIEWER — Read-Only Reviewer</option>
                </select>
              </div>

              {/* Granular Permission Checkboxes - Matching Image 9 */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-brand-purple uppercase tracking-wider">
                  User & Role Privileges
                </div>
                <label className="flex items-center gap-3 text-xs text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUser.permissions.canManageUsers}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        permissions: {
                          ...selectedUser.permissions,
                          canManageUsers: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                  />
                  <span>Manage User Accounts & Privileges</span>
                </label>

                <div className="text-xs font-semibold text-brand-purple uppercase tracking-wider pt-2">
                  Content Management
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canCreateContent}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          permissions: {
                            ...selectedUser.permissions,
                            canCreateContent: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                    />
                    <span>Create Guides, Networks & Opportunities</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canPublishContent}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          permissions: {
                            ...selectedUser.permissions,
                            canPublishContent: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                    />
                    <span>Publish & Revalidate Live Content</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canDeleteContent}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          permissions: {
                            ...selectedUser.permissions,
                            canDeleteContent: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                    />
                    <span>Delete Content Items & Archive Pages</span>
                  </label>
                </div>

                <div className="text-xs font-semibold text-brand-purple uppercase tracking-wider pt-2">
                  Platform & Design System
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageTheme}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          permissions: {
                            ...selectedUser.permissions,
                            canManageTheme: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                    />
                    <span>Modify Global Theme & Brand Colors</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageNavigation}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          permissions: {
                            ...selectedUser.permissions,
                            canManageNavigation: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                    />
                    <span>Configure Header & Footer Layouts</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUser.permissions.canManageSeo}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          permissions: {
                            ...selectedUser.permissions,
                            canManageSeo: e.target.checked,
                          },
                        })
                      }
                      className="rounded border-dark-card-border bg-dark-bg text-brand-purple"
                    />
                    <span>Manage SEO Robots & 301 Redirect Rules</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-dark-card-border flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDrawer(false)}
                className="border-dark-card-border"
              >
                Cancel
              </Button>
              <Button variant="default" onClick={handleSavePermissions}>
                Save Privileges
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
