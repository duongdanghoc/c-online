export function Stars({ rate }: { rate: number }) {
  const getStarFill = (starIndex: number): string => {
    if (starIndex <= rate) {
      return "#fb923c"; // Sao đầy - màu orange-400
    } else if (starIndex - 1 < rate) {
      // Sao lẻ - tính phần trăm fill
      const fillPercentage = (rate - (starIndex - 1)) * 100;
      return `url(#star-gradient-${starIndex}-${fillPercentage.toFixed(0)})`;
    }
    return "none"; // Sao rỗng
  };

  const getStarClass = (starIndex: number): string => {
    if (starIndex <= rate) {
      return "text-orange-400";
    } else if (starIndex - 1 < rate) {
      return "text-orange-400";
    }
    return "text-gray-500";
  };

  return (
    <div className="flex gap-1">
      <svg width="0" height="0" className="absolute">
        <defs>
          {[1, 2, 3, 4, 5].map((i) => {
            const fillPercentage =
              i - 1 < rate && i > rate ? (rate - (i - 1)) * 100 : 0;
            if (fillPercentage > 0) {
              return (
                <linearGradient
                  key={`star-gradient-${i}-${fillPercentage.toFixed(0)}`}
                  id={`star-gradient-${i}-${fillPercentage.toFixed(0)}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset={`${fillPercentage}%`} stopColor="#fb923c" />
                  <stop offset={`${fillPercentage}%`} stopColor="transparent" />
                </linearGradient>
              );
            }
            return null;
          })}
        </defs>
      </svg>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={getStarFill(i)}
          stroke="currentColor"
          className={`size-4 ${getStarClass(i)}`}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
}
