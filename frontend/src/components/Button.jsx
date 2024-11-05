const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  icon: Icon,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      variant === "primary"
        ? "bg-[#bcfe4d] text-black hover:bg-lime-400 disabled:opacity-50"
        : "bg-gray-300 text-gray-800 hover:bg-white disabled:opacity-50"
    }`}
  >
    {Icon && <Icon className="mr-2" size={16} />}
    {children}
  </button>
);

export default Button;
