# Making uploads publicly reachable

`storage/uploads` sits outside `public/` (the web root), so files saved
here by `LeaveRequestDocumentController` are NOT reachable over HTTP
until you symlink them in.

One-time setup (from the `backend/` project root):

​```bash
# Linux / macOS
ln -s ../storage/uploads public/uploads

# Windows (run as Administrator, from backend/)
mklink /D public\uploads ..\storage\uploads
​```

After that, a file saved to `storage/uploads/leave-documents/{id}/x.pdf`
is served at `http://<host>/uploads/leave-documents/{id}/x.pdf`, which
matches the `file_url` that `LeaveRequestDocumentController` now writes
to the database.

If you'd rather not symlink (e.g. some hosts disallow it), the
alternative is a dedicated route that reads the file from
`storage/uploads` and streams it back.