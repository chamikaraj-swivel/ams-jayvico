import React from "react";
import JayvicoLogo from "./JayvicoLogo";

const Header: React.FC = () => {
  return (
    <header className="bg-primary-900 text-white shadow-lg">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <JayvicoLogo size="md" variant="light" showText={false} />
          <div>
            <p className="text-sm text-primary-200">Jayvico Automobile</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
