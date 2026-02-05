export const HafsaLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Gold background circle */}
    <circle cx="50" cy="50" r="48" fill="currentColor" opacity="0.1" />
    
    {/* Main diamond/jewel shape */}
    <path
      d="M 50 15 L 70 40 L 70 60 L 50 85 L 30 60 L 30 40 Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    
    {/* Inner highlight for gem effect */}
    <path
      d="M 45 30 L 55 40 L 50 50 Z"
      fill="currentColor"
      opacity="0.3"
    />
    
    {/* Letter H */}
    <text
      x="50"
      y="58"
      fontSize="28"
      fontWeight="bold"
      fill="currentColor"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="serif"
    >
      H
    </text>
  </svg>
);

export default HafsaLogo;
