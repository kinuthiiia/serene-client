export default function Testimonial({ testimonial }) {
  console.log(testimonial);

  let extras = JSON?.parse(testimonial?.extra);

  return (
    <div className="col-span-1 p-3 flex space-x-6 ">
      <img
        style={{ height: 80, width: 80 }}
        src={testimonial?.value}
        className="rounded-full"
        alt="customer_img"
      />
      <div className="space-y-8">
        <blockquote
          className="font-[300] text-gray-600 text-sm"
          cite="http://www.worldwildlife.org/who/index.html"
        >
          &quot;{extras?.quote}&quot;
        </blockquote>
        <div className="w-full">
          <h1 className="font-[Oswald] text-[1rem] text-right">
            {extras?.speaker}
          </h1>
          <p className="text-[#d32121] text-[0.8rem] text-right">
            {extras?.company}
          </p>
        </div>
      </div>
    </div>
  );
}
