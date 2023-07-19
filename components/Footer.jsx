import { Button, Divider, Input, Space, Textarea } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconLocation,
  IconLockOpen,
  IconPhoneCall,
} from "@tabler/icons";

import Link from "next/link";
import { useQuery } from "urql";

export default function Footer() {
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
    variables: { page: "footer" },
  });

  return (
    <>
      <div className="bg-[#212530] w-full p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 space-x-3 px-8 py-2 flex">
            <IconPhoneCall color="red" stroke={0.7} size={26} />
            <h1 className="text-[1.1rem] font-[Oswald] text-white">Call Us</h1>
            <p className="text-white font-light text-[0.8rem] mt-1 ml-6">
              {data?.getSections?.filter(
                (section) => section?.identifier == "callUs"
              )[0].value || "..."}
            </p>
          </div>

          <div className="col-span-1 space-x-3 px-8 py-2 flex">
            <IconLocation color="red" stroke={0.7} size={26} />
            <h1 className="text-[1.1rem] font-[Oswald] text-white">
              Office Address
            </h1>
            <p className="text-white font-light text-[0.8rem] mt-1 ml-6">
              {data?.getSections?.filter(
                (section) => section?.identifier == "officeAddress"
              )[0].value || "..."}
            </p>
          </div>

          <div className="col-span-1 space-x-3 px-8 py-2 flex">
            <IconLockOpen color="red" stroke={0.7} size={26} />
            <h1 className="text-[1.1rem] font-[Oswald] text-white">
              Working Time
            </h1>
            <p className="text-white font-light text-[0.8rem] mt-1 ml-6">
              {data?.getSections?.filter(
                (section) => section?.identifier == "workingTime"
              )[0].value || "..."}
            </p>
          </div>
        </div>
        <Space h={30} />
        <div className="md:flex justify-between w-full">
          <div className=" w-full md:w-1/4 space-y-3">
            <h1 className="text-[1.1rem] font-[Oswald] text-white">About Us</h1>

            <p className="text-gray-400 font-light text-[0.8rem]">
              {data?.getSections?.filter(
                (section) => section?.identifier == "aboutUs"
              )[0].value || "..."}
            </p>

            <img src="/logo.svg" alt="logo" />
          </div>
          <div className="w-full md:w-1/4 space-y-3 mt-12 md:mt-0">
            <h1 className="text-[1.1rem] font-[Oswald] text-white">
              Quick Links
            </h1>

            <div className="space-y-3">
              <Link
                href="/home"
                className="text-gray-400 ml-6 font-[0.7rem] block"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="text-gray-400 ml-6 font-[0.7rem] block"
              >
                Services
              </Link>
              <Link
                href="/product"
                className="text-gray-400 ml-6 font-[0.7rem] block"
              >
                Products
              </Link>
              <Link
                href="/training"
                className="text-gray-400 ml-6 font-[0.7rem] block"
              >
                Training
              </Link>
            </div>
          </div>

          <div className="w-full md:w-[30%] mt-12 md:mt-0">
            <div className=" w-full">
              <h1 className="text-[1.1rem] font-[Oswald] text-white mb-4">
                Follow Us:
              </h1>
              <div className="flex my-6 space-x-8">
                <Link
                  href={`${
                    data?.getSections?.filter(
                      (section) => section?.identifier == "facebookURL"
                    )[0].value || "..."
                  }`}
                >
                  <IconBrandFacebook color="white" />
                </Link>
                <Link
                  href={`${
                    data?.getSections?.filter(
                      (section) => section?.identifier == "linkedInURL"
                    )[0].value || "..."
                  }`}
                >
                  <IconBrandLinkedin color="white" />
                </Link>
                <Link
                  href={`${
                    data?.getSections?.filter(
                      (section) => section?.identifier == "youtubeURL"
                    )[0].value || "..."
                  }`}
                >
                  <IconBrandYoutube color="white" />
                </Link>
              </div>
            </div>
            <Divider
              my="xs"
              label={<span className="text-gray-400">or</span>}
              labelPosition="center"
            />
            <h1 className="text-[1.1rem] font-[Oswald] text-white mb-4">
              Write to Us:
            </h1>
            <section className="space-y-4" id="contact-us">
              <a
                href={`mailto:${
                  data?.getSections?.filter(
                    (section) => section?.identifier == "mailingURL"
                  )[0].value
                }?subject=${encodeURI("This is the subject")}
&body=${encodeURI("This is the body")}`}
                style={{
                  background: "rgb(185,28,28)",
                  color: "White",
                  padding: "6px 12px",
                }}
                fullWidth
              >
                Send mail
              </a>
            </section>
          </div>
        </div>
      </div>
      <div className="bg-black w-full flex justify-between p-3">
        <span class="text-white text-[0.8rem] font-light ">
          Copyright © 2023 Serene PSL, All Rights Reserved.
        </span>
        <span class="text-white text-[0.7rem] font-light">
          See{" "}
          <a
            href="https://stevekinuthia.vercel.app"
            rel="noreferrer"
            target="_blank"
          >
            developer
          </a>
        </span>
      </div>
    </>
  );
}
