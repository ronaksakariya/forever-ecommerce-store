const SectionTitle = ({ eyebrow, title, description }) => {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-[#000000] sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-sm leading-6 text-[#000000]/70 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
};

export default SectionTitle;
