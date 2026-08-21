import {
  FileText,
  Eye,
  Download,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import SectionTitle from "./SectionTitle";

const DocumentsSection = ({ employee }) => {
  const documents = Array.isArray(employee?.documents) ? employee.documents : [];

  return (
    <div className="mt-10">

      <SectionTitle title="Documents" />

      <div
        className="
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background-secondary)]
        overflow-hidden
        "
      >
        {documents.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-[var(--color-muted-foreground)]">
            No employee documents are available.
          </p>
        ) : documents.map((doc, index) => (
          <div
            key={doc.name}
            className={`
            flex
            items-center
            justify-between
            px-6
            py-5
            transition-all
            hover:bg-[rgba(244,194,28,.05)]
            ${
              index !== documents.length - 1
                ? "border-b border-[var(--color-border)]"
                : ""
            }
            `}
          >
            {/* Left */}

            <div className="flex items-center gap-4">

              <div
                className="
                h-11
                w-11
                rounded-xl
                bg-[rgba(244,194,28,.12)]
                flex
                items-center
                justify-center
                "
              >
                <FileText
                  size={20}
                  className="text-[var(--color-primary)]"
                />
              </div>

              <div>

                <h4 className="font-medium">
                  {doc.name}
                </h4>

                <div className="mt-1">

                  {doc.status === "Uploaded" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-400">
                      <CheckCircle2 size={14} />
                      Uploaded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-3 py-1 text-xs text-yellow-400">
                      <Clock3 size={14} />
                      Pending
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="flex items-center gap-3">

              <button
                className="
                rounded-xl
                p-2
                transition
                hover:bg-[rgba(244,194,28,.12)]
                hover:text-[var(--color-primary)]
                cursor-pointer
                "
              >
                <Eye size={19} />
              </button>

              <button
                className="
                rounded-xl
                p-2
                transition
                hover:bg-[rgba(244,194,28,.12)]
                hover:text-[var(--color-primary)]
                cursor-pointer
                "
              >
                <Download size={19} />
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default DocumentsSection;
