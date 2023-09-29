import { Accordion, Button, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconExclamationMark,
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "urql";
import Testimonial from "./Testimonial";

export default function HSM() {
  const [sections, setSections] = useState({
    whoWeAre: "",
    mission: "",
    vision: "",
    coreValues: "",
    clientLogo: "",
    testimonyImage: "",
    testimonyText: "",
    testimonyCompany: "",
    testimonySpeaker: "",
    partnerLogo: "",
    slideImage: "",
  });

  const [clientModal, setClientModal] = useState(false);
  const [partnerModal, setPartnerModal] = useState(false);
  const [slideModal, setSlideModal] = useState(false);

  const [testimonialModal, setTestimonialModal] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const UPSERT_SECTION = `
    mutation UpsertSection($value: String, $identifier: String) {
      upsertSection(value: $value, identifier: $identifier) {
        id
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

  const [{ data: iData, fetching: fetching2, error: error2 }, reexecuteQuery] =
    useQuery({
      query: GET_ITERABLES,
    });

  const getIndex2 = (label) => {
    return iData?.getIterables?.findIndex((obj) => obj?.identifier == label);
  };

  const UPSERT_ITERABLE = `
      mutation UpsertIterable($identifier: String, $value: String, $action: String , $extra: String) {
      upsertIterable(identifier: $identifier, value: $value, action: $action , extra: $extra) {
        id
      }
    }
  `;

  const [_, _upsertSection] = useMutation(UPSERT_SECTION);
  const [__, _upsertIterable] = useMutation(UPSERT_ITERABLE);

  const upsertSection = (section) => {
    _upsertSection({
      value: sections[`${section}`],
      identifier: section,
      action: "upsert",
    }).then(({ data }, error) => {
      console.log(data);
      if (data?.upsertSection && !error) {
        showNotification({
          title: "Section updated successfully",
          message: "Visit customer website to view changes",
          color: "green",
          icon: <IconCheck />,
        });
        setSections((_sections) => ({ ..._sections, whoWeAre: "" }));
        return;
      }
      showNotification({
        title: "Error updating section",
        message: "An error occured in the process",
        color: "red",
        icon: <IconExclamationMark />,
      });
      return;
    });
  };

  const uploadSlideImage = async () => {
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("files", sections.slideImage);

    try {
      const response = await fetch("/api/uploadImg", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setLoadingUpload(false);
        const result = await response.json();
        console.log("Image uploaded:", result?.uploadedImages[0]);

        _upsertIterable({
          value: result?.uploadedImages[0],
          identifier: "slides",
          action: "upsert",
        }).then(({ data }, error) => {
          console.log(data);
          if (data?.upsertIterable && !error) {
            showNotification({
              title: "Slide added successfully",
              message: "Visit customer website to view changes",
              color: "green",
              icon: <IconCheck />,
            });
            setSections((_sections) => ({ ..._sections, slideImage: "" }));
            setLoadingUpload(false);
            setSlideModal(false);
            return;
          }
          showNotification({
            title: "Error updating section",
            message: "An error occured in the process",
            color: "red",
            icon: <IconExclamationMark />,
          });
          return;
        });
      } else {
        setLoadingUpload(false);
        console.error("Image upload failed:", response.statusText);
      }
    } catch (error) {
      setLoadingUpload(false);
      console.error("Error uploading image:", error);
    }
  };

  const deleteSlide = (value) => {
    console.log(value);

    _upsertIterable({
      value,
      identifier: "slides",
      action: "delete",
    }).then(({ data }, error) => {
      if (!error) {
        showNotification({
          title: "Slide removed successfully",
          message: "Visit customer website to view changes",
          color: "green",
          icon: <IconCheck />,
        });
        setSections((_sections) => ({ ..._sections, slideImage: "" }));
        return;
      }
      showNotification({
        title: "Error removing client",
        message: "An error occured in the process",
        color: "red",
        icon: <IconExclamationMark />,
      });
      return;
    });
  };

  const uploadClientlogo = async () => {
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("files", sections.clientLogo);

    try {
      const response = await fetch("/api/uploadImg", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setLoadingUpload(false);
        const result = await response.json();
        console.log("Image uploaded:", result?.uploadedImages[0]);

        _upsertIterable({
          value: result?.uploadedImages[0],
          identifier: "clients",
          action: "upsert",
        }).then(({ data }, error) => {
          console.log(data);
          if (data?.upsertIterable && !error) {
            showNotification({
              title: "Client added successfully",
              message: "Visit customer website to view changes",
              color: "green",
              icon: <IconCheck />,
            });
            setSections((_sections) => ({ ..._sections, clientLogo: "" }));
            setLoadingUpload(false);
            setClientModal(false);
            return;
          }
          showNotification({
            title: "Error updating section",
            message: "An error occured in the process",
            color: "red",
            icon: <IconExclamationMark />,
          });
          return;
        });
      } else {
        setLoadingUpload(false);
        console.error("Image upload failed:", response.statusText);
      }
    } catch (error) {
      setLoadingUpload(false);
      console.error("Error uploading image:", error);
    }
  };

  const deleteClient = (value) => {
    console.log(value);

    _upsertIterable({
      value,
      identifier: "clients",
      action: "delete",
    }).then(({ data }, error) => {
      if (!error) {
        showNotification({
          title: "Client removed successfully",
          message: "Visit customer website to view changes",
          color: "green",
          icon: <IconCheck />,
        });
        setSections((_sections) => ({ ..._sections, whoWeAre: "" }));
        return;
      }
      showNotification({
        title: "Error removing client",
        message: "An error occured in the process",
        color: "red",
        icon: <IconExclamationMark />,
      });
      return;
    });
  };

  const uploadTestimony = async () => {
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("files", sections.testimonyImage);

    console.log(
      JSON.stringify({
        speaker: sections?.testimonySpeaker,
        company: sections?.testimonyCompany,
        quote: sections?.testimonyText,
      })
    );

    try {
      const response = await fetch("/api/uploadImg", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setLoadingUpload(false);
        const result = await response.json();
        console.log("Image uploaded:", result?.uploadedImages[0]);

        _upsertIterable({
          value: result?.uploadedImages[0],
          identifier: "testimonials",
          action: "upsert",
          extra: JSON.stringify({
            speaker: sections?.testimonySpeaker,
            company: sections?.testimonyCompany,
            quote: sections?.testimonyText,
          }),
        }).then(({ data }, error) => {
          console.log(data);
          if (!error) {
            showNotification({
              title: "Testimonial added successfully",
              message: "Visit customer website to view changes",
              color: "green",
              icon: <IconCheck />,
            });
            setSections((_sections) => ({
              ..._sections,
              testimonyImage: "",
              testimonySpeaker: "",
              testimonyCompany: "",
              testimonyText: "",
            }));
            setLoadingUpload(false);
            setTestimonialModal(false);
            return;
          }
          showNotification({
            title: "Error updating testimonial",
            message: "An error occured in the process",
            color: "red",
            icon: <IconExclamationMark />,
          });
          return;
        });
      } else {
        setLoadingUpload(false);
        console.error("Image upload failed:", response.statusText);
      }
    } catch (error) {
      setLoadingUpload(false);
      console.error("Error uploading image:", error);
    }
  };

  const deleteTestimonial = (value) => {
    console.log(value);

    _upsertIterable({
      value,
      identifier: "testimonials",
      action: "delete",
    }).then(({ data }, error) => {
      if (!error) {
        showNotification({
          title: "Testimonial removed successfully",
          message: "Visit customer website to view changes",
          color: "green",
          icon: <IconCheck />,
        });
        setSections((_sections) => ({ ..._sections, whoWeAre: "" }));
        return;
      }
      showNotification({
        title: "Error removing testimonial",
        message: "An error occured in the process",
        color: "red",
        icon: <IconExclamationMark />,
      });
      return;
    });
  };

  const uploadPartnerlogo = async () => {
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("files", sections.partnerLogo);

    try {
      const response = await fetch("/api/uploadImg", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setLoadingUpload(false);
        const result = await response.json();
        console.log("Image uploaded:", result?.uploadedImages[0]);

        _upsertIterable({
          value: result?.uploadedImages[0],
          identifier: "partners",
          action: "upsert",
        }).then(({ data }, error) => {
          console.log(data);
          if (data?.upsertIterable && !error) {
            showNotification({
              title: "Partner added successfully",
              message: "Visit customer website to view changes",
              color: "green",
              icon: <IconCheck />,
            });
            setSections((_sections) => ({ ..._sections, partnerLogo: "" }));
            setLoadingUpload(false);
            setPartnerModal(false);
            return;
          }
          showNotification({
            title: "Error updating section",
            message: "An error occured in the process",
            color: "red",
            icon: <IconExclamationMark />,
          });
          return;
        });
      } else {
        setLoadingUpload(false);
        console.error("Image upload failed:", response.statusText);
      }
    } catch (error) {
      setLoadingUpload(false);
      console.error("Error uploading image:", error);
    }
  };

  const deletePartner = (value) => {
    console.log(value);

    _upsertIterable({
      value,
      identifier: "partners",
      action: "delete",
    }).then(({ data }, error) => {
      if (!error) {
        showNotification({
          title: "Partner removed successfully",
          message: "Visit customer website to view changes",
          color: "green",
          icon: <IconCheck />,
        });
        setSections((_sections) => ({ ..._sections, whoWeAre: "" }));
        return;
      }
      showNotification({
        title: "Error removing partner",
        message: "An error occured in the process",
        color: "red",
        icon: <IconExclamationMark />,
      });
      return;
    });
  };

  if (fetching2) return <p>Loading ....</p>;
  if (error2) return <p>error...</p>;

  return (
    <div className="p-4 space-y-12">
      <Accordion>
        <Accordion.Item value="sliders">
          <Accordion.Control>
            <h1>Slider Images</h1>
          </Accordion.Control>
          <Accordion.Panel>
            <div>
              <img src="/editables/home_1.png" />
              <br />
              <div className="w-full space-y-3">
                <h1>Current slides</h1>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                  {iData?.getIterables[getIndex2("slides")]?.value?.map(
                    (img) => (
                      <div className="relative">
                        <Button
                          p={0}
                          color="red"
                          style={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteSlide(img)}
                        >
                          <IconX />
                        </Button>
                        <img
                          src={img}
                          alt="client"
                          className="w-[80px] col-span-1 h-[80px] object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
                <Text color="dimmed">
                  Add a slide such as the one highlighted above
                </Text>
                <Button
                  leftIcon={<IconPlus />}
                  color="green"
                  onClick={() => setSlideModal(true)}
                >
                  Add slide
                </Button>

                <Modal
                  centered
                  title={<h1>Add slide</h1>}
                  opened={slideModal}
                  onClose={() => setSlideModal(false)}
                >
                  <div className="relative border-[0.5px] border-dashed w-full min-h-[300px]">
                    {sections?.slideImage ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(sections.slideImage)}
                          alt="client_logo"
                          className="w-4/5 mx-auto object-cover"
                        />
                        <br />
                        <Button
                          p={0}
                          w={24}
                          h={24}
                          style={{ position: "absolute", top: 0, right: 0 }}
                          color="red"
                          onClick={() =>
                            setSections((_section) => ({
                              ..._section,
                              slideImage: "",
                            }))
                          }
                        >
                          <IconX />
                        </Button>

                        <Button
                          fullWidth
                          color="green"
                          onClick={uploadSlideImage}
                          loading={loadingUpload}
                        >
                          Upload slide image
                        </Button>
                      </div>
                    ) : (
                      <input
                        className="left-[50%] top-[50%] translate-x-[50%] translate-y-[50%]"
                        type="file"
                        onChange={(e) =>
                          setSections((_sections) => ({
                            ..._sections,
                            slideImage: e.target.files[0],
                          }))
                        }
                      />
                    )}
                  </div>
                </Modal>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="who_we_are">
          <Accordion.Control>
            <h1>Who we are</h1>
          </Accordion.Control>
          <Accordion.Panel>
            <div>
              <img src="/editables/home_2.png" />
              <div className="space-y-2">
                <div className="my-4 space-y-3 space-x-2">
                  <label className="block">Who we are</label>
                  <textarea
                    name=""
                    id=""
                    cols="100"
                    rows="5"
                    placeholder="Who are you?"
                    className="p-4"
                    value={sections?.whoWeAre}
                    onChange={(e) =>
                      setSections((_sections) => ({
                        ..._sections,
                        whoWeAre: e.target.value,
                      }))
                    }
                  />
                  <Button
                    color="green"
                    onClick={() => upsertSection("whoWeAre")}
                  >
                    Save
                  </Button>
                </div>
                <div>
                  <label className="block">Descriptive image</label>
                  <div className="flex">
                    <div>
                      <input type="file" name="img" />
                    </div>
                    <div>
                      <div className="relative">
                        <img
                          src="/editables/home_2.png"
                          className=" object-cover h-[150px]"
                        />
                        <Button
                          style={{ position: "absolute", right: 0, top: 0 }}
                          color="red"
                          w={24}
                          h={24}
                          p={0}
                        >
                          <IconX />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-4 space-y-3">
                  <label className="block">Mission</label>
                  <textarea
                    name=""
                    id=""
                    cols="100"
                    rows="2"
                    placeholder="What is your mission?"
                    className="p-4"
                    value={sections?.mission}
                    onChange={(e) =>
                      setSections((_sections) => ({
                        ..._sections,
                        mission: e.target.value,
                      }))
                    }
                  />
                  <Button
                    color="green"
                    onClick={() => upsertSection("mission")}
                  >
                    Save
                  </Button>
                </div>
                <div className="my-4 space-y-3">
                  <label className="block">Vision</label>
                  <textarea
                    name=""
                    id=""
                    cols="100"
                    rows="2"
                    placeholder="What is your vision?"
                    className="p-4"
                    value={sections?.vision}
                    onChange={(e) =>
                      setSections((_sections) => ({
                        ..._sections,
                        vision: e.target.value,
                      }))
                    }
                  />
                  <Button color="green" onClick={() => upsertSection("vision")}>
                    Save
                  </Button>
                </div>
                <div className="my-4 space-y-3">
                  <label className="block">Core Values</label>
                  <textarea
                    name=""
                    id=""
                    cols="100"
                    rows="2"
                    placeholder="What are your core values?"
                    className="p-4"
                    value={sections?.coreValues}
                    onChange={(e) =>
                      setSections((_sections) => ({
                        ..._sections,
                        coreValues: e.target.value,
                      }))
                    }
                  />
                  <Button
                    color="green"
                    onClick={() => upsertSection("coreValues")}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="clients">
          <Accordion.Control>
            <h1>Clients</h1>
          </Accordion.Control>
          <Accordion.Panel>
            <div>
              <img src="/editables/home_4.png" />
              <br />
              <div className="w-full space-y-3">
                <h1>Current clients</h1>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
                  {iData?.getIterables[getIndex2("clients")]?.value?.map(
                    (img) => (
                      <div className="relative">
                        <Button
                          p={0}
                          color="red"
                          style={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteClient(img)}
                        >
                          <IconX />
                        </Button>
                        <img
                          src={img}
                          alt="client"
                          className="w-[80px] col-span-1 h-[80px] object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
                <Text color="dimmed">
                  Add a client logo such as the one highlighted above
                </Text>
                <Button
                  leftIcon={<IconPlus />}
                  color="green"
                  onClick={() => setClientModal(true)}
                >
                  Add client
                </Button>

                <Modal
                  centered
                  title={<h1>Add client</h1>}
                  opened={clientModal}
                  onClose={() => setClientModal(false)}
                >
                  <div className="relative border-[0.5px] border-dashed w-full min-h-[300px]">
                    {sections?.clientLogo ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(sections.clientLogo)}
                          alt="client_logo"
                          className="w-4/5 mx-auto object-cover"
                        />
                        <br />
                        <Button
                          p={0}
                          w={24}
                          h={24}
                          style={{ position: "absolute", top: 0, right: 0 }}
                          color="red"
                          onClick={() =>
                            setSections((_section) => ({
                              ..._section,
                              clientLogo: "",
                            }))
                          }
                        >
                          <IconX />
                        </Button>

                        <Button
                          fullWidth
                          color="green"
                          onClick={uploadClientlogo}
                          loading={loadingUpload}
                        >
                          Upload client logo
                        </Button>
                      </div>
                    ) : (
                      <input
                        className="left-[50%] top-[50%] translate-x-[50%] translate-y-[50%]"
                        type="file"
                        onChange={(e) =>
                          setSections((_sections) => ({
                            ..._sections,
                            clientLogo: e.target.files[0],
                          }))
                        }
                      />
                    )}
                  </div>
                </Modal>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="testimonials">
          <Accordion.Control>
            <h1>Testimonials</h1>
          </Accordion.Control>
          <Accordion.Panel>
            <div>
              <img src="/editables/home_5.png" />
              <br />
              <div className="w-full space-y-3">
                <h1>Current testimonials</h1>
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
                  {iData?.getIterables
                    .filter(
                      (iterable) => iterable?.identifier == "testimonials"
                    )
                    ?.map((testimonial) => (
                      <div className="relative">
                        <Button
                          p={0}
                          color="red"
                          style={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() =>
                            deleteTestimonial(testimonial?.value[0])
                          }
                        >
                          <IconX />
                        </Button>
                        <Testimonial testimonial={testimonial} />
                      </div>
                    ))}
                </div>

                <Text color="dimmed">
                  Add a testimonial such as the one highlighted above
                </Text>
                <Button
                  onClick={() => setTestimonialModal(true)}
                  leftIcon={<IconPlus />}
                  color="green"
                >
                  Add testimonial
                </Button>

                <Modal
                  centered
                  title={<h1>Add testimonial</h1>}
                  opened={testimonialModal}
                  onClose={() => setTestimonialModal(false)}
                >
                  <div className="relative border-[0.5px] border-dashed w-full min-h-[300px]">
                    {sections?.testimonyImage ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(sections.testimonyImage)}
                          alt="client_logo"
                          className="w-4/5 mx-auto object-cover"
                        />
                        <br />
                        <Button
                          p={0}
                          w={24}
                          h={24}
                          style={{ position: "absolute", top: 0, right: 0 }}
                          color="red"
                          onClick={() =>
                            setSections((_section) => ({
                              ..._section,
                              testimonyImage: "",
                            }))
                          }
                        >
                          <IconX />
                        </Button>

                        <Button
                          fullWidth
                          color="green"
                          onClick={uploadTestimony}
                          loading={loadingUpload}
                        >
                          Upload testimony
                        </Button>
                      </div>
                    ) : (
                      <input
                        className="left-[50%] top-[50%] translate-x-[50%] translate-y-[50%]"
                        type="file"
                        onChange={(e) =>
                          setSections((_sections) => ({
                            ..._sections,
                            testimonyImage: e.target.files[0],
                          }))
                        }
                      />
                    )}

                    <label className="block">Quote</label>
                    <textarea
                      name=""
                      id=""
                      rows="2"
                      placeholder="Add quote"
                      className="p-4"
                      value={sections?.testimonyText}
                      onChange={(e) =>
                        setSections((_sections) => ({
                          ..._sections,
                          testimonyText: e.target.value,
                        }))
                      }
                    />

                    <label className="block">speaker</label>
                    <textarea
                      name=""
                      id=""
                      rows="2"
                      placeholder="Speaker"
                      className="p-4"
                      value={sections?.testimonySpeaker}
                      onChange={(e) =>
                        setSections((_sections) => ({
                          ..._sections,
                          testimonySpeaker: e.target.value,
                        }))
                      }
                    />

                    <label className="block">Company name</label>
                    <textarea
                      name=""
                      id=""
                      rows="2"
                      placeholder="Company"
                      className="p-4"
                      value={sections?.testimonyCompany}
                      onChange={(e) =>
                        setSections((_sections) => ({
                          ..._sections,
                          testimonyCompany: e.target.value,
                        }))
                      }
                    />
                  </div>
                </Modal>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="partners">
          <Accordion.Control>
            <h1>Partners</h1>
          </Accordion.Control>
          <Accordion.Panel>
            <div>
              <img src="/editables/home_6.png" />
              <br />
              <div className="w-full space-y-3">
                <h1>Current partners</h1>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                  {iData?.getIterables[getIndex2("partners")]?.value?.map(
                    (img) => (
                      <div className="relative">
                        <Button
                          p={0}
                          color="red"
                          style={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deletePartner(img)}
                        >
                          <IconX />
                        </Button>
                        <img
                          src={img}
                          alt="client"
                          className="col-span-1 w-[180px] object-cover"
                        />
                      </div>
                    )
                  )}
                </div>
                <Text color="dimmed">
                  Add a partner logo such as the one highlighted above
                </Text>
                <Button
                  onClick={() => setPartnerModal(true)}
                  leftIcon={<IconPlus />}
                  color="green"
                >
                  Add partner
                </Button>

                <Modal
                  centered
                  title={<h1>Add partner</h1>}
                  opened={partnerModal}
                  onClose={() => setPartnerModal(false)}
                >
                  <div className="relative border-[0.5px] border-dashed w-full min-h-[300px]">
                    {sections?.partnerLogo ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(sections.partnerLogo)}
                          alt="client_logo"
                          className="w-4/5 mx-auto object-cover"
                        />
                        <br />
                        <Button
                          p={0}
                          w={24}
                          h={24}
                          style={{ position: "absolute", top: 0, right: 0 }}
                          color="red"
                          onClick={() =>
                            setSections((_section) => ({
                              ..._section,
                              partnerLogo: "",
                            }))
                          }
                        >
                          <IconX />
                        </Button>

                        <Button
                          fullWidth
                          color="green"
                          onClick={uploadPartnerlogo}
                          loading={loadingUpload}
                        >
                          Upload client logo
                        </Button>
                      </div>
                    ) : (
                      <input
                        className="left-[50%] top-[50%] translate-x-[50%] translate-y-[50%]"
                        type="file"
                        onChange={(e) =>
                          setSections((_sections) => ({
                            ..._sections,
                            partnerLogo: e.target.files[0],
                          }))
                        }
                      />
                    )}
                  </div>
                </Modal>
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
