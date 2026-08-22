import { UploadCloud } from "lucide-react";

const UploadBox = ({ title, file, onFileChange }) => {
  return (
    <label
      className="
      group
      flex
      cursor-pointer
      flex-col
      items-center
      justify-center
      rounded-2xl
      border-2
      border-dashed
      border-[var(--color-border)]
      bg-[var(--color-background)]
      p-6
      text-center
      transition-all
      duration-300
      hover:border-[var(--color-primary)]
      hover:bg-[rgba(244,194,28,.05)]
      "
    >
      <UploadCloud
        size={34}
        className="
        mb-4
        text-[var(--color-primary)]
        transition-transform
        duration-300
        group-hover:scale-110
        "
      />

      <h4 className="font-semibold">
        {title}
      </h4>

      <p className="mt-2 text-sm text-gray-400">
        {file ? file.name : "Click to upload"}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        PDF, JPG or PNG
      </p>

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(event) => onFileChange?.(event.target.files?.[0] || null)}
      />
    </label>
  );
};

export default UploadBox;
