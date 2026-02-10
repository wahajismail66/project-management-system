import React, { useState, useEffect } from "react";

const LiquidFormModal = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  buttonText = "Continue",
  buttonClassName = "bg-blue-600/80 hover:bg-blue-600",
  footerText = "Already have an account?",
  footerLinkText = "Login",
  onFooterLinkClick = () => {},
  containerClassName = "max-w-md p-8",
  fieldsClassName = "space-y-5",
}) => {
  const [formData, setFormData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const initialData = {};
      fields.forEach(
        (field) => (initialData[field.name] = field.defaultValue || ""),
      );
      setFormData(initialData);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      {/* Liquid Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className={`
          relative w-full overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isAnimating ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-8 opacity-0"}
          bg-white/30   
          backdrop-blur-3xl 
          rounded-[38px] 
          border border-white/40  
          shadow-2xl ring-1 ring-black/5
          ${containerClassName}
        `}
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/20 to-transparent" />

        <h2 className="relative text-2xl font-bold text-gray-500 mb-6 tracking-tight">
          {title}
        </h2>

        <div className={`relative grid grid-cols-2 gap-x-4 ${fieldsClassName}`}>
          {fields.map((field) => (
            <div
              key={field.name}
              className={`flex flex-col gap-1.5 ${field.halfWidth ? "col-span-1" : "col-span-2"}`}
            >
              <label className="text-sm font-medium text-gray-500 ml-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                required={field.required}
                className="
                  w-full px-4 py-2.5 
                  bg-white/40
                  border border-gray-400/50
                  rounded-2xl 
                  text-gray-900
                  placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/60
                  transition-all duration-200
                "
              />
            </div>
          ))}
        </div>

        <div className="relative mt-10 flex flex-col gap-3 text-center">
          <button
            type="submit"
            className={`w-full py-4 ${buttonClassName} text-white font-semibold rounded-2xl backdrop-blur-md shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]`}
          >
            {buttonText}
          </button>

          {/* DYNAMIC FOOTER TEXT */}
          <p className="mt-2 text-sm text-gray-500">
            {footerText}{" "}
            <button
              type="button"
              onClick={onFooterLinkClick}
              className="font-bold text-blue-600 hover:underline"
            >
              {footerLinkText}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LiquidFormModal;
