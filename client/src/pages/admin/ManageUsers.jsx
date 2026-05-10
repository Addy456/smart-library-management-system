import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  clearUserState,
} from "../../redux/slices/userSlice";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";
import { Trash2, Shield, User, Users } from "lucide-react";
import { PageHero, Section } from "../../components/ui";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, message } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: null, variant: "danger" });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearUserState());
    }
  }, [error, message, dispatch]);

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      toast.error("You cannot delete your own account!");
      return;
    }
    setConfirm({
      open: true,
      title: "Delete User",
      message: "This action is permanent. Are you sure you want to delete this user?",
      variant: "danger",
      onConfirm: () => { dispatch(deleteUser(id)); setConfirm((c) => ({ ...c, open: false })); },
    });
  };

  const handleRoleToggle = (id, currentRole) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    setConfirm({
      open: true,
      title: "Change Role",
      message: `Are you sure you want to change this user's role to ${newRole}?`,
      variant: "warning",
      onConfirm: () => { dispatch(updateUserRole({ id, role: newRole })); setConfirm((c) => ({ ...c, open: false })); },
    });
  };

  return (
    <div className="space-y-8">
      <PageHero
        variant="admin"
        size="sm"
        eyebrow={<><Users className="h-3.5 w-3.5" /> User management</>}
        title="Manage users"
        subtitle={`${users.length} registered user${users.length !== 1 ? "s" : ""}`}
      />

      <Section accent="primary" padding="sm">
        {/* Mobile card view */}
        <div className="lg:hidden divide-y divide-gray-200 dark:divide-white/5">
          {users.map((u) => (
            <div key={u._id} className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center font-bold text-sm shadow-card">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{u.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>
                </div>
                {u._id === currentUser?._id && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">(You)</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${u.role === "admin" ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30" : "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30"}`}>
                  {u.role}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${u.verified ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"}`}>
                  {u.verified ? "Verified" : "Pending"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Joined {new Date(u.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              {u._id !== currentUser?._id && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleRoleToggle(u._id, u.role)}
                    disabled={loading}
                    className="text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-500/30"
                  >
                    {u.role === "admin" ? "Demote" : "Promote"}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    disabled={loading}
                    className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors border border-rose-200 dark:border-rose-500/30"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <User className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="font-semibold">No users found</p>
            </div>
          )}
        </div>

        {/* Desktop table view */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm">
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">User</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Email</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Role</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Verified</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Joined</th>
                <th className="px-4 py-4 text-left font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center font-bold text-sm shadow-card">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        u.role === "admin"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30"
                          : "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        u.verified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                      }`}
                    >
                      {u.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {u._id !== currentUser?._id && (
                        <>
                          <button
                            onClick={() => handleRoleToggle(u._id, u.role)}
                            disabled={loading}
                            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 p-2 rounded-lg transition-colors"
                            title={u.role === "admin" ? "Demote to member" : "Promote to admin"}
                          >
                            {u.role === "admin" ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={loading}
                            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {u._id === currentUser?._id && (
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">(You)</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <ConfirmModal
        isOpen={confirm.open}
        title={confirm.title}
        message={confirm.message}
        variant={confirm.variant}
        confirmText={confirm.variant === "danger" ? "Delete" : "Confirm"}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
    </div>
  );
};

export default ManageUsers;
