import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiCalendar, FiMapPin, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const queryClient = useQueryClient();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["myRegistrations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/registrations/my");
      return res.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => axiosInstance.patch(`/api/registrations/${id}/cancel`),
    onSuccess: () => {
      toast.success("Registration cancelled");
      queryClient.invalidateQueries(["myRegistrations"]);
    },
    onError: () => toast.error("Failed to cancel"),
  });

  const handleCancel = (id) => {
    Swal.fire({
      title: "Cancel Registration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F87272",
      confirmButtonText: "Yes, cancel",
    }).then((r) => { if (r.isConfirmed) cancelMutation.mutate(id); });
  };

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">My Events</h1>
        <p className="text-base-content/50 text-sm mt-1">{registrations.length} registrations</p>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📅</p>
          <p className="text-xl font-semibold">No events yet</p>
          <Link to="/events" className="btn btn-primary mt-4">Browse Events</Link>
        </div>
      ) : (
        <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="bg-base-200">
                <th>#</th><th>Event</th><th>Date</th><th>Location</th><th>Status</th><th>Fee</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, i) => (
                <tr key={reg._id}>
                  <td className="text-base-content/40 text-sm">{i + 1}</td>
                  <td>
                    <p className="font-medium text-sm">{reg.event?.title}</p>
                    <p className="text-xs text-base-content/40">{reg.event?.clubId}</p>
                  </td>
                  <td className="text-sm text-base-content/60">
                    {reg.event ? new Date(reg.event.eventDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="text-sm text-base-content/60">{reg.event?.location || "—"}</td>
                  <td>
                    <span className={`badge badge-sm ${reg.status === "registered" ? "badge-success" : "badge-error"}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td>
                    {reg.paymentId ? <span className="badge badge-primary badge-sm">Paid</span> : <span className="badge badge-success badge-sm">Free</span>}
                  </td>
                  <td>
                    {reg.status === "registered" && (
                      <button onClick={() => handleCancel(reg._id)}
                        className="btn btn-error btn-xs gap-1"
                        disabled={cancelMutation.isPending}>
                        <FiX size={12} /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
