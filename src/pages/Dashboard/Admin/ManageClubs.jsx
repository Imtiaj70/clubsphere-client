import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiCheck, FiX } from "react-icons/fi";

const ManageClubs = () => {
  const queryClient = useQueryClient();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["adminClubs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/clubs/admin/all");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      axiosInstance.patch(`/api/clubs/${id}/status`, { status }),
    onSuccess: (_, { status }) => {
      toast.success(`Club ${status}`);
      queryClient.invalidateQueries(["adminClubs"]);
    },
    onError: () => toast.error("Failed to update status"),
  });

  const handleStatus = (id, status) => {
    Swal.fire({
      title: `${status === "approved" ? "Approve" : "Reject"} Club?`,
      icon: status === "approved" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#36D399" : "#F87272",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) statusMutation.mutate({ id, status });
    });
  };

  const statusBadge = (status) => {
    if (status === "approved") return <span className="badge badge-success badge-sm">Approved</span>;
    if (status === "rejected") return <span className="badge badge-error badge-sm">Rejected</span>;
    return <span className="badge badge-warning badge-sm">Pending</span>;
  };

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Manage Clubs</h1>
        <p className="text-base-content/50 text-sm mt-1">{clubs.length} total clubs</p>
      </div>

      <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Club</th>
              <th>Manager</th>
              <th>Category</th>
              <th>Fee</th>
              <th>Members</th>
              <th>Events</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club, i) => (
              <tr key={club._id}>
                <td className="text-base-content/40 text-sm">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {club.clubName?.[0]}
                    </div>
                    <span className="font-medium text-sm">{club.clubName}</span>
                  </div>
                </td>
                <td className="text-sm text-base-content/60">{club.managerEmail}</td>
                <td className="text-sm">{club.category}</td>
                <td className="text-sm">{club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}</td>
                <td className="text-sm">{club.memberCount || 0}</td>
                <td className="text-sm">{club.eventCount || 0}</td>
                <td>{statusBadge(club.status)}</td>
                <td>
                  {club.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStatus(club._id, "approved")}
                        className="btn btn-success btn-xs gap-1"
                        disabled={statusMutation.isPending}
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleStatus(club._id, "rejected")}
                        className="btn btn-error btn-xs gap-1"
                        disabled={statusMutation.isPending}
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  )}
                  {club.status !== "pending" && (
                    <span className="text-xs text-base-content/40">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClubs;
