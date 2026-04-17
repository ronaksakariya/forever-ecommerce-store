import { assets } from "@/assets/frontend_assets/assets";

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange",
    text: "Flexible exchange support on eligible orders.",
  },
  {
    icon: assets.quality_icon,
    title: "Quality Checked",
    text: "Pieces selected for everyday wear and clean finishing.",
  },
  {
    icon: assets.support_img,
    title: "Support Ready",
    text: "Help for product, sizing, and order questions.",
  },
];

const PolicyBanner = () => {
  return (
    <section className="bg-[#FAF9F6] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
        {policies.map((policy) => (
          <div
            key={policy.title}
            className="rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] p-6 text-center"
          >
            <img src={policy.icon} alt="" className="mx-auto h-10 w-10 object-contain" />
            <h3 className="mt-5 text-base font-semibold text-[#000000]">{policy.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#000000]/70">{policy.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PolicyBanner;
