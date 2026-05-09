import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../api/axiosInstance";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const EventForm = ({ clubs, onSubmit, defaultValues, isLoading, onClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      ...defaultValues,
      eventDate: defaultValues?.eventDate
        ? new Date(defaultValues.eventDate).toISOString().slice(0, 16)
        : "",
    },
  });
  const isPaid = watch("isPaid");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control md:col-span-2">
          <label className="label pb-1"><span className="label-text font-medium">Event Title *</span></label>
          <input className={`input input-bordered ${errors.title ? "input-error" : ""}`}
            {...register("title", { required: "Title is required" })} />
          {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Club *</span></label>
          <select className={`select select-bordered ${errors.clubId ? "select-error" : ""}`}
            {...register("clubId", { required: "Select a club" })}>
            <option value="">Select club</option>
            {clubs.filter(c => c.status === "approved").map(c =>
              <option key={c._id} value={c._id}>{c.clubName}</option>
            )}
          </select>
          {errors.clubId && <p className="text-error text-xs mt-1">{errors.clubId.message}</p>}
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Location *</span></label>
          <input className={`input input-bordered ${errors.location ? "input-error" : ""}`}
            {...register("location", { required: "Location is required" })} />
          {errors.location && <p className="text-error text-xs mt-1">{errors.location.message}</p>}
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Date & Time *</span></label>
          <input type="datetime-local" className={`input input-bordered ${errors.eventDate ? "input-error" : ""}`}
            {...register("eventDate", { required: "Date is required" })} />
          {errors.eventDate && <p className="text-error text-xs mt-1">{errors.eventDate.message}</p>}
        </div>

        <div className="form-control">
          <label className="label pb-1"><span className="label-text font-medium">Max Attendees</span></label>
          <input type="number" min="1" className="input input-bordered" placeholder="Unlimited"
            {...register("maxAttendees")} />
        </div>

        <div className="form-control flex-row items-center gap-3">
          <input type="checkbox" className="checkbox checkbox-primary"
            {...register("isPaid")} />
          <label className="label-text font-medium cursor-pointer">Paid Event</label>
        </div>

        {isPaid && (
          <div className="form-control">
            <label className="label pb-1"><span className="label-text font-medium">Event Fee ($) *</span></label>
            <input type="number" min="0.01" step="0.01" className="input input-bordered"
              {...register("eventFee", { required: isPaid ? "Fee is required" : false })} />
          </div>
        )}

        <div className="form-control md:col-span-2">
          <label className="label pb-1"><span className="label-text font-medium">Description</span></label>
          <textarea rows={3} className="textarea textarea-bordered"
            {...register("description")} />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? <span className="loading loading-spinner" /> : defaultValues?._id ? "Update Event" : "Create Event"}
        </button>
      </div>
    </form>
  );
};

const ManageEvents = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["managerEvents"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/events/manager/my-events");
      return res.data;
    },
  });

  const { data: clubs = [] } = useQuery({
    queryKey: ["managerClubs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/clubs/manager/my-clubs");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/api/events", data),
    onSuccess: () => { toast.success("Event created!"); queryClient.invalidateQueries(["managerEvents"]); setShowModal(false); },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosInstance.patch(`/api/events/${id}`, data),
    onSuccess: () => { toast.success("Event updated!"); queryClient.invalidateQueries(["managerEvents"]); setShowModal(false); setEditEvent(null); },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/api/events/${id}`),
    onSuccess: () => { toast.success("Event deleted"); queryClient.invalidateQueries(["managerEvents"]); },
    onError: () => toast.error("Failed to delete"),
  });

  const handleDelete = (id) => {
    Swal.fire({ title: "Delete Event?", icon: "warning", showCancelButton: true, confirmButtonColor: "#F87272", confirmButtonText: "Delete" })
      .then((r) => { if (r.isConfirmed) deleteMutation.mutate(id); });
  };

  if (eventsLoading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">Manage Events</h1>
          <p className="text-base-content/50 text-sm mt-1">{events.length} events</p>
        </div>
        <button onClick={() => { setEditEvent(null); setShowModal(true); }} className="btn btn-primary gap-2">
          <FiPlus /> New Event
        </button>
      </div>

      <div className="card bg-base-100 shadow border border-base-300 overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="bg-base-200">
              <th>#</th><th>Title</th><th>Date</th><th>Location</th><th>Fee</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <tr key={event._id}>
                <td className="text-base-content/40 text-sm">{i + 1}</td>
                <td className="font-medium text-sm">{event.title}</td>
                <td className="text-sm text-base-content/60">
                  {new Date(event.eventDate).toLocaleDateString()}
                </td>
                <td className="text-sm text-base-content/60">{event.location}</td>
                <td>
                  <span className={`badge badge-sm ${event.isPaid ? "badge-accent" : "badge-success"}`}>
                    {event.isPaid ? `$${event.eventFee}` : "Free"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <Link to={`/dashboard/manager/registrations/${event._id}`} className="btn btn-ghost btn-xs gap-1">
                      <FiUsers size={12} /> Registrants
                    </Link>
                    <button onClick={() => { setEditEvent(event); setShowModal(true); }} className="btn btn-outline btn-xs btn-primary">
                      <FiEdit2 size={12} />
                    </button>
                    <button onClick={() => handleDelete(event._id)} className="btn btn-outline btn-xs btn-error"
                      disabled={deleteMutation.isPending}>
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="text-center py-12 text-base-content/40">No events yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
          <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <h3 className="text-xl font-bold font-heading mb-5">
              {editEvent ? "Edit Event" : "Create New Event"}
            </h3>
            <EventForm
              clubs={clubs}
              defaultValues={editEvent}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onClose={() => { setShowModal(false); setEditEvent(null); }}
              onSubmit={(data) => {
                if (editEvent) updateMutation.mutate({ id: editEvent._id, data });
                else createMutation.mutate(data);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
