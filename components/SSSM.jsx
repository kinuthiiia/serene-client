import { Accordion, Button, Input, Modal, Text, Textarea } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconExclamationMark, IconPlus, IconX } from "@tabler/icons";

import { useState } from "react";
import { useMutation, useQuery } from "urql";

export default function SSSM() {
  const [service, setService] = useState({
    header: "",
    image: "",
    text: "",
    title: "",
  });

  const [serviceModal, setServiceModal] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const UPSERT_SECTION = `
    mutation UpsertSection($value: String, $identifier: String) {
      upsertSection(value: $value, identifier: $identifier) {
        id
      }
    }
  `;

  const UPSERT_ITERABLE = `
      mutation UpsertIterable($identifier: String, $value: String, $action: String , $extra: String) {
      upsertIterable(identifier: $identifier, value: $value, action: $action , extra: $extra) {
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

  const [_, _upsertSection] = useMutation(UPSERT_SECTION);
  const [__, _upsertIterable] = useMutation(UPSERT_ITERABLE);

  const [{ data: iData, fetching: fetching2, error: error2 }, reexecuteQuery] =
    useQuery({
      query: GET_ITERABLES,
    });

  const upsertSection = () => {
    _upsertSection({
      value: service?.header,
      identifier: "headerServices",
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
        setService((_services) => ({ ..._services, header: "" }));
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

  const deleteService = (value) => {
    _upsertIterable({
      value,
      identifier: "services",
      action: "delete",
    }).then(({ data }, error) => {
      if (!error) {
        showNotification({
          title: "Service removed successfully",
          message: "Visit customer website to view changes",
          color: "green",
          icon: <IconCheck />,
        });
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

  const uploadService = async () => {
    setLoadingUpload(true);

    const formData = new FormData();
    formData.append("files", service?.image);

    console.log(
      JSON.stringify({
        text: service?.text,
        title: service?.title,
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
          identifier: "services",
          action: "upsert",
          extra: JSON.stringify({
            text: service?.text,
            title: service?.title,
          }),
        }).then(({ data }, error) => {
          console.log(data);
          if (!error) {
            showNotification({
              title: "Service added successfully",
              message: "Visit customer website to view changes",
              color: "green",
              icon: <IconCheck />,
            });
            setService((_sections) => ({
              ..._sections,
              image: "",
              text: "",
              title: "",
            }));
            setLoadingUpload(false);
            setServiceModal(false);
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

  if (fetching2) return <p>Loading ....</p>;
  if (error2) return <p>error...</p>;

  return (
    <div className="p-4 space-y-12">
      <Accordion>
        <Accordion.Item value="header">
          <Accordion.Control>
            <h1>Header</h1>
          </Accordion.Control>

          <Accordion.Panel>
            <div>
              <img src="/editables/services_1.png" />
              <div className="space-y-2">
                <div className="my-4 space-y-3">
                  <label className="block">
                    Short description of services that you offer
                  </label>
                  <textarea
                    name=""
                    id=""
                    cols="100"
                    rows="5"
                    placeholder="Description"
                    className="p-4"
                    value={service?.header}
                    onChange={(e) =>
                      setService((_sections) => ({
                        ..._sections,
                        header: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Button color="green" onClick={upsertSection}>
                Save
              </Button>
            </div>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="services">
          <Accordion.Control>
            <h1>Services</h1>
          </Accordion.Control>
          <Accordion.Panel>
            <div>
              <img src="/editables/services_2.png" />
              <br />
              <div className="w-full space-y-3">
                <h1>Current services</h1>
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
                  {iData?.getIterables
                    .filter((iterable) => iterable?.identifier == "services")
                    ?.map((testimonial) => (
                      <div className="relative">
                        <Button
                          p={0}
                          color="red"
                          style={{ position: "absolute", top: 0, right: 0 }}
                          onClick={() => deleteService(testimonial?.value[0])}
                        >
                          <IconX />
                        </Button>
                        <p>{JSON.stringify(testimonial)}</p>
                        {/* <Testimonial testimonial={testimonial} /> */}
                      </div>
                    ))}
                </div>
                <Text color="dimmed">
                  Add a service such as the one highlighted above
                </Text>
                <Button
                  onClick={() => setServiceModal(true)}
                  leftIcon={<IconPlus />}
                  color="green"
                >
                  Add service
                </Button>

                <Modal
                  centered
                  title={<h1>Add service</h1>}
                  opened={serviceModal}
                  onClose={() => setServiceModal(false)}
                >
                  <div className="relative border-[0.5px] border-dashed w-full min-h-[300px]">
                    {service?.image ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(service?.image)}
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
                            setService((_section) => ({
                              ..._section,
                              image: "",
                            }))
                          }
                        >
                          <IconX />
                        </Button>

                        <Button
                          fullWidth
                          color="green"
                          onClick={uploadService}
                          loading={loadingUpload}
                        >
                          Upload service
                        </Button>
                      </div>
                    ) : (
                      <input
                        className="left-[50%] top-[50%] translate-x-[50%] translate-y-[50%]"
                        type="file"
                        onChange={(e) =>
                          setService((_sections) => ({
                            ..._sections,
                            image: e.target.files[0],
                          }))
                        }
                      />
                    )}

                    <label className="block mt-5">Title</label>
                    <Input
                      placeholder="Service title"
                      className="p-4"
                      value={service?.title}
                      onChange={(e) =>
                        setService((_sections) => ({
                          ..._sections,
                          title: e.target.value,
                        }))
                      }
                    />

                    <label className="block">Description</label>
                    <Textarea
                      name=""
                      id=""
                      rows="2"
                      placeholder="Description"
                      className="p-4"
                      value={service?.text}
                      onChange={(e) =>
                        setService((_sections) => ({
                          ..._sections,
                          text: e.target.value,
                        }))
                      }
                    />
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
