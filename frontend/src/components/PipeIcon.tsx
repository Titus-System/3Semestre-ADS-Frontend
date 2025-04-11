const PipeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
    >
      <path d="M496 160h-80V96c0-17.67-14.33-32-32-32h-80V32c0-17.67-14.33-32-32-32H240c-17.67 0-32 14.33-32 32v32h-80c-17.67 0-32 14.33-32 32v64H16c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h80v64c0 17.67 14.33 32 32 32h80v160h64V288h80c17.67 0 32-14.33 32-32v-64h80c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16z" />
    </svg>
  );
  
  export default PipeIcon;
  