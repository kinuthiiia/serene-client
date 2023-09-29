import { useRouter } from "next/router";
import { Footer, Header } from "../components";
import { useQuery } from "urql";
import { Text } from "@mantine/core";

export default function Services() {
  const GET_SECTIONS = `
      query GET_SECTIONS{
        getSections{
          id
          value
          identifier
        }
      }
  `;

  const GET_ITERABLES = `
      query GET_ITERABLES{
        getIterables{
          id
          value
          identifier
          extra
        }
      }
  `;

  const [{ data, fetching, error }] = useQuery({
    query: GET_SECTIONS,
  });

  const [{ data: iData, fetching: fetching2, error: error2 }] = useQuery({
    query: GET_ITERABLES,
  });

  if (fetching || fetching2) return <p>Loading ....</p>;
  if (error || error2) return <p>error...</p>;

  const getIndex = (label) => {
    return data?.getSections.findIndex((obj) => obj?.identifier == label);
  };

  const getIndex2 = (label) => {
    return iData?.getIterables?.findIndex((obj) => obj?.identifier == label);
  };

  const router = useRouter();
  return (
    <div>
      <Header active="services" />

      {/* Content */}
      <div className="w-full">
        <p className="w-full  text-center tracking-wide uppercase text-[1.2rem] text-black font-extrabold  ">
          Services
        </p>
        <div className="w-[70px] h-[4px] bg-[#d32131]  mx-auto" />

        <div className=" p-6 md:px-12 space-y-8">
          <p className="text-[0.9rem] text-gray-500 font-[300] w-[90%] mx-auto leading-6">
            {data?.getSections[getIndex("headerServices")]?.value}
          </p>

          {/* Services list */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-4">
            {iData?.getIterables
              .filter((iterable) => iterable?.identifier == "services")
              .map((service) => {
                let extras = JSON?.parse(service?.extra);

                return (
                  <div className="col-span-1  w-full ">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <img
                        src={service?.value}
                        alt="fire_audit"
                        className="object-cover w-full  h-[350px]"
                      />
                      <div className="w-full p-4 space-y-4">
                        <h1 className="font-[Oswald] text-[1.6rem] tracking-tighter">
                          {extras?.title}
                        </h1>
                        <p className="font-light text-[0.8rem]">
                          {extras?.text}
                        </p>
                        <button
                          onClick={() => {
                            router.push(
                              `https://wa.me/254713763057?text=Hello%2CI%20would%20like%20to%20enquire%20about%20this%20product%20%3A%20http%3A%2F%2Flocalhost%3A3000%2Fproduct%2F`
                            );
                          }}
                          className="border-none outline-none bg-red-700 text-white px-4 py-2"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
