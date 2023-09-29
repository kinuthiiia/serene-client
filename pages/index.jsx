import { Badge, Breadcrumbs, Button, Modal, Space, Text } from "@mantine/core";
import { IconArrowRight, IconDiamond, IconStar } from "@tabler/icons";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Footer, Header, Testimonial } from "../components";
import { useQuery } from "urql";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

export default function Home() {
  const router = useRouter();

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
    return data?.getSections?.findIndex((obj) => obj?.identifier == label);
  };

  const getIndex2 = (label) => {
    return iData?.getIterables?.findIndex((obj) => obj?.identifier == label);
  };

  return (
    <div>
      <Head>
        <title>Serene Products & Services</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Header section */}
      <Header active="home" />

      <main>
        <Slider value={iData?.getIterables[getIndex2("slides")]} />

        <WhoWeAre value={data?.getSections[getIndex("whoWeAre")]} />
        <Principles
          mission={data?.getSections[getIndex("mission")]}
          vision={data?.getSections[getIndex("vision")]}
          core_values={data?.getSections[getIndex("coreValues")]}
        />
        <MiniProducts />
        <Clients value={iData?.getIterables[getIndex2("clients")]} />
        <Testimonials
          value={iData?.getIterables.filter(
            (iterable) => iterable?.identifier == "testimonials"
          )}
        />
        <Partners value={iData?.getIterables[getIndex2("partners")]} />
      </main>

      {/* Footer */}
      <Footer />
      <div className="sticky float-right bottom-6 right-6">
        <a
          onClick={() => {
            router.push(
              `https://wa.me/254740650480?text=Hello%2CI%20would%20like%20to%20enquire%20about%20this%20product%20%3A%20http%3A%2F%2Flocalhost%3A3000%2Fproduct%2F${data?.id}`
            );
          }}
        >
          <img src="/whatsapp.png" alt="whatsapp" className="w-[48px]" />
        </a>
      </div>
    </div>
  );
}

