
const getTinymce = () => {
  const w = typeof window !== 'undefined' ? (window as any) : undefined;
  return w && w.tinymce ? w.tinymce : null;
};

export { getTinymce };
