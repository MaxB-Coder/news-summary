const UNITS = [
  ['d', 24 * 60 * 60],
  ['h', 60 * 60],
  ['m', 60],
];

/** "Just now", "35m ago", "5h ago", "2d ago": how long ago a story was published. */
export const timeAgo = (iso, now = Date.now()) => {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  for (const [unit, size] of UNITS) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${unit} ago`;
  }
  return 'Just now';
};
