/**
 * CategoryBadge.jsx — Colored pill badge for card categories
 */
const categoryStyles = {
  'Python':            'badge badge-python',
  'Java':             'badge badge-java',
  'C++':              'badge badge-cpp',
  'DBMS':             'badge badge-dbms',
  'Web Development':  'badge badge-web',
  'Computer Networks':'badge badge-network',
  'General':          'badge badge-general',
};

export default function CategoryBadge({ category }) {
  const cls = categoryStyles[category] || 'badge badge-default';
  return <span className={cls}>{category}</span>;
}
