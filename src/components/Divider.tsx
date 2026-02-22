const TextDivider = ({
  text = 'OR',
  className = ' mt-4 mb-6',
  border='border-border',
}: {
  text?: string;
  className?: string;
  border?: string;
}) => {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <hr className={`grow border-t  ${border}`} />
      <span className="px-4 _p">{text}</span>
      <hr className={`grow border-t ${border}`} />
    </div>
  );
};

export default TextDivider;
