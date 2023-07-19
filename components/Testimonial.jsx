export default function Testimonial() {
  return (
    <div className="col-span-1 p-3 flex space-x-6 ">
      <img
        style={{ height: 80, width: 80 }}
        src="/favicon.ico"
        alt="customer_img"
      />
      <div className="space-y-8">
        <blockquote
          className="font-[300] text-gray-600 text-sm"
          cite="http://www.worldwildlife.org/who/index.html"
        >
          &quot;For 50 years, WWF has been protecting the future of
          nature.&quot;
        </blockquote>
        <div className="w-full">
          <h1 className="font-[Oswald] text-[1rem] text-right">James Karani</h1>
          <p className="text-[#d32121] text-[0.8rem] text-right">
            CEO, Gearbox Academy
          </p>
        </div>
      </div>
    </div>
  );
}
