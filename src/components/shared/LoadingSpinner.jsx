const LoadingSpinner = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <p className="mt-4 text-base-content/50 text-sm font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
