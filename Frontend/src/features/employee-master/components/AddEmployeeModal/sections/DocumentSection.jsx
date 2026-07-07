import { FileText } from "lucide-react";
import UploadBox from "../UploadBox";

const DocumentsSection = ({formData,
  handleChange,
  setFormData,}) => {
  return (
    <div
      className="
      rounded-2xl
      border
      border-[var(--color-border)]
      bg-[var(--color-background-secondary)]
      p-7
      "
    >
      {/* Heading */}

      <div className="mb-6 flex items-center gap-3">

        <div
          className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-[rgba(244,194,28,.12)]
          "
        >
          <FileText
            size={22}
            className="text-[var(--color-primary)]"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold">
            Documents
          </h3>

          <p className="text-sm text-gray-400">
            Upload employee documents
          </p>
        </div>

      </div>

      {/* Upload Grid */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <UploadBox title="Resume" />

        <UploadBox title="Offer Letter" />

        <UploadBox title="PAN Card" />

        <UploadBox title="Aadhaar Card" />

      </div>

    </div>
  );
};

export default DocumentsSection;