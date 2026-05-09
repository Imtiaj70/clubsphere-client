import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/AuthContext";

const ManageUsers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/admin/users");
      return res.data;
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => axiosInstance.patch(`/api/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const handleRoleChange = (userId, currentRole, newRole, userEmail) => {
    if (userEmail === user.email) {
      toast.error("You cannot change your own role");
      return;
    }
    Swal.fire({
      title: "Change Role?",
      text: `Change this user's role to "${newRole}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6C63FF",
      cancelButtonColor: "#F87272",
      confirmButtonText: "Yes, change it",
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id: userId, role: newRole });
      }
    });
  };

  const roleBadge = (role) => {
    if (role === "admin") return <span className="badge badge-error badge-sm">Admin</span>;
    if (role === "clubManager") return <span className="badge badge-warning badge-sm">Manager</span>;
    return <span className="badge badge-success badge-sm">Member</span>;
  };

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Manage Users</h1>
        <p className="text-base-content/50 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td className="text-base-content/40 text-sm">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <img
                      src={u.photoURL || `https://ui-avatars.com/api/?name=${u.name}&background=6C63FF&color=fff`}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="text-sm text-base-content/60">{u.email}</td>
                <td>{roleBadge(u.role)}</td>
                <td className="text-sm text-base-content/50">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={u.role}
                    disabled={u.email === user.email}
                    onChange={(e) => handleRoleChange(u._id, u.role, e.target.value, u.email)}
                  >
                    <option value="member">Member</option>
                    <option value="clubManager">Club Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
