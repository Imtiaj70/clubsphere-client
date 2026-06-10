import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ClubCard from "../../components/shared/ClubCard";
import { SkeletonGrid } from "../../components/shared/SkeletonCard";
import Pagination from "../../components/shared/Pagination";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";

const ITEMS_PER_PAGE = 8;

const Clubs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs", search, category, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);
      const res = await axiosInstance.get(`/api/clubs?${params}`);
      return res.data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/clubs/categories");
      return res.data;
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams({ search, category });
  };

  // Pagination
  const totalPages = Math.ceil(clubs.length / ITEMS_PER_PAGE);
  const paginatedClubs = clubs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-neutral py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading text-white mb-3"
          >
            Browse All Clubs
          </motion.h1>
          <p className="text-white/60 text-lg">Find your perfect community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-2xl shadow-md p-5 mb-8 border border-base-300"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search clubs by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
              className="select select-bordered md:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
              className="select select-bordered md:w-48"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="fee_high">Highest Fee</option>
              <option value="fee_low">Lowest Fee</option>
            </select>
            <button type="submit" className="btn btn-primary gap-2">
              <FiFilter /> Filter
            </button>
          </form>
        </motion.div>

        {!isLoading && (
          <p className="text-base-content/50 text-sm mb-6">
            Showing <span className="font-semibold text-primary">{clubs.length}</span> clubs
            {category && <> in <span className="font-semibold">{category}</span></>}
          </p>
        )}

        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : clubs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-neutral">No clubs found</p>
            <p className="text-base-content/50 mt-2">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedClubs.map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Clubs;
