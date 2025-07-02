
export const calculateTotalDuration = (modules: any[]) => {
  let totalMinutes = 0;
  modules?.forEach(module => {
    module.lessons?.forEach((lesson: any) => {
      const duration = lesson.duration.match(/\d+/);
      if (duration) totalMinutes += parseInt(duration[0]);
    });
  });
  return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min`;
};

export const formatPrice = (price: number, currency: string) => {
  return `${price.toLocaleString()} ${currency}`;
};
