import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const ClubForm = ({ onSubmit, defaultValues, isLoading, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control md:col-span-2">
          <label className="label pb-1"><span className="label-text font-medium">Club Name *</span></label>
          <input className={`input input-bordered ${errors.clubName ? "input-error" : ""}`}
            {...register("clubName", { required: "Club name is required" })} />
          {errors.clubName && <p className="text-error text-xs mt-1">{errors.clubName.message}</p>}
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Category *</span></label>
          <select className={`select select-bordered ${errors.category ? "select-error" : ""}`}
            {...register("category", { required: "Category is required" })}>
            <option value="">Select category</option>
            {["Photography","Sports","Tech","Music","Books","Hiking","Cooking","Art","Gaming","Dance","Fitness","Travel"].map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
          {errors.category && <p className="text-error text-xs mt-1">{errors.category.message}</p>}
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Location *</span></label>
          <input className={`input input-bordered ${errors.location ? "input-error" : ""}`}
            placeholder="City, Area"
            {...register("location", { required: "Location is required" })} />
          {errors.location && <p className="text-error text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Membership Fee ($)</span></label>
          <input type="number" min="0" step="0.01" className="input input-bordered"
            placeholder="0 for free"
            {...register("membershipFee")} />
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Banner Image URL</span></label>
          <input type="url" className="input input-bordered"
            placeholder="https://example.com/image.jpg"
            {...register("bannerImage")} />
        </div>

        <div className="form-control md:col-span-2">
          <label className="label pb-1"><span className="label-text font-medium">Description *</span></label>
          <textarea rows={3} className={`textarea textarea-bordered ${errors.description ? "textarea-error" : ""}`}
            placeholder="Tell people about this club..."
            {...register("description", { required: "Description is required" })} />
          {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? <span className="loading loading-spinner" /> : defaultValues ? "Update Club" : "Create Club"}
        </button>
      </div>
    </form>
  );
};

const MyClubs = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editClub, setEditClub] = useState(null);

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["managerClubs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/clubs/manager/my-clubs");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/api/clubs", data),
    onSuccess: () => {
      toast.success("Club submitted for approval!");
      queryClient.invalidateQueries(["managerClubs"]);
      setShowModal(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosInstance.patch(`/api/clubs/${id}`, data),
    onSuccess: () => {
      toast.success("Club updated!");
      queryClient.invalidateQueries(["managerClubs"]);
      setShowModal(false);
      setEditClub(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/api/clubs/${id}`),
    onSuccess: () => {
      toast.success("Club deleted");
      queryClient.invalidateQueries(["managerClubs"]);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Club?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F87272",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">My Clubs</h1>
          <p className="text-base-content/50 text-sm mt-1">{clubs.length} clubs</p>
        </div>
        <button onClick={() => { setEditClub(null); setShowModal(true); }} className="btn btn-primary gap-2">
          <FiPlus /> New Club
        </button>
      </div>

      {clubs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏛️</p>
          <p className="text-xl font-semibold">No clubs yet</p>
          <p className="text-base-content/50 mt-2">Create your first club to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {clubs.map((club) => (
            <div key={club._id} className="card bg-base-100 shadow border border-base-300">
              <div className="card-body p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold font-heading">{club.clubName}</h2>
                    <p className="text-xs text-base-content/50 mt-0.5">{club.category} · {club.location}</p>
                  </div>
                  <span className={`badge badge-sm flex-shrink-0 ${
                    club.status === "approved" ? "badge-success" :
                    club.status === "pending" ? "badge-warning" : "badge-error"
                  }`}>{club.status}</span>
                </div>

                <p className="text-sm text-base-content/60 line-clamp-2 mt-2">{club.description}</p>

                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="flex items-center gap-1 text-base-content/50">
                    <FiUsers size={13} /> {club.memberCount || 0} members
                  </span>
                  <span className="font-semibold text-primary">
                    {club.membershipFee > 0 ? `$${club.membershipFee}/yr` : "Free"}
                  </span>
                </div>

                <div className="card-actions justify-between mt-4">
                  <Link to={`/dashboard/manager/members/${club._id}`} className="btn btn-ghost btn-sm gap-1">
                    <FiUsers size={14} /> Members
                  </Link>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditClub(club); setShowModal(true); }}
                      className="btn btn-outline btn-sm btn-primary gap-1">
                      <FiEdit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(club._id)}
                      className="btn btn-outline btn-sm btn-error gap-1"
                      disabled={deleteMutation.isPending}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold font-heading mb-5">
              {editClub ? "Edit Club" : "Create New Club"}
            </h3>
            <ClubForm
              defaultValues={editClub}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onClose={() => { setShowModal(false); setEditClub(null); }}
              onSubmit={(data) => {
                if (editClub) {
                  updateMutation.mutate({ id: editClub._id, data });
                } else {
                  createMutation.mutate(data);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
