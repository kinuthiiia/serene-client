import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Input,
  Modal,
  Space,
  Notification,
  Text,
  Progress,
  Alert,
  Chip,
  UnstyledButton,
  Popover,
  Radio,
} from "@mantine/core";
import dynamic from "next/dynamic";
import {
  IconAlertCircle,
  IconCheck,
  IconCircleCheck,
  IconClock,
  IconDownload,
  IconPlayerPlay,
  IconPointer,
  IconSearch,
  IconTag,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "urql";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment/moment";

const RTE = dynamic(
  () => {
    return import("../../components/RTE");
  },
  { ssr: false }
);

export default function Courses() {
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState({});
  const router = useRouter();

  const GET_TRAINEE = `
      query GET_TRAINEE(
        $id: ID
      ){
        getTrainee(
          id: $id
        ){
          id
          email
          fullName
          image
          password
          registeredCourses{
            course{
              id
              name
              category
              description
              addedBy{
                firstName
                email
              }
              createdAt
              image
              price
              was
              onSale
              lectures{
                id
                title
                description
                quiz{
                  question
                  answer
                  options
                }
                content
                timeEstimate
              }
            }
            completed
            progress
            completionDate
        }
      }
    }      
  `;

  const [{ data: tData, fetching: tFetching, error: tError }, reexecuteQuery2] =
    useQuery({
      query: GET_TRAINEE,
      variables: {
        id:
          typeof window !== "undefined" &&
          window.localStorage &&
          localStorage.getItem("s_userId"),
      },
    });

  const GET_COURSES = `
      query GET_COURSES{
        getCourses{
          id
          name
          category
          description
          addedBy{
            firstName
            email
          }
          createdAt
          image
          price
          was
          onSale
          lectures{
            id
            title
            description
            quiz{
              question
              answer
              options
            }
            content
            timeEstimate
          }
        }
      }
  `;

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_COURSES,
  });

  const handleLogout = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.clear();
      router.push("/training/login");
    }
  };

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error ...</p>;

  return (
    <div>
      <div className="flex justify-between">
        <a href="/">
          <img src="/logo.svg" alt="logo" className="h-[80px] m-3" />
        </a>
        <div className="flex space-x-1 mr-8">
          <Popover width={200} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <UnstyledButton>
                <Group>
                  <Avatar size={40} color="red">
                    {tData?.getTrainee?.fullName
                      .split(" ")
                      .map((name) => name.charAt(0))}
                  </Avatar>
                  <div>
                    <Text>{tData?.getTrainee?.fullName}</Text>
                    <Text size="xs" color="dimmed">
                      {tData?.getTrainee?.email}
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown>
              <Button
                onClick={() => router.push("/")}
                size="xs"
                color="red"
                variant="outline"
                fullWidth
              >
                Go to home
              </Button>
              <Space h={8} />

              {tData?.getTrainee && (
                <Button size="xs" onClick={handleLogout} color="red" fullWidth>
                  Log out
                </Button>
              )}
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>
      <p className="w-full  text-center tracking-wide uppercase text-[1.2rem] text-black font-extrabold  ">
        Courses
      </p>
      <p className="text-gray-500 w-full text-center font-light text-[0.9rem] mb-2">
        Welcome to our Fire Safety Courses!
      </p>
      <div className="w-[70px] h-[4px] bg-[#d32131]  mx-auto" />

      <div className="p-12 py-5 space-y-3 max-h-[calc(100vh-148px)] overflow-y-auto">
        <Text c="#2c2c2c" fz="sm" fw="lighter">
          At{" "}
          <strong className="bg-red-700 text-white mx-2 p-1">Serene PSL</strong>{" "}
          , we are committed to providing comprehensive and practical solutions
          to ensure the safety of individuals and organizations in the face of
          fire hazards. As part of our dedication to spreading awareness and
          knowledge, we have developed an extensive range of{" "}
          <strong className="bg-red-700 text-white mx-2 p-1">
            fire safety courses
          </strong>{" "}
          designed to equip you with the necessary
          <strong className="bg-red-700 text-white mx-2 p-1">
            skills and expertise.
          </strong>
        </Text>

        <div>
          {tData && tData?.getTrainee?.registeredCourses.length >= 1 && (
            <CourseListing
              courses={tData?.getTrainee?.registeredCourses}
              label={"ENROLLED"}
              refresh={reexecuteQuery}
              enrolled
              traineeName={tData?.getTrainee?.fullName}
            />
          )}

          <Input
            variant="filled"
            placeholder="Search course ..."
            style={{ margin: 36 }}
            icon={<IconSearch size={20} />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {Array.from(
            new Set(
              data?.getCourses
                .filter((course) =>
                  course?.name.toLowerCase().includes(keyword.toLowerCase())
                )
                .map((obj) => obj.category)
            )
          ).map((category) => (
            <CourseListing
              courses={data?.getCourses.filter(
                (course) => course?.category == category
              )}
              label={new String(category).toUpperCase()}
              refresh={reexecuteQuery}
              enrolledCourses={tData?.getTrainee?.registeredCourses}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const CourseListing = ({
  courses,
  label,
  refresh,
  enrolled,
  enrolledCourses,
  traineeName,
}) => {
  return (
    <>
      <Divider my="xs" label={label} labelPosition="right" />

      {enrolled && (
        <div className="grid grid-cols-5 gap-8">
          {courses.map((course) => (
            <Course course={course} enrolled traineeName={traineeName} />
          ))}
        </div>
      )}

      {!enrolled && (
        <div className="grid grid-cols-5 gap-8">
          {courses.map((course) => (
            <Course
              course={course}
              refresh={refresh}
              enrolledCourses={enrolledCourses}
            />
          ))}
        </div>
      )}
    </>
  );
};

const Course = ({
  course,
  refresh,
  enrolled,
  enrolledCourses,
  traineeName,
}) => {
  const [user, setUser] = useState({
    name: traineeName, // Replace with the user's name
    dateOfCompletion: moment(
      new Date(Number(course?.completionDate || 0))
    ).format("Do-MMM-YYYY"), // Replace with the date of completion
    courseName:
      course?.name?.toUpperCase() || course.course?.name?.toUpperCase(), // Replace with the course name
  });
  const [certModal, setCertModal] = useState(false);

  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const ENROLL_COURSE = `
   mutation ENROLL_COURSE(
      $trainee: ID
      $course: ID
    ){
      enrollCourse(
        course: $course
        trainee: $trainee
      ) {
        id
      
      registeredCourses{
        course{
          name
        }
        completed
        progress
      }
      }
    }
  `;
  const [__, _enrollCourse] = useMutation(ENROLL_COURSE);

  const UPDATE_TRAINEE = `
      mutation UPDATE_TRAINEE(
        $id: ID!
        $course: ID
        $progress: Float
        $completed: Boolean
        $password: String
        $completionDate: String
      ){
        updateTrainee(
          id: $id
          course: $course
          progress: $progress
          completed: $completed
          password: $password
          completionDate: $completionDate
        ){
          id
          fullName
        }
      }
  `;

  const [_, _updateTrainee] = useMutation(UPDATE_TRAINEE);

  const handleEnroll = () => {
    setLoading(true);
    if (typeof window !== "undefined" && window.localStorage) {
      let user = localStorage.getItem("s_userId");

      if (!user) {
        router?.push("/training/login");
        return;
      }
      _enrollCourse({
        trainee: user,
        course: course?.id,
      })
        .then(({ data, error }) => {
          if (data && !error) {
            showNotification({
              title: "Success!",
              message: "You have successfully enrolled to this course",
              color: "green",
            });
            router.push("/training/courses");
            handleCloseLectureModal();
            return;
          }
          showNotification({
            title: "Failed!",
            message: "Failed to enroll to this course",
            color: "red",
          });
        })
        .catch((err) => {
          showNotification({
            title: "Failed!",
            message: "Failed to enroll to this course",
            color: "red",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const generateCertificate = async () => {
    // //Inittiate STK
    // try {
    //   const response = await fetch(`/api/initiateNI`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       amount: 1,
    //     }),
    //   });

    //   const data = await response.json();

    //   if (response.status !== 200) {
    //     throw new Error("Error occured , Retry");
    //   }

    //   if (response.status == 200) {
    //     showNotification({
    //       title: "Awaiting payment confirmation",
    //       message: "STK push sent",
    //       color: "green",
    //     });
    //   }
    // } catch (error) {
    //   console.log(error);
    //   showNotification({
    //     title: "An error occurred",
    //     color: "red",
    //   });
    // }

    // Reference to the certificate container
    const certificateContainer = document.getElementById(
      "certificate-container"
    );

    // Create a canvas from the certificate container
    html2canvas(certificateContainer).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape", // Landscape A4
      });

      // Add an image of the certificate to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210); // A4 dimensions

      // Download the PDF with a custom filename
      pdf.save("certificate.pdf");
    });
  };

  const handleCloseLectureModal = () => {
    setModalOpen(false);
  };

  const handleNext = (completed) => {
    console.log({
      course: course.course?.id,
      progress: (completed / course?.course?.lectures?.length) * 10,
      completed: completed == course?.course?.lectures?.length ? true : false,
    });

    console.log({
      id:
        typeof window !== "undefined" &&
        window.localStorage &&
        localStorage.getItem("s_userId"),
      course: course.course?.id,
      progress: (completed / course?.course?.lectures?.length) * 10,
      completed: completed == course?.course?.lectures?.length ? true : false,
    });
    _updateTrainee({
      id:
        typeof window !== "undefined" &&
        window.localStorage &&
        localStorage.getItem("s_userId"),
      course: course.course?.id,
      progress: (completed / course?.course?.lectures?.length) * 10,
      completed: completed == course?.course?.lectures?.length ? true : false,
      completionDate:
        completed == course?.course?.lectures?.length
          ? String(Date.now())
          : null,
    }).then(({ data, error }) => {
      console.log(data, error);
      if (data && !error) {
        router.reload();
        return;
      }
    });
  };

  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
  }

  const isCourseEnrolled = () => {
    return enrolledCourses?.filter(
      (enrolled) => enrolled?.course?.id == course?.id
    ).length > 0
      ? true
      : false;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <img className="w-full" src={course?.image || course?.course.image} />
      </Card.Section>

      <Group position="apart" mt="sm" mb="xs">
        <Text weight={500}>
          {course?.name?.toUpperCase() || course.course?.name?.toUpperCase()}
        </Text>
        {course?.onSale ||
          (course?.course?.onSale && (
            <Badge color="pink" variant="light">
              On Sale
            </Badge>
          ))}
      </Group>

      <Text fz="xs" color="dimmed" lineClamp={4} fw="lighter">
        {course?.description || course?.course?.description}
      </Text>

      {!enrolled && (
        <Button
          color="dark"
          size={"xs"}
          mt={8}
          uppercase
          fullWidth
          onClick={() => setModalOpen(true)}
        >
          View course
        </Button>
      )}

      {enrolled && course?.progress == 0 && (
        <Button
          color="red"
          size={"xs"}
          mt={8}
          uppercase
          fullWidth
          onClick={() => setModalOpen(true)}
        >
          START
        </Button>
      )}

      {enrolled && course?.progress == 10 && course?.completed && (
        <>
          <Chip
            style={{ marginTop: 8, marginBottom: 8, width: "100%" }}
            defaultChecked
            color="green"
            variant="filled"
          >
            <span className="text-[0.7rem]">Completed</span>
          </Chip>
          <Button
            color="green"
            size={"xs"}
            mt={8}
            uppercase
            fullWidth
            onClick={() => setCertModal(true)}
          >
            View certificate
          </Button>

          <Modal
            size="90%"
            opened={certModal}
            onClose={() => setCertModal(false)}
          >
            <Button
              color="green"
              size={"xs"}
              mt={8}
              leftIcon={<IconDownload size={16} />}
              uppercase
              fullWidth
              onClick={generateCertificate}
            >
              PAY TO DOWNLOAD certificate
            </Button>
            <br />

            <div className=" ml-[40px]">
              <div id="certificate-container" className="certificate">
                {/* Certificate content */}
                <img src="/blankcert.png" alt="" className="w-full" />
                <p className=" absolute top-[56%] text-[3rem] left-[50%] translate-x-[-50%]">
                  {user.name}
                </p>
                <p className="absolute top-[82%] text-[1.5rem] left-[150px]">
                  {user.dateOfCompletion}
                </p>
                <p className=" absolute top-[68%] w-[90%] text-[1.4rem] text-[#263A8F] left-[50%] translate-x-[-50%] text-center">
                  {" "}
                  for successfully completing {user.courseName}
                </p>
              </div>
            </div>

            <style jsx>{`
              /* CSS for the certificate container */
              .certificate {
                position: relative;
                width: 297mm; /* A4 width */
                height: 210mm; /* A4 height */
                background-color: #ffffff; /* Certificate background color */
                /* Add other certificate styling here */
              }
            `}</style>
          </Modal>
        </>
      )}

      {enrolled && course?.progress !== 0 && !course?.completed && (
        <>
          <Progress
            style={{ marginTop: 12 }}
            value={(course?.progress / 10) * 100}
            label={`${
              (parseInt(course?.progress.toFixed()) / 10) * 100
            }% complete`}
            size="xl"
            radius="xl"
            color="green"
          />
          <Button
            onClick={() => setModalOpen(true)}
            mt={12}
            variant="light"
            fullWidth
            size="xs"
            rightIcon={<IconPlayerPlay fill="green" stroke={null} size={12} />}
            color="orange"
          >
            Resume{" "}
          </Button>
        </>
      )}

      <Modal
        opened={modalOpen}
        onClose={handleCloseLectureModal}
        title={null}
        fullScreen
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        {/* Modal content */}

        <div className="bg-red-100 p-[100px] pb-0">
          <div className="flex">
            <div className="w-3/4">
              <p className="text-red-700 tracking-wide uppercase text-[0.9rem]">
                {course?.category || course?.course?.category}
              </p>
              <h1 className="uppercase">
                {course?.name || course?.course?.name}
              </h1>
              <Space h={20} />
              <Text fw="lighter" c="dimmed" fz="sm">
                {course?.description || course?.course?.description}
              </Text>
              <Space h={20} />
              <Text c="dark" fw="bold">
                Who this course is for
              </Text>
              <Text c="dimmed" fw="lighter" className="mt-3">
                Anyone
              </Text>

              <Space h={20} />
              <div className="flex justify-between w-full">
                <div>
                  <div className="flex space-x-2 items-end">
                    <p className="text-[2rem] font-extralight mr-6 ">
                      <span className="text-[1rem] mr-2">Ksh.</span>
                      {course?.price || course?.course?.price}
                    </p>
                  </div>
                </div>
                <div>
                  {!enrolled && !isCourseEnrolled() && (
                    <Button
                      size="lg"
                      color="green"
                      style={{ marginRight: 48 }}
                      loading={loading}
                      onClick={handleEnroll}
                    >
                      Enroll today
                      <IconPointer
                        size={16}
                        fill="white"
                        style={{ marginLeft: 12 }}
                      />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-1/4">
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="space-y-2"
              >
                <Notification title="Lectures" disallowClose color="red">
                  {course?.lectures?.length || course?.course?.lectures?.length}{" "}
                  lectures
                </Notification>

                <Notification title="Hours" disallowClose color="red">
                  {!enrolled
                    ? toHoursAndMinutes(
                        course?.lectures?.reduce((accumulator, object) => {
                          return accumulator + object.timeEstimate;
                        }, 0)
                      )
                    : toHoursAndMinutes(
                        course?.course?.lectures?.reduce(
                          (accumulator, object) => {
                            return accumulator + object.timeEstimate;
                          },
                          0
                        )
                      )}
                </Notification>
                <Notification
                  title="Already enrolled"
                  disallowClose
                  color="red"
                >
                  130
                </Notification>
              </Card>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-4 p-8">
            {!enrolled &&
              course?.lectures.map((lecture, i) => (
                <Lecture
                  key={i}
                  lecture={lecture}
                  count={i}
                  refresh={refresh}
                  notEnrolled
                />
              ))}
            {enrolled &&
              course?.course?.lectures.map((lecture, i) => (
                <Lecture
                  key={i}
                  lecture={lecture}
                  count={i}
                  refresh={refresh}
                  progress={course.progress}
                  lecturesCount={course?.course?.lectures.length}
                  handleNext={(val) => {
                    handleNext(val);
                  }}
                  enrolled
                />
              ))}
          </div>
        </div>
      </Modal>
    </Card>
  );
};

const Lecture = ({
  lecture,
  count,
  handleNext,
  progress,
  lecturesCount,
  enrolled,
}) => {
  const [openLecture, setOpenLecture] = useState(false);

  const [submitted, setSubmitted] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState();

  const findSum = (arr) => {
    let sum = 0;
    arr.forEach((item) => (sum += item));
    return sum;
  };

  const handleSubmitAnswers = () => {
    let marklist = [];

    if (submitted?.length !== lecture?.quiz?.length) {
      showNotification({
        title: "Missing answer",
        message:
          "You have to attempt all questions to proceed to the next lectures",
        color: "orange",
      });
      return;
    }

    lecture?.quiz?.map((question, i) => {
      if (question?.answer == submitted[i]?.answer) {
        marklist.push(1);
        return;
      } else {
        marklist.push(0);
        return;
      }
    });

    setScore(findSum(marklist) / lecture?.quiz?.length);
    setShowAnswer(true);
  };

  const updateSubmitted = (newObject) => {
    const updatedArray = submitted.map((item) => {
      if (item?.index === newObject?.index) {
        return newObject;
      }
      return item;
    });

    const indexExists = submitted.some(
      (item) => item?.index === newObject?.index
    );
    if (!indexExists) {
      updatedArray.push(newObject);
    }

    setSubmitted(updatedArray);
  };

  return (
    <div className="flex  space-x-8">
      {(count / lecturesCount) * 10 < progress ? (
        <div className="bg-green-700 h-[144px] w-[144px] relative justify-center align-middle">
          <IconCheck
            color="white"
            size={48}
            className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
          />
        </div>
      ) : (
        <div className="bg-red-700 h-[144px] w-[144px] relative">
          <h1 className="absolute text-white top-[50%] w-full text-center translate-y-[-50%]">
            {count + 1}
          </h1>
        </div>
      )}

      <div className="w-4/5 p-6 space-y-2">
        <Text c="dark" fw="bold">
          {lecture?.title}
        </Text>
        <Text c="dimmed" fw="lighter" fz="sm" lineClamp={2}>
          {lecture?.description}
        </Text>
        <span className="flex">
          <IconClock color="gray" size={20} className="mr-1" />
          <Text c="gray">~30 min</Text>
        </span>
      </div>
      {enrolled && (
        <div className="space-y-2">
          {((count / lecturesCount) * 10).toFixed() == progress.toFixed() ? (
            <Button
              color="green"
              fullWidth
              onClick={() => setOpenLecture(true)}
            >
              Open
            </Button>
          ) : null}
        </div>
      )}
      <Modal
        size="70%"
        opened={openLecture}
        onClose={() => {
          setOpenLecture(false);
          setScore();
          setShowAnswer(false);
        }}
        title={<h2 className="text-[1.5rem]">{lecture?.title}</h2>}
        centered
      >
        <div className="mt-4 space-y-8">
          <Text c="gray" fw="lighter" fz="sm">
            {lecture?.description}
          </Text>
          <div>
            <Text c="dark" fw="bold" className="mb-4">
              Content
            </Text>
            <RTE value={lecture?.content} controls={[]} editable={false} />
          </div>
          <div>
            <Text c="dark" fw="bold" className="mb-4">
              Quiz
            </Text>
            {lecture?.quiz.map((question, i) => (
              <Question
                data={question}
                index={i}
                onClick={null}
                closeHidden={true}
                getSelected={(val) => updateSubmitted(val)}
              />
            ))}

            <Button mx="auto" color="red" mt={8} onClick={handleSubmitAnswers}>
              Submit
            </Button>
            {showAnswer && score < 0.8 ? (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Bummer!"
                color="red"
                mt={12}
              >
                <Text fz="xs">
                  You need to get a score of at least 80% to proceed to the next
                  level.
                </Text>
              </Alert>
            ) : showAnswer && score >= 0.8 ? (
              <Alert
                icon={<IconCircleCheck size="1.2rem" />}
                title="Nice!"
                color="green"
                mt={12}
              >
                <Text fz="xs">
                  You passed the quiz. You can now proceed to the next level.
                </Text>
              </Alert>
            ) : null}

            <div className="flex flex-row-reverse mt-4 justify-between">
              {showAnswer && score >= 0.8 && (
                <Button color="green" onClick={() => handleNext(count + 1)}>
                  Next &rarr;
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Question = ({ data, index, onClick, closeHidden, getSelected }) => {
  return (
    <div className="space-y-1 p-3 bg-gray-100 relative">
      {!closeHidden && (
        <Button
          m={0}
          p={0}
          w={24}
          h={24}
          color="red"
          onClick={onClick}
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          <IconX />
        </Button>
      )}
      <Text c="dimmed" fw="lighter">
        {`Q${index + 1}. ${data?.question}`}
      </Text>
      <Radio.Group
        //defaultValue={[data?.answer]}
        withAsterisk
        onChange={(val) => {
          getSelected({
            index,
            answer: parseInt(val),
          });
        }}
      >
        {data?.options.map((option, i) => (
          <Radio
            value={`${i}`}
            label={option}
            style={{ display: "block", width: "100%", margin: 0, padding: 0 }}
          />
        ))}
      </Radio.Group>
    </div>
  );
};
