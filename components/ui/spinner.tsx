export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Spinner: React.FC<SpinnerProps> = (props) => (
  <div
    {...props}
    className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 dark:border-gray-700 h-6 w-6 ${props.className || ""}`}
  />
);
