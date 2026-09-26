export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
};

export const formatPercentage = (val) => {
  return `${Math.round(val || 0)}%`;
};

export const getGradeBadge = (percentage) => {
  if (percentage >= 80) return { label: 'Excellent', color: '#38a169', bg: '#f0fff4' };
  if (percentage >= 60) return { label: 'Good', color: '#3182ce', bg: '#ebf8ff' };
  if (percentage >= 40) return { label: 'Average', color: '#dd6b20', bg: '#fffaf0' };
  return { label: 'Needs Improvement', color: '#e53e3e', bg: '#fff5f5' };
};
