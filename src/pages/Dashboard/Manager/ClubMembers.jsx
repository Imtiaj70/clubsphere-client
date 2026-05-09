import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ClubMembers = () => {
  const { clubId } = useParams();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/memberships/club/${clubId}`);
      return res.data;
    },
  });

  const expireMutation = useMutation({
    mutationFn: (id) => axiosInstance.patch(`/api/memberships/${id}/expire`),
    onSuccess: () => {
      toast.success("Membership expired");
      queryClient.invalidateQueries(["clubMembers", clubId]);
    },
    onError: () => toast.error("Failed"),
  });

  const handleExpire = (id) => {
    Swal.fire({
      title: "Expire Membership?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F87272",
      confirmButtonText: "Yes, expire",
    }).then((r) => { if (r.isConfirmed) expireMutation.mutate(id); });
  };

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Club Members</h1>
        <p className="text-base-content/50 text-sm mt-1">{members.length} total members</p>
      </div>

      <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-200">
              <th>#</th><th>Member</th><th>Email</th><th>Status</th><th>Joined</th><th>Expires</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m._id}>
                <td className="text-base-content/40 text-sm">{i + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <img src={m.userPhoto || `https://ui-avatars.com/api/?name=${m.userName}&background=6C63FF&color=fff`}
                      alt="" className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium">{m.userName}</span>
                  </div>
                </td>
                <td className="text-sm text-base-content/60">{m.userEmail}</td>
                <td>
                  <span className={`badge badge-sm ${m.status === "active" ? "badge-success" : "badge-error"}`}>
                    {m.status}
                  </span>
                </td>
                <td className="text-sm text-base-content/50">{new Date(m.joinedAt).toLocaleDateString()}</td>
                <td className="text-sm text-base-content/50">
                  {m.expiresAt ? new Date(m.expiresAt).toLocaleDateString() : "—"}
                </td>
                <td>
                  {m.status === "active" && (
                    <button onClick={() => handleExpire(m._id)} className="btn btn-error btn-xs">
                      Expire
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="text-center py-12 text-base-content/40">No members yet</div>
        )}
      </div>
    </div>
  );
};

export default ClubMembers;
