const Button = ({ 
  children, 
  variant = "default", 
  size = "default",
  className = "",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-600 bg-transparent hover:bg-gray-800 text-white",
    ghost: "hover:bg-gray-800 text-white",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }