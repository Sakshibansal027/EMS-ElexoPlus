<?php

namespace Modules\Leave\Models;

use Core\Database;
use Modules\Leave\Support\Uuid;

class LeaveRequestDocument
{
    protected const TABLE = 'leave_request_documents';

    public static function find(string $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . ' WHERE document_id = ?'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    /**
     * All documents attached to one leave request — e.g. a medical
     * certificate for a Sick Leave request. A request can have more
     * than one, so this returns a list, not a single row.
     */
    public static function allByRequest(string $leaveRequestId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM ' . self::TABLE . '
             WHERE leave_request_id = ?
             ORDER BY uploaded_at ASC'
        );
        $stmt->execute([$leaveRequestId]);
        return $stmt->fetchAll();
    }

    /**
     * Records a document that's already been uploaded to storage.
     * Note: this method only saves the file's metadata (name, type,
     * url) to the database — it does not handle the actual file
     * upload/move-to-disk step. That belongs in the Controller/
     * Service (handling $_FILES, moving it to a storage path, etc.);
     * by the time this is called, file_url should already point to
     * wherever the file actually lives.
     */
    public static function create(array $data): ?array
    {
        $id = Uuid::generate();

        $stmt = Database::connection()->prepare(
            'INSERT INTO ' . self::TABLE . '
             (document_id, leave_request_id, document_type, file_name, file_url, uploaded_at)
             VALUES (?, ?, ?, ?, ?, NOW())'
        );
        $stmt->execute([
            $id,
            $data['leave_request_id'],
            $data['document_type'],
            $data['file_name'],
            $data['file_url'],
        ]);

        return self::find($id);
    }

    /**
     * Hard delete is fine here (unlike LeavePolicy/LeaveRequest,
     * which we soft-delete). A document row has nothing else
     * pointing at it via FK, and removing a wrongly-attached file
     * doesn't lose any approval history — so there's no reason to
     * keep a dead row around.
     */
    public static function delete(string $id): bool
    {
        $stmt = Database::connection()->prepare(
            'DELETE FROM ' . self::TABLE . ' WHERE document_id = ?'
        );
        return $stmt->execute([$id]);
    }
}