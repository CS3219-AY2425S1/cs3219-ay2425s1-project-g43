const Select = ({ value, onChange, options, disabled = false }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-lg border border-gray-300/30 bg-black px-2 py-2 text-center font-sans text-sm text-white focus:outline-none"
    disabled={disabled}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default Select;
