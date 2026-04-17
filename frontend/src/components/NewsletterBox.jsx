import { Button } from "@/components/ui/button";
import { useNewsletter } from "@/hooks/useNewsletter";

const NewsletterBox = () => {
  const { email, setEmail, submitNewsletter } = useNewsletter();

  return (
    <section className="bg-[#FAF9F6] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-6 py-12 text-center sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#000000]">
          Members List
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[#000000]">First look at new drops.</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#000000]/70">
          Join for collection notes, restock alerts, and simple outfit edits.
        </p>
        <form
          onSubmit={submitNewsletter}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="h-11 flex-1 rounded-lg border border-[#E5E5E5] bg-[#FAF9F6] px-4 text-sm text-[#000000] outline-none placeholder:text-[#000000]/50 focus:border-[#000000]"
          />
          <Button
            type="submit"
            className="h-11 bg-[#000000] px-6 text-[#FAF9F6] hover:bg-[#000000]/80"
          >
            Join
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterBox;
