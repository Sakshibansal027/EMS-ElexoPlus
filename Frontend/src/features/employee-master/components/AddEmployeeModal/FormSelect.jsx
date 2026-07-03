import CustomSelect from "../ui/CustomSelect";

const FormSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
}) => {
  return (
    <CustomSelect
      label={label}
      placeholder={placeholder}
      options={options}
      value={value}
      onValueChange={onChange}
      width="w-full"
    />
  );
};

export default FormSelect;