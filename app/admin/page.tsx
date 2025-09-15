export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-800">Manage posts, announcements, and gallery.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        <a href="/admin/posts" className="rounded-lg border p-4 hover:shadow text-gray-900">Posts</a>
        <a href="/admin/announcements" className="rounded-lg border p-4 hover:shadow text-gray-900">Announcements</a>
        <a href="/admin/gallery" className="rounded-lg border p-4 hover:shadow text-gray-900">Gallery</a>
      </div>
    </div>
  );
}
