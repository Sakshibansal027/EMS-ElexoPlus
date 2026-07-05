const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full
          rounded-xl
          border
          border-[var(--color-border)]
          bg-[var(--color-input)]
          px-4
          py-3
          outline-none
          transition-all
          duration-300
          focus:border-[var(--color-primary)]
          focus:ring-2
          focus:ring-[var(--color-primary)]/20
          placeholder:text-gray-500
        "
      />
     {error && (
  <p className="text-sm text-red-500">
    {error}
  </p>
)}
    </div>
  );
};

export default FormInput;