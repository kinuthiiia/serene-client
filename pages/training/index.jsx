import { IconArrowRight, IconStar } from "@tabler/icons";
import { Footer, Header } from "../../components";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import { useQuery } from "urql";
import Link from "next/link";

export default function Training() {
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

  const [{ data, fetching, error }] = useQuery({
    query: GET_SECTIONS,
    variables: { page: "home" },
  });

  if (fetching) return <p>Loading ....</p>;
  if (error) return <p>error...</p>;

  const getIndex = (label) => {
    return data?.getSections.findIndex((obj) => obj?.identifier == label);
  };

  return (
    <div>
      <Header active="training" />

      {/* Content */}
      <div>
        <div>
          <p className="w-full  text-center tracking-wide uppercase text-[1.2rem] text-black font-extrabold  ">
            Training
          </p>
          <p className="text-gray-500 w-full text-center font-light text-[0.9rem]">
            We train on fire safety drills and inspection
          </p>
          <div className="w-[70px] h-[4px] bg-[#d32131]  mx-auto mt-2" />
        </div>

        <div className="px-6 sm:px-12 md:px-24">
          <div className="w-full justify-center flex mt-8 space-x-8">
            <Button
              size="xs"
              color="red"
              onClick={() => router.push("/training/courses")}
              uppercase
              variant="outline"
            >
              view courses
            </Button>
            <Button
              size="xs"
              color="red"
              onClick={() => router.push("/training/login")}
              uppercase
            >
              trainee login
            </Button>
          </div>
          <p className="text-[0.8rem] text-gray-600 font-[300] mt-8">
            {data?.getSections[getIndex("s15")].value}
          </p>

          <div className="space-y-2 mt-8">
            <span className="block text-gray-800 text-[0.8rem]">
              <IconStar
                fill="#d32131"
                stroke={0}
                size={12}
                className="inline mr-4"
              />
              Fire Door Inspection Training
            </span>
            <span className="block text-gray-800 text-[0.8rem]">
              <IconStar
                fill="#d32131"
                stroke={0}
                size={12}
                className="inline mr-4"
              />
              Combustible Dust Health and Safety
            </span>
            <span className="block text-gray-800 text-[0.8rem]">
              <IconStar
                fill="#d32131"
                stroke={0}
                size={12}
                className="inline mr-4"
              />
              Fire & Smoke Damper Inspection
            </span>
            <span className="block text-gray-800 text-[0.8rem]">
              <IconStar
                fill="#d32131"
                stroke={0}
                size={12}
                className="inline mr-4"
              />
              Introduction to Smoke Control
            </span>
            <span className="block text-gray-800 text-[0.8rem]">
              <IconStar
                fill="#d32131"
                stroke={0}
                size={12}
                className="inline mr-4"
              />
              Emergency Exit Light Inspection
            </span>
            <span className="block text-gray-800 text-[0.8rem]">
              <IconStar
                fill="#d32131"
                stroke={0}
                size={12}
                className="inline mr-4"
              />
              Rolling Steel Fire Door Inspection and Drop Test
            </span>
          </div>

          {/* Benefits of training */}
          <div className="mt-12 space-y-6">
            <h1 className="w-full font-[Oswald]  mt-2">
              The Benefits of training?
            </h1>

            {[
              {
                title: "Employee Safety",
                description:
                  "The primary benefit of fire safety training is ensuring the safety and well-being of employees. It equips them with the knowledge and skills necessary to prevent fires and respond appropriately in case of an emergency. By understanding fire hazards, proper evacuation procedures, and the use of fire extinguishers, employees can protect themselves and their colleagues.",
              },
              {
                title: "Fire Prevention",
                description:
                  "Fire safety training creates awareness about potential fire hazards in the workplace, such as electrical malfunctions, flammable materials, and improper storage practices. Employees learn to identify and report potential fire risks, which helps prevent fires from occurring in the first place. This proactive approach reduces the likelihood of property damage, injuries, and even fatalities.",
              },
              {
                title: "Quick and Effective Response",
                description:
                  "In the event of a fire, knowing how to respond swiftly and correctly is crucial. Fire safety training provides employees with essential skills, such as recognizing different types of fires, activating fire alarms, and using fire extinguishers. This enables them to respond effectively, helping to contain the fire and minimize its impact until professional help arrives.",
              },
              {
                title: "Evacuation Preparedness",
                description:
                  "Fire safety training educates employees on evacuation procedures, including the designated escape routes, assembly points, and emergency exits. They learn how to navigate through smoke-filled environments, assist individuals with disabilities, and remain calm during high-stress situations. This preparedness enhances the chances of a successful and orderly evacuation, reducing injuries and potential loss of life.",
              },
              {
                title: "Compliance with Regulations",
                description:
                  " Providing fire safety training to employees ensures that the organization meets legal requirements by worksafekenya. Compliance not only avoids penalties and legal consequences but also demonstrates a commitment to maintaining a safe working environment.",
              },
            ].map((benefit) => (
              <Benefit
                description={benefit?.description}
                title={benefit?.title}
              />
            ))}
          </div>
        </div>

        {/* Enroll */}
        <div className="py-16 ">
          {/* Onsite */}
          <div className=" space-y-6 sm:space-x-6 sm:flex sm:ml-24 ml-6">
            <Link
              className="w-[60%]"
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSeXs1znSQjxzuR_HlYMregGjawge04R5IrY_iDsGCUExWiJYA/viewform?usp=sf_link"
            >
              <button className=" w-full flex shadow-md bg-white sm:w-[35%] p-6 rounded-md relative">
                <div className="space-y-6">
                  <h1 className=" capitalize w-full font-[Oswald] text-[1.5rem] mt-2 text-left">
                    register for <span className="text-red-700">onsite</span>{" "}
                    course
                  </h1>
                  <p className="text-[0.8rem] w-[80%] text-gray-600  font-[100] mt-4 text-left">
                    Partake in our{" "}
                    <span className="text-red-700 font-semibold">
                      1 - 2 days
                    </span>{" "}
                    onsite course and earn a fire safety novice certificate.
                  </p>
                </div>

                <IconArrowRight
                  size={12}
                  className=" text-red-700 mr-12 absolute top-[50%] right-0 "
                />
              </button>
            </Link>

            {/* Online */}
            <button
              onClick={() => router.push("/training/courses")}
              className="w-full flex shadow-md bg-white sm:w-[35%] p-6 rounded-md relative hover:cursor-pointer hover:scale-105 hover:bg-red-200"
            >
              <div className="space-y-6">
                <h1 className=" capitalize w-full font-[Oswald] text-[1.5rem] mt-2 text-left">
                  register for <span className="text-red-700">online</span>{" "}
                  class
                </h1>
                <p className="text-[0.8rem] w-[80%] text-gray-600  font-thin mt-4 text-left">
                  Partake in our{" "}
                  <span className="text-red-700 font-semibold">8 hr</span>{" "}
                  course and earn a fire safety novice certificate. Learn at
                  your own pace
                </p>
              </div>
              <IconArrowRight
                size={12}
                className=" text-red-700 mr-12 absolute top-[50%] right-0 "
              />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const Benefit = ({ title, description }) => {
  return (
    <div className="space-y-3 pb-3">
      <span className="block text-gray-800 text-[0.8rem] uppercase font-[600]">
        <IconStar fill="#d32131" stroke={0} size={12} className="inline mr-4" />
        {title}
      </span>
      <p className="text-[0.8rem] text-gray-600 font-[300] mt-4">
        {description}
      </p>
    </div>
  );
};
