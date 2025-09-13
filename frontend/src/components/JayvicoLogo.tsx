import React, { useState } from "react";

interface JayvicoLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
  showText?: boolean;
  className?: string;
}

const JayvicoLogo: React.FC<JayvicoLogoProps> = ({
  size = "md",
  variant = "light",
  showText = true,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
    xl: "h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const logoPath = "/assets/jayvio-logo-1.png";
  const textColor = variant === "light" ? "text-white" : "text-primary-900";

  // If image fails to load, show fallback text
  if (imageError) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div
          className={`${textColor} font-bold ${textSizeClasses[size]} tracking-wide`}
        >
          JAYVICO
        </div>
        <div className={`text-xs ${textColor} tracking-widest`}>AUTOMOBILE</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoPath}
        alt="Jayvico Automobile Logo"
        className={`${sizeClasses[size]} object-contain`}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default JayvicoLogo;
