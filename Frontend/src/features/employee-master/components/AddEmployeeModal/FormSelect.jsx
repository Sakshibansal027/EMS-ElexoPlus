import CustomSelect from "../ui/CustomSelect";

const FormSelect = ({
  label,
  options,
  value,
  onChange,
    required = false,
  placeholder = "Select",
  error,
}) => {
  return (
<CustomSelect
  label={label}
  placeholder={placeholder}
  options={options}
  value={value}
  onValueChange={onChange}
  width="w-full"
  required={required}
  error={error}
/>
  );
};

export default FormSelect;