import React from 'react';

interface TextBuilderProps {
  text: string;
  isMain?: boolean;
  className? : string;
}

const TextBuilder: React.FC<TextBuilderProps> = ({ text, isMain = false,className = '' }) => {
  return (
    <div
      className={`${
        isMain
          ? ' text-[var(--text-primary)] font-semibold'
          : ' text-[var(--text-secondary)] font-light'
      } ${className} ` }
    >
      {text}
    </div>
  );
};

export default TextBuilder;