const Slider = ({ value }) => {
  return (
    <div>
      <Carousel autoPlay infiniteLoop showThumbs={false}>
        {value?.value.map((img) => (
          <div>
            <img src={img} alt="cover" className="object_cover w-full " />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

const WhoWeAre = ({ value }) => {
  return (
    <div className="p-6 pl-12">
      <div className="md:flex">
        <div className=" w-full md:w-1/2">
          <p className="tracking-wide uppercase text-[1.2rem] text-black font-extrabold inline ">
            Who we are
          </p>
          <div className="w-[100px] h-[4px] bg-[#d32131] mb-8" />
          <p className="text-[0.9rem] text-gray-600 font-[300]">
            {value?.value}
          </p>
        </div>
        <div className=" w-full md:w-1/2">
          <img
            src="/fire-extig.jpg"
            alt="what_we_do_1"
            className="z-1  sm:w-4/5 w-full r-0"
          />
        </div>
      </div>
    </div>
  );
};

const Principles = ({ mission, vision, core_values }) => {
  return (
    <div className="w-4/5 mx-auto bg-yellow-400 p-6 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className=" col-span-1 space-y-6">
        <span className="flex space-x-6">
          <h1 className="font-bold font-[Oswald]">01</h1>
          <span class="inline-block align-bottom mt-4 uppercase">Mission</span>
        </span>
        <p className="font-light text-[0.8rem] text-gray-600">
          {mission?.value ||
            " Promoting and delivering fast, effective and comprehensive engineering solutions."}
        </p>
      </div>
      <div className="col-span-1space-y-6">
        <span className="flex space-x-6">
          <h1 className="font-bold font-[Oswald]">02</h1>
          <span class="inline-block align-bottom mt-4 uppercase">Vision</span>
        </span>
        <p className="font-light text-[0.8rem] text-gray-600">
          {vision?.value ||
            "Generating and collaborating with customer to produce customers centric solutions."}
        </p>
      </div>
      <div className="col-span-1 space-y-6">
        <span className="flex space-x-6">
          <h1 className="font-bold font-[Oswald]">03</h1>
          <span class="inline-block align-bottom mt-4 uppercase">
            Core values
          </span>
        </span>
        <p className="font-light text-[0.8rem] text-gray-600">
          {core_values?.value || " Innovation, excellence, passion."}
        </p>
      </div>
    </div>
  );
};

const MiniProducts = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [i, setIndex] = useState(null);
  const router = useRouter();
  const GET_FEATURED = `
      query GET_FEATURED{
        getFeatured{
          id
          name
          category
          subCategory
          image
          specSheet
          description
          removed       
        }
      }  
  `;

  const [{ data, fetching, error }] = useQuery({
    query: GET_FEATURED,
  });

  if (fetching) return <p>Loading ....</p>;
  if (error) return <p>Error ....</p>;

  return (
    <div className="mt-14  w-[90%] mx-auto mb-8">
      <p className="tracking-wide uppercase text-[1.2rem] text-black font-extrabold inline ">
        featured products
      </p>
      <div className="w-[144px] h-[4px] bg-[#d32131] mb-8" />
      <p className="text-[0.9rem] text-gray-600 mb-8">
        We supply, install and maintain fire safety equipments at discounted
        prices. Here are some of our top selling equipment.
      </p>
      <div className="flex space-x-4 overflow-x-auto ">
        {data?.getFeatured
          .filter((feat) => feat?.removed == false)
          .map((product, i) => (
            <div
              key={product?.id}
              className="flex relative shadow-md px-5 space-x-4 min-w-[300px] max-w-[400px]  my-auto"
            >
              <img
                src={product?.image}
                style={{
                  width: 100,
                  height: 100,
                }}
                alt={`product_${product?.id}`}
              />
              <Badge
                color="green"
                size="md"
                radius={null}
                variant="filled"
                className="absolute left-0 top-0"
              >
                <p className="font-light">OFFER !</p>
              </Badge>
              <div className="my-auto">
                <Text lineClamp={3} fw="bolder">
                  {product?.name}
                </Text>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((el) => (
                    <IconStar
                      key={el}
                      fill="#FFD700"
                      stroke={0}
                      size={12}
                      className="inline"
                    />
                  ))}
                </div>
                <a
                  className="text-[#d32121] font-[300] uppercase text-[0.7rem]"
                  onClick={() => {
                    setIndex(i);
                    setModalOpen(true);
                  }}
                >
                  Learn more <IconArrowRight className="inline" size={12} />{" "}
                </a>
              </div>
            </div>
          ))}
      </div>

      <div className="w-full flex flex-row-reverse mt-4">
        <button
          onClick={() => router.push("/product")}
          className="uppercase text-[#d32121] font-[300] text-[0.8rem]"
        >
          see all products
        </button>
      </div>

      <Modal
        size="90%"
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setIndex(null);
        }}
        title={<h2 className="text-[1.5rem]">{data?.getFeatured[i]?.name}</h2>}
        centered
      >
        {/* Modal content */}
        <div className="flex space-x-12 mt-12">
          <div className="w-1/3">
            <img
              src={data?.getFeatured[i]?.image}
              alt={data?.getFeatured[i]?.name}
              className="w-full"
            />
          </div>
          <div className="w-2/3">
            <Breadcrumbs className="text-red-700">
              {[
                new String(data?.getFeatured[i]?.category).toUpperCase(),
                new String(data?.getFeatured[i]?.subCategory).toUpperCase(),
              ]}
            </Breadcrumbs>
            <Space h={20} />
            <h3 className="text-[1.5rem] mb-2">Features</h3>
            <Text c="dimmed" fz="sm" fw="lighter">
              {data?.getFeatured[i]?.description}
            </Text>
            <h3 className="text-[1.5rem] mb-2 mt-6">
              Technical Specifications
            </h3>
            <img
              src={data?.getFeatured[i]?.specSheet}
              alt={data?.getFeatured[i]?.name}
              className="w-full"
            />
            <div className="flex flex-row-reverse">
              <Button color="green">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://wa.me/254740650480?text=${encodeURI(
                    `Hello , I would like to get more info about this product '${data?.getFeatured[i]?.name}'`
                  )}`}
                >
                  Enquire
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Clients = ({ value }) => {
  return (
    <div className="mt-14  w-[90%] mx-auto mb-8">
      <p className="tracking-wide uppercase text-[1.2rem] text-black font-extrabold inline ">
        our clients
      </p>
      <div className="w-[85px] h-[4px] bg-[#d32131] mb-8" />
      <p className="text-[0.9rem] text-gray-600 mb-8">
        We have the trust of the biggest names in business
      </p>
      <div className="flex space-x-12 ">
        {value?.value.map((img) => (
          <img src={img} className="w-[100px]" />
        ))}
      </div>
    </div>
  );
};

const Testimonials = ({ value }) => {
  return (
    <div className="mt-14  w-[90%] mx-auto mb-8">
      <p className="tracking-wide uppercase text-[1.2rem] text-black font-extrabold inline ">
        Testimonials
      </p>
      <div className="w-[85px] h-[4px] bg-[#d32131] mb-8" />
      <div className=" mx-auto space-x-6 mt-6  grid grid-cols-1 md:grid-cols-3 gap-8">
        {value?.map((test, i) => (
          <Testimonial key={i} testimonial={test} />
        ))}
      </div>
    </div>
  );
};

const Partners = ({ value }) => {
  return (
    <div className="mt-14  w-[90%] mx-auto mb-8">
      <p className="tracking-wide uppercase text-[1.2rem] text-black font-extrabold inline ">
        Partners
      </p>
      <div className="w-[70px] h-[4px] bg-[#d32131] mb-8" />
      <div className="flex space-x-8 m-4 my-12">
        {value?.value.map((img) => (
          <img src={img} className="w-[100px]" />
        ))}
      </div>
    </div>
  );
};
