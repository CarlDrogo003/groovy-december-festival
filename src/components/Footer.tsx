export default function Footer({ 
  title = "Groovy December Festival", 
  colorClass = "text-green-400",
  showTagline = true 
}: { 
  title?: string;
  colorClass?: string;
  showTagline?: boolean;
}) {
  return (
    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
      <p className="mb-2">
        &copy; 2025 {title}
        {showTagline && ". explore, enjoy and experience..."}
      </p>
      <p className="text-sm text-gray-500">
        Organized by <span className={`${colorClass} font-semibold`}>Kenneth Handsome Lifestyle Ltd</span>
      </p>
    </div>
  );
}