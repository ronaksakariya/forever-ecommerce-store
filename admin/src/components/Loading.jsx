const Loading = () => {
  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
