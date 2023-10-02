import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import {
  TextInput,
  PasswordInput,
  Button,
  Burger,
  Avatar,
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  useMantineTheme,
  UnstyledButton,
  Group,
  NavLink,
  Select,
  FileInput,
  Textarea,
  Divider,
  Tabs,
  Card,
  Modal,
  Space,
  Breadcrumbs,
  Input,
  Checkbox,
  Badge,
  Table,
  HoverCard,
  NumberInput,
  Notification,
  Popover,
  Kbd,
  Chip,
  MultiSelect,
  Radio,
} from "@mantine/core";
import { useMutation, useQuery, useClient } from "urql";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconClock,
  IconExclamationCircle,
  IconExclamationMark,
  IconExclamationMarkOff,
  IconLockAccess,
  IconPlus,
  IconSearch,
  IconSearchOff,
  IconTag,
  IconUpload,
  IconX,
} from "@tabler/icons";
import { useRouter } from "next/router";
import { HSM } from "../components";
import SSSM from "../components/SSSM";

const RTE = dynamic(
  () => {
    return import("../components/RTE");
  },
  { ssr: false }
);

const GET_USER = `
    query GET_USER(
      $email: String
      $password: String
      $id: ID
    ){
      getUser(
        email: $email
        password: $password
        id: $id
      ){
        id
        image
        firstName
        lastName
        email
        phoneNumber
        password
        canModifyUsers
        canModifyContent
        canModifySections
        canModifyProducts
      }
    }
`;

const getRole = (obj) => {
  if (
    obj?.canModifyUsers &&
    obj?.canModifyContent &&
    obj?.canModifySections &&
    obj?.canModifyProducts
  ) {
    return "Super Admin";
  } else if (
    !obj?.canModifyUsers &&
    obj?.canModifyContent &&
    !obj?.canModifySections &&
    obj?.canModifyProducts
  ) {
    return "Content Manager";
  } else {
    return "Custom Roles";
  }
};

const UnAuthorized = () => {
  return (
    <div className="w-full h-full relative">
      <div className="top-[50%] absolute left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <IconLockAccess color="red" size={144} className="mx-auto" />
        <h1 className="w-full text-center">Access Denied</h1>
        <Text c="dimmed" fw="lighter" className="w-full text-center">
          You do not have the rights to perfom actions in this section
        </Text>
      </div>
    </div>
  );
};

export default function Admin() {
  const [navLink, setNavLink] = useState("hsm");

  const [{ data: aData, fetching: aFetching, error: aError }, reexecuteQuery] =
    useQuery({
      query: GET_USER,
      variables: {
        id:
          typeof window !== "undefined" &&
          window.localStorage &&
          localStorage.getItem("s_adminId"),
      },
    });

  if (!aData?.getUser) return <Login />;
  return (
    <Layout
      loggedIn={aData?.getUser}
      active={navLink}
      getNavLink={(val) => setNavLink(val)}
    />
  );
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const graphqlClient = useClient();
  const router = useRouter();

  const handleLogin = () => {
    graphqlClient
      .query(GET_USER, {
        email,
        password,
      })
      .toPromise()
      .then(({ data, error }) => {
        if (data?.getUser && !error) {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("s_adminId", data?.getUser?.id);
            showNotification({
              message: `Welcome back ${data?.getUser?.firstName}`,
              title: "Success!",
              color: "green",
            });
            router.reload();
            return;
          }
        }
        if (!data?.getUser) {
          showNotification({
            message: "Check or retry password",
            title: "Login failed",
            color: "red",
          });
        }
      });
  };

  return (
    <div className="bg-[#f1f1f1] h-screen">
      <div className="w-full ">
        <img src="/logo.svg" alt="logo" srcset="" />
      </div>
      <div className="mt-12 mx-auto w-1/3 ">
        <div className="bg-white p-8 space-y-4 h-[300px]">
          <h1
            className="m-0 font-[Oswald] w-full text-center
          "
          >
            Admin <span className="text-red-700">Login</span>
          </h1>
          <TextInput
            placeholder="Email"
            className="bg-[#f1f1f1]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="cursor-pointer w-full text-right text-[0.7rem] text-red-700">
            Forgot password
          </p>
          <Button
            style={{
              background: "rgb(185,28,28)",
              fontWeight: "lighter",
              borderRadius: 0,
              width: "50%",
            }}
            className="float-right uppercase bg-red-700 font-light w-1/2"
            onClick={handleLogin}
          >
            sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ loggedIn, active, getNavLink }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [profile, setProfile] = useState({
    firstName: loggedIn?.firstName,
    lastName: loggedIn?.lastName,
    phoneNumber: loggedIn?.phoneNumber,
  });

  const UPDATE_USER = `
    mutation UPDATE_USER(
      $firstName: String,
      $lastName: String
      $phoneNumber: String
      $password: String
      $email: String
    ){
      updateUser(
        firstName: $firstName
        lastName: $lastName
        phoneNumber: $phoneNumber
        password: $password
        email: $email
      ){
        firstName
        lastName
      }
    }
  `;

  const [_, _updateUser] = useMutation(UPDATE_USER);

  const handleSaveInfo = () => {
    setLoading(true);
    const { firstName, lastName, phoneNumber } = profile;
    console.log({
      firstName,
      lastName,
      phoneNumber,
      email: loggedIn?.email,
    });
    _updateUser({
      firstName,
      lastName,
      phoneNumber,
      email: loggedIn?.email,
    })
      .then(({ data, error }) => {
        console.log(data, error);
        if (data && !error) {
          showNotification({
            title: "Success",
            message: "Profile updated successfully",
            color: "green",
          });
          setProfile({
            firstName: loggedIn?.firstName,
            lastName: loggedIn?.lastName,
            phoneNumber: loggedIn?.phoneNumber,
          });
        }
      })
      .finally(() => {
        setLoading(false);
        setProfileModal(false);
      });
  };

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 250 }}
        >
          <div className="mt-6">
            {/* <NavLink
              label="Site Section Management"
              active={active == "ssm"}
              color="red"
              onClick={() => getNavLink("ssm")}
            /> */}
            <NavLink
              label="Edit home page"
              active={active == "hsm"}
              color="red"
              onClick={() => getNavLink("hsm")}
            />
            <NavLink
              label="Edit service page"
              active={active == "sssm"}
              color="red"
              onClick={() => getNavLink("sssm")}
            />
            <NavLink
              label="Product Management"
              active={active == "pm"}
              color="red"
              onClick={() => getNavLink("pm")}
            />
            <NavLink
              label="User & Access Management"
              active={active == "uam"}
              color="red"
              onClick={() => getNavLink("uam")}
            />
            <NavLink
              label="Course Management"
              active={active == "cm"}
              color="red"
              onClick={() => getNavLink("cm")}
            />
            <NavLink
              label="Contact Info"
              active={active == "ci"}
              color="red"
              onClick={() => getNavLink("ci")}
            />
          </div>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div className="flex h-full align-middle">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <div className="flex justify-between w-full">
              <img src="/logo.svg" className="h-[64px] mt-[-12px]" alt="logo" />

              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <UnstyledButton>
                    <Group>
                      {loggedIn?.image ? (
                        <Avatar
                          size={40}
                          src={loggedIn?.image}
                          alt={loggedIn?.firstName}
                        />
                      ) : (
                        <Avatar color="red" size={40}>
                          {loggedIn?.firstName?.charAt(0) +
                            loggedIn?.lastName?.charAt(0)}
                        </Avatar>
                      )}
                      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                        <div>
                          <Text>
                            {loggedIn?.firstName + " " + loggedIn?.lastName}
                          </Text>
                          <Text size="xs" color="dimmed">
                            {getRole(loggedIn)}
                          </Text>
                        </div>
                      </MediaQuery>
                    </Group>
                  </UnstyledButton>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      variant="subtle"
                      color="red"
                      size="xs"
                      onClick={() => setProfileModal(true)}
                    >
                      View profile
                    </Button>
                    <Button
                      fullWidth
                      color="red"
                      size="xs"
                      onClick={() => {
                        localStorage.clear();
                        router.reload();
                      }}
                    >
                      Log out
                    </Button>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
            </div>
          </div>
        </Header>
      }
    >
      <Modal
        opened={profileModal}
        onClose={() => setProfileModal(false)}
        title={<h1 className="py-4 text-[1.2rem]">My Profile</h1>}
      >
        <div className="p-4">
          <div></div>
          <div className="w-full space-y-4">
            <div className="flex w-full space-x-4">
              <TextInput
                placeholder="Your first name"
                label="First name"
                withAsterisk
                value={profile?.firstName}
                onChange={(e) => {
                  setProfile((profile) => {
                    return { ...profile, firstName: e.target.value };
                  });
                }}
                defaultValue={loggedIn?.firstName}
              />
              <TextInput
                placeholder="Your last name"
                label="Last name"
                value={profile?.lastName}
                onChange={(e) => {
                  setProfile((profile) => {
                    return { ...profile, lastName: e.target.value };
                  });
                }}
                defaultValue={loggedIn?.lastName}
              />
            </div>
            <TextInput
              placeholder="Your phone number"
              label="Phone number"
              value={profile?.phoneNumber}
              onChange={(e) => {
                setProfile((profile) => {
                  return { ...profile, phoneNumber: e.target.value };
                });
              }}
              defaultValue={loggedIn?.phoneNumber}
            />
            <TextInput
              placeholder="Your email"
              label="Email"
              disabled
              defaultValue={loggedIn?.email}
            />
            <Space h={10} />
            <Divider my="xs" label="My rights" />

            <div>
              <Checkbox
                disabled
                checked={loggedIn?.canModifyUsers}
                label="User management"
              />
              <Checkbox
                disabled
                checked={loggedIn?.canModifyContent}
                label="Course management"
              />
              <Checkbox
                disabled
                checked={loggedIn?.canModifySections}
                label="Site Sections management"
              />
              <Checkbox
                disabled
                checked={loggedIn?.canModifyProducts}
                label="Product management"
              />
            </div>

            <Button
              loading={loading}
              color="red"
              fullWidth
              onClick={handleSaveInfo}
            >
              Save Information
            </Button>
          </div>
        </div>
      </Modal>
      {/* {active == "ssm" && <SSM loggedIn={loggedIn} />} */}
      {active == "hsm" && <HSM loggedIn={loggedIn} />}
      {active == "sssm" && <SSSM loggedIn={loggedIn} />}
      {active == "uam" && <UAM loggedIn={loggedIn} />}
      {active == "cm" && <CM loggedIn={loggedIn} />}
      {active == "pm" && <PM loggedIn={loggedIn} />}
      {active == "ci" && <CI loggedIn={loggedIn} />}
    </AppShell>
  );
};

// User & Access management
const UAM = ({ loggedIn }) => {
  return (
    <div>
      <Tabs variant="outline" defaultValue="view">
        <Tabs.List>
          <Tabs.Tab value="view">View users</Tabs.Tab>
          <Tabs.Tab value="add">Add user</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="view" pt="xs">
          <ViewUsers loggedIn={loggedIn} />
        </Tabs.Panel>

        <Tabs.Panel value="add" pt="xs">
          {loggedIn?.canModifyUsers ? (
            <AddUsers />
          ) : (
            <div className="mt-[20%]">
              <UnAuthorized />
            </div>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

const ViewUsers = ({ loggedIn }) => {
  const [optionsModal, setOptionsModal] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [access, setAccess] = useState({
    canModifyUsers: false,
    canModifyContent: false,
    canModifySections: false,
    canModifyProducts: false,
  });

  const GET_USERS = `
      query GET_USERS{
        getUsers{      
          firstName
          lastName
          canModifyUsers
          canModifyContent
          canModifySections
          canModifyProducts
          email
          phoneNumber
          image
          id
        }
      }
  `;
  const DELETE_USER = `
      mutation DELETE_USER(
        $email: String
      ){
        deleteUser(email: $email){
          id
          email
        }
      }
  `;

  const UPDATE_USER = `
      mutation UpdateUser($email: String, $canModifyUsers: Boolean, $password: String, $canModifyContent: Boolean, $canModifySections: Boolean, $canModifyProducts: Boolean) {
  updateUser(email: $email, canModifyUsers: $canModifyUsers, password: $password, canModifyContent: $canModifyContent, canModifySections: $canModifySections, canModifyProducts: $canModifyProducts) {
    id
    firstName
  }
}
   `;

  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_USERS,
  });

  const [_, _deleteUser] = useMutation(DELETE_USER);
  const [__, _updateUser] = useMutation(UPDATE_USER);

  if (fetching) return <p>Loading ....</p>;
  if (error) return <p>Error ....</p>;

  const handleCloseModal = () => {
    setEmail("");
    setOptionsModal(false);
  };

  const handleDeleteUser = () => {
    if (confirmText !== "serenepsl") {
      showNotification({
        icon: <IconExclamationMark />,
        message: "Try again",
        color: "red",
        title: "Wrong confirmation text",
      });

      return;
    }

    _deleteUser({
      email,
    }).then(({ data, error }) => {
      if (!error) {
        showNotification({
          icon: <IconCheck />,
          color: "green",
          title: "User removed successfully",
        });
        setEmail("");
        setConfirmText("");
        setOptionsModal(false);
        reexecuteQuery();
      }
    });
  };

  const resetPassword = () => {
    _updateUser({
      email,
      password: "serenepsl",
    }).then(({ data, error }) => {
      if (!error) {
        showNotification({
          color: "green",
          title: "Password reset successfully",
          icon: <IconCheck />,
        });

        return;
      }

      showNotification({
        color: "red",
        title: "Oops! Something occured",
        message: "Try again later",
        icon: <IconExclamation />,
      });
    });
  };

  const handleUpdatePermissions = () => {
    console.log({ email, ...access });
    _updateUser({
      email,
      ...access,
    }).then(({ data, error }) => {
      if (!error) {
        showNotification({
          color: "green",
          title: "Permissions updated successfully",
          icon: <IconCheck />,
        });
        setAccess({
          canModifyUsers: false,
          canModifyContent: false,
          canModifySections: false,
          canModifyProducts: false,
        });
        reexecuteQuery();
        return;
      }

      showNotification({
        color: "red",
        title: "Oops! Something occured",
        message: "Try again later",
        icon: <IconExclamationMark />,
      });
    });
  };

  return (
    <div className="w-full p-6 font-light text-[0.8rem]">
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.getUsers.map((user) => {
            return (
              <tr key={user?.id}>
                <td>
                  {user?.image ? (
                    <Avatar src={user?.image} alt={user?.fullName} />
                  ) : (
                    <Avatar color="red">
                      {user?.firstName?.charAt(0) + user?.lastName?.charAt(0)}
                    </Avatar>
                  )}
                </td>
                <td>{user?.firstName + " " + user?.lastName}</td>
                <td>{user?.email}</td>
                <td>
                  {user?.phoneNumber ? (
                    user?.phoneNumber
                  ) : (
                    <Badge color="yellow">Missing</Badge>
                  )}
                </td>
                <td>{getRole(user)}</td>
                {loggedIn?.canModifyUsers && (
                  <td>
                    <div className="flex">
                      <Button
                        color="red"
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          setEmail(user?.email);
                          setOptionsModal(true);
                        }}
                      >
                        Options
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal
        opened={optionsModal && email}
        onClose={handleCloseModal}
        centered
        title={
          <UnstyledButton>
            <Group>
              <Avatar size={40} color="blue">
                {data?.getUsers
                  ?.filter((user) => user?.email == email)[0]
                  ?.firstName.charAt(0) +
                  data?.getUsers
                    ?.filter((user) => user?.email == email)[0]
                    ?.lastName.charAt(0)}
              </Avatar>
              <div>
                <Text>
                  {data?.getUsers?.filter((user) => user?.email == email)[0]
                    ?.firstName +
                    " " +
                    data?.getUsers?.filter((user) => user?.email == email)[0]
                      ?.lastName}
                </Text>
                <Text size="xs" color="dimmed">
                  {email}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        }
      >
        <Tabs defaultValue="pass" color="dark">
          <Tabs.List>
            <Tabs.Tab value="pass">Access & resetting password</Tabs.Tab>
            <Tabs.Tab value="remove">Removing admin</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pass" pt="xs">
            <div className="space-y-8 mt-8">
              <Radio
                label="User can modify course content"
                checked={access?.canModifyContent}
                onChange={(e) =>
                  setAccess((_access) => ({
                    ..._access,
                    canModifyContent: e.target.checked,
                  }))
                }
              />
              <Radio
                label="User can modify products"
                checked={access?.canModifyProducts}
                onChange={(e) =>
                  setAccess((_access) => ({
                    ..._access,
                    canModifyProducts: e.target.checked,
                  }))
                }
              />
              <Radio
                label="User can modify admins"
                checked={access?.canModifyUsers}
                onChange={(e) =>
                  setAccess((_access) => ({
                    ..._access,
                    canModifyUsers: e.target.checked,
                  }))
                }
              />
              <Radio
                label="User can modify site sections"
                checked={access?.canModifySections}
                onChange={(e) =>
                  setAccess((_access) => ({
                    ..._access,
                    canModifySections: e.target.checked,
                  }))
                }
              />
              <Button
                fullWidth
                color="red"
                style={{ marginTop: 24 }}
                onClick={handleUpdatePermissions}
              >
                Update permissions
              </Button>

              <Divider />

              <Button
                fullWidth
                color="red"
                variant="outline"
                style={{ marginTop: 24 }}
                onClick={resetPassword}
              >
                Reset password
              </Button>
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="remove" pt="xs">
            <div className="space-y-8 mt-8">
              <p>
                To delete this user permanently , type <Kbd>serenepsl</Kbd>
              </p>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
              <Button color="red" onClick={handleDeleteUser}>
                Remove user
              </Button>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </div>
  );
};

const AddUsers = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userLevelAccess: "",
  });
  const [loading, setLoading] = useState(false);

  const ADD_USER = `
    mutation ADD_USER(
      $firstName: String
      $lastName: String
      $email: String     
      $userLevelAccess: String
    ){
      addUser(
        firstName: $firstName
        lastName: $lastName
        email: $email
        userLevelAccess: $userLevelAccess
      ){
        id
        firstName        
      }
    }
  `;

  const [_, _addUser] = useMutation(ADD_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    setLoading(true);

    if (!user?.email || !user?.firstName) {
      showNotification({
        title: "Missing fields",
        message: "First name and email are required fields",
        color: "orange",
      });
      setLoading(false);
      return;
    }

    _addUser({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      userLevelAccess: user?.userLevelAccess,
    })
      .then(({ data, error }) => {
        if (data && !error) {
          showNotification({
            title: "Success",
            message: "User was added successfully",
            color: "green",
          });
          return;
        }
        showNotification({
          title: "Error",
          message: "Error encountered adding a user",
          color: "red",
        });
      })
      .catch((err) => {
        showNotification({
          title: "Error",
          message: "Error encountered adding a user",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
        setUser({
          email: "",
          firstName: "",
          lastName: "",
          userLevelAccess: "",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-3/5 p-6">
      <div>
        <TextInput
          label="First name"
          placeholder="Enter first name"
          value={user?.firstName}
          onChange={(e) =>
            setUser((user) => {
              return { ...user, firstName: e.target.value };
            })
          }
          required
        />
      </div>
      <div>
        <TextInput
          label="Last name"
          placeholder="Enter last name"
          value={user?.lastName}
          onChange={(e) =>
            setUser((user) => {
              return { ...user, lastName: e.target.value };
            })
          }
          required
        />
      </div>
      <div>
        <TextInput
          label="Email"
          placeholder="Staff email"
          value={user?.email}
          onChange={(e) =>
            setUser((user) => {
              return { ...user, email: e.target.value };
            })
          }
          required
        />
      </div>
      <Select
        value={user?.userLevelAccess}
        onChange={(val) =>
          setUser((user) => {
            return { ...user, userLevelAccess: val };
          })
        }
        label="Admin role"
        placeholder="Pick a role"
        data={[
          {
            value: "super-admin",
            label: "Super admin",
          },
          {
            value: "content-manager",
            label: "Content manager",
          },
        ]}
      />
      <Button color="red" type="submit" loading={loading}>
        Add User
      </Button>
    </form>
  );
};

// course management
const CM = ({ loggedIn }) => {
  return (
    <div>
      <Tabs defaultValue="view" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="view">View courses</Tabs.Tab>
          <Tabs.Tab value="add">Add courses</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="view" pt="xs">
          <ViewCourses />
        </Tabs.Panel>

        <Tabs.Panel value="add" pt="xs">
          <AddCourseForm loggedIn={loggedIn} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

const ViewCourses = () => {
  const [keyword, setKeyword] = useState("");

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
            lastName
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

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error ...</p>;

  return (
    <div className="p-8">
      <Input
        placeholder="Search course"
        rightSection={<IconSearch />}
        value={keyword}
        style={{ margin: 8 }}
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
        />
      ))}
    </div>
  );
};

const CourseListing = ({ courses, label, refresh }) => {
  return (
    <>
      <Divider my="xs" label={label} labelPosition="right" />

      <div className="grid grid-cols-3 gap-8">
        {courses.map((course) => (
          <Course course={course} refresh={refresh} />
        ))}
      </div>
    </>
  );
};

const Course = ({ course, refresh }) => {
  console.log(course);
  const [modalOpen, setModalOpen] = useState(false);
  const [lectureModal, setLectureModal] = useState(false);
  const [questionModal, setQuestionModal] = useState(false);

  const [lecture, setLecture] = useState({
    description: "",
    content: "",
    title: "",
    quiz: [],
    course: "",
    timeEstimate: null,
  });

  const [question, setQuestion] = useState({
    question: "",
    answer: 0,
    options: [],
  });

  const [option, setOption] = useState("");
  const [correct, setCorrect] = useState(false);

  const [loading, setLoading] = useState(false);

  const ADD_LECTURE = `
      mutation ADD_LECTURE(
        $description: String
        $content: String
        $title: String
        $quiz: String
        $course: ID 
        $timeEstimate: Int
      ){
        addLecture(
          description: $description
          content: $content
          title: $title
          quiz: $quiz
          course: $course
          timeEstimate: $timeEstimate
        ){
          id
          title          
        }
      }
  `;

  const [_, _addLecture] = useMutation(ADD_LECTURE);

  const handleAddOption = () => {
    if (!option) {
      return;
    }
    if (correct) {
      setQuestion((question) => {
        console.log(question?.options?.length);
        return { ...question, answer: question?.options?.length };
      });
    }
    setQuestion((question) => {
      return { ...question, options: [...question?.options, option] };
    });
    setCorrect(false);
    setOption("");
  };

  const handleCloseQuestionModal = () => {
    setQuestionModal(false);
    setQuestion({
      question: "",
      answer: 0,
      options: [],
    });
  };

  const handleAddQuestion = () => {
    setLecture((lecture) => {
      return { ...lecture, quiz: [...lecture?.quiz, question] };
    });
    setQuestion({
      question: "",
      answer: 0,
      options: [],
    });
    setQuestionModal(false);
  };

  const handleRemoveQuestion = (id) => {
    setLecture((lecture) => {
      return {
        ...lecture,
        quiz: [...lecture?.quiz.filter((quiz, i) => i !== id)],
      };
    });
  };

  const handleSaveLecture = () => {
    setLoading(true);

    _addLecture({
      title: lecture?.title,
      description: lecture?.description,
      content: lecture?.content,
      quiz: JSON.stringify(lecture?.quiz),
      course: course?.id,
      timeEstimate: lecture?.timeEstimate,
    })
      .then(({ data, error }) => {
        console.log(data, error);
        if (data && !error) {
          showNotification({
            title: "Success",
            message: "Lecture added successfully!",
            color: "green",
          });
          return;
        }
        showNotification({
          title: "Failed",
          message: "Error occurred saving the lecture!",
          color: "red",
        });
      })
      .catch((err) => {
        showNotification({
          title: "Failed",
          message: "Error occurred saving the lecture!",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
        handleCloseLectureModal();
        setLectureModal(false);
      });
  };

  const handleCloseLectureModal = () => {
    setModalOpen(false);
    setLecture({
      description: "",
      content: "",
      title: "",
      quiz: [],
      course: "",
    });
  };

  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <img className="w-full" src={course?.image} />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{course?.name.toUpperCase()}</Text>
        {course?.onSale && (
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        )}
      </Group>

      <Text size="sm" color="dimmed" lineClamp={3} fw="lighter">
        {course?.description}
      </Text>

      <Button
        onClick={() => {
          setModalOpen(true);
          setLectureModal(false);
        }}
        color="dark"
        uppercase
        fullWidth
        mt="md"
        size="xs"
      >
        View Course
      </Button>

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
                {course?.category}
              </p>
              <h1 className="uppercase">{course?.name}</h1>
              <Space h={20} />
              <Text fw="lighter" c="dimmed">
                {course?.description}
              </Text>
              <Space h={20} />
              <span className="flex text-green-700">
                <IconTag className="mr-2" size={20} /> Ksh.{" "}
                {course?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
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
                  {course?.lectures?.length} lectures
                </Notification>
                <Notification title="Added By" disallowClose color="red">
                  <span className="flex space-x-4">
                    <Text c="dimmed" className="mt-2">
                      {course?.addedBy?.firstName +
                        " " +
                        course?.addedBy?.lastName}
                    </Text>
                  </span>
                </Notification>
                <Notification title="Hours" disallowClose color="red">
                  {toHoursAndMinutes(
                    course?.lectures?.reduce((accumulator, object) => {
                      return accumulator + object.timeEstimate;
                    }, 0)
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
          <Tabs defaultValue="lectures" variant="outline">
            <Tabs.List>
              <Tabs.Tab value="lectures">Lectures</Tabs.Tab>
              <Tabs.Tab value="trainees">Trainees</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="lectures" pt="xs">
              <Modal
                opened={lectureModal}
                onClose={() => setLectureModal(false)}
                title={<h1 className="py-4">Add Lecture</h1>}
                size="50%"
              >
                <div className="space-y-6 p-6">
                  <NumberInput
                    value={lecture?.timeEstimate}
                    onChange={(val) =>
                      setLecture((lecture) => {
                        return { ...lecture, timeEstimate: val };
                      })
                    }
                    placeholder="ex. 45"
                    label="Time estimate (min)"
                    withAsterisk
                  />
                  <TextInput
                    placeholder="ex. Basic first aid training"
                    withAsterisk
                    variant="filled"
                    label="Lecture Title"
                    value={lecture?.title}
                    onChange={(e) =>
                      setLecture((lecture) => {
                        return { ...lecture, title: e.target.value };
                      })
                    }
                  />
                  <Textarea
                    label="Lecture description"
                    variant="filled"
                    minRows={4}
                    value={lecture?.description}
                    onChange={(e) =>
                      setLecture((lecture) => {
                        return { ...lecture, description: e.target.value };
                      })
                    }
                  />
                  <div>
                    <label className="text-[0.85rem]">Content</label>

                    <RTE
                      value={lecture?.content}
                      onChange={(val) =>
                        setLecture((lecture) => {
                          return { ...lecture, content: val };
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[0.85rem]">Quiz</label>
                    <div className="space-y-2">
                      {lecture?.quiz?.length <= 0 && (
                        <Text c="dimmed" fw="lighter" className="my-3">
                          No quizzes added
                        </Text>
                      )}
                      {lecture?.quiz?.map((question, i) => (
                        <Question
                          data={question}
                          key={i}
                          index={i}
                          onClick={() => handleRemoveQuestion(i)}
                        />
                      ))}
                      <Button
                        fullWidth
                        color="green"
                        leftIcon={<IconPlus />}
                        onClick={() => {
                          setQuestionModal(true);
                        }}
                      >
                        Add Question
                      </Button>
                    </div>
                  </div>
                  <Space h={40} />
                  <Button
                    size="lg"
                    fullWidth
                    color="red"
                    onClick={handleSaveLecture}
                    loading={loading}
                  >
                    Save Lecture
                  </Button>
                  <Modal
                    opened={questionModal}
                    title={<h1 className="py-4">Add Question</h1>}
                    onClose={handleCloseQuestionModal}
                  >
                    <div className="space-y-4">
                      <Textarea
                        placeholder=""
                        withAsterisk
                        variant="filled"
                        label="Question"
                        value={question?.title}
                        onChange={(e) =>
                          setQuestion((question) => {
                            return {
                              ...question,
                              question: e.target.value,
                            };
                          })
                        }
                      />

                      <div>
                        <label className="text-[0.85rem]">Options</label>
                        <Checkbox.Group value={`${question?.answer}`}>
                          {question?.options?.map((option, i) => (
                            <Checkbox
                              value={`${i}`}
                              label={option}
                              disabled
                              style={{
                                display: "block",
                                width: "100%",
                                margin: 0,
                                padding: 0,
                              }}
                            />
                          ))}
                        </Checkbox.Group>

                        <div>
                          <div className="flex justify-between my-3">
                            <Input
                              value={option}
                              onChange={(e) => setOption(e.target.value)}
                              variant="filled"
                              placeholder="New option"
                              style={{ width: "75%" }}
                            />
                            <Button
                              color="green"
                              className="w-full"
                              onClick={handleAddOption}
                            >
                              Add
                            </Button>
                          </div>
                          <Checkbox
                            label="Correct answer"
                            color="green"
                            size="xs"
                            checked={correct}
                            value={correct}
                            onChange={(e) => setCorrect(e.target.checked)}
                          />
                        </div>
                      </div>

                      <Button
                        fullWidth
                        color="green"
                        size="lg"
                        leftIcon={<IconPlus />}
                        onClick={handleAddQuestion}
                      >
                        Save
                      </Button>
                    </div>
                  </Modal>
                </div>
              </Modal>
              {course?.lectures?.length <= 0 ? (
                <div className="w-full relative min-h-[350px]">
                  <div className=" my-[56px] absolute left-[50%] translate-x-[-50%]">
                    <IconSearch color="red" size={144} className="mx-auto" />
                    <h1>Nothing found</h1>
                    <Text
                      c="dimmed"
                      fw="lighter"
                      className="w-full text-center"
                    >
                      Add your first lecture
                    </Text>
                  </div>
                  <Button
                    m={0}
                    p={0}
                    w={56}
                    h={56}
                    color="red"
                    onClick={() => setLectureModal(true)}
                    style={{ position: "absolute", bottom: 0, right: "2rem" }}
                  >
                    <IconPlus />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-8 ">
                  {course?.lectures.map((lecture, i) => (
                    <Lecture
                      key={i}
                      lecture={lecture}
                      count={i}
                      refresh={refresh}
                    />
                  ))}
                  <Button
                    m={0}
                    p={0}
                    w={56}
                    h={56}
                    color="red"
                    onClick={() => setLectureModal(true)}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: "2rem",
                    }}
                  >
                    <IconPlus />
                  </Button>
                </div>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="trainees" pt="xs">
              <p>Trainees</p>
            </Tabs.Panel>
          </Tabs>
        </div>
      </Modal>
    </Card>
  );
};

const Lecture = ({ lecture, count, refresh }) => {
  const [openLecture, setOpenLecture] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const UPDATE_LECTURE = `
    mutation UPDATE_LECTURE(
      $id: ID
      $title: String
      $quiz: String
      $content: String
      $description: String
      $timeEstimate: Int
      $removed: Boolean
    ){
      updateLecture(
        id: $id
        title: $title
        quiz: $quiz
        content: $content
        description: $description
        removed: $removed
        timeEstimate: $timeEstimate
      ){
        id
      }
    }
  `;

  const [_, _updateLecture] = useMutation(UPDATE_LECTURE);

  const handleDeleteLecture = () => {
    _updateLecture({
      id: lecture?.id,
      removed: true,
    })
      .then(({ data, error }) => {
        if (data && !error) {
          showNotification({
            title: "Success",
            message: "Lecture deleted",
            color: "green",
          });
          return;
        }
      })
      .finally(() => {
        setConfirmText("");
        setConfirm(false);
        setOpenLecture(false);
        refresh();
      });
  };

  return (
    <div className="flex  space-x-8">
      <div className="bg-red-700 h-[144px] w-[144px] relative">
        <h1 className="absolute text-white top-[50%] w-full text-center translate-y-[-50%]">
          {count + 1}
        </h1>
      </div>
      <div className="w-4/5 p-6 space-y-2">
        <Text c="dark" fw="bold">
          {lecture?.title}
        </Text>
        <Text c="dimmed" fw="lighter" lineClamp={2}>
          {lecture?.description}
        </Text>
        <span className="flex">
          <IconClock color="gray" size={20} className="mr-1" />
          <Text c="gray">~{lecture?.timeEstimate} min</Text>
        </span>
      </div>
      <div className="space-y-2">
        <Button color="green" fullWidth onClick={() => setOpenLecture(true)}>
          Open
        </Button>

        <Popover
          opened={confirm}
          onChange={setConfirm}
          width={300}
          position="bottom"
          withArrow
          shadow="md"
        >
          <Popover.Target>
            <Button
              color="red"
              variant="outline"
              fullWidth
              onClick={() => setConfirm((confirm) => !confirm)}
            >
              Delete
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <div className="space-y-2">
              <Text c="dimmed" fw="lighter">
                To confirm deletion, type <Kbd>serenepsl</Kbd>
              </Text>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                variant="filled"
                className="w-full"
              />
              {confirmText == "serenepsl" && (
                <Button fullWidth color="green" onClick={handleDeleteLecture}>
                  Confirm deletion
                </Button>
              )}
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>
      <Modal
        size="70%"
        opened={openLecture}
        onClose={() => setOpenLecture(false)}
        title={<h2 className="text-[1.5rem]">{lecture?.title}</h2>}
        centered
      >
        <div className="mt-4 space-y-8">
          <Text c="gray" fw="lighter">
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
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Question = ({ data, index, onClick, closeHidden }) => {
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
      <Checkbox.Group defaultValue={[data?.answer]} withAsterisk>
        {data?.options.map((option, i) => (
          <Checkbox
            value={i}
            label={option}
            disabled
            style={{ display: "block", width: "100%", margin: 0, padding: 0 }}
          />
        ))}
      </Checkbox.Group>
    </div>
  );
};

const AddCourseForm = ({ loggedIn }) => {
  const courseInput = useRef();
  const [data, setData] = useState(["data1", "data2"]);
  const [course, setCourse] = useState({
    name: "",
    image: "",
    description: "",
    price: 0,
    onSale: false,
    category: "",
    was: 0,
    addedBy: loggedIn?.id,
    featured: false,
  });
  const [loading, setLoading] = useState(false);

  const ADD_COURSE = `
      mutation ADD_COURSE(       
        $name: String
        $addedBy: ID
        $price: Int
        $description: String
        $image: String
        $category: String
        $onSale: Boolean
        $was: Int
        $featured: Boolean
      ){
        addCourse(
          name: $name
          addedBy: $addedBy
          price: $price
          description: $description
          image: $image
          category: $category
          onSale: $onSale
          was: $was
          featured: $featured
        ){
          id
          name
        }
      }
  `;

  const [_, _addCourse] = useMutation(ADD_COURSE);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let base64;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64 = reader.result;
        resolve(base64);
      };
      reader.onerror = () => {
        reject(null);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const { name, addedBy, price, description, image, category, onSale, was } =
      course;

    let courseImage = await getBase64(image);

    _addCourse({
      name,
      price,
      description,
      image: courseImage,
      category,
      onSale,
      was,
      addedBy,
    })
      .then(({ data, error }) => {
        console.log(data, error);
        if (data && !error) {
          showNotification({
            message: "Course added successfully",
            title: "Success!",
            color: "green",
          });
          return;
        }
        showNotification({
          message: "Course addition failed",
          title: "Error!",
          color: "red",
        });
      })
      .catch((err) => {
        showNotification({
          message: "Course addition failed",
          title: "Error!",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
        setCourse({
          name: "",
          was: 0,
          price: 0,
          category: "",
          description: "",
          image: "",
          onSale: false,
          featured: false,
        });
      });
  };

  return (
    <div className="p-8">
      <form className="space-y-3 w-3/5" onSubmit={handleSubmit}>
        <div>
          <label className="text-[0.9rem]">
            Course image <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            ref={courseInput}
            className="hidden"
            onChange={(e) =>
              setCourse((course) => {
                return { ...course, image: e.target.files[0] };
              })
            }
          />
          <button
            className="bg-green-600 text-white p-2 flex space-x-1 mt-4"
            onClick={() => courseInput.current.click()}
          >
            <IconUpload />
            <span className="mt-[4px]">Upload</span>
          </button>

          {course?.image && (
            <div className="p-8 relative w-[90%]">
              <img
                src={URL.createObjectURL(course?.image)}
                alt="product"
                className="aspect-auto"
              />
              <button
                onClick={() =>
                  setCourse((course) => {
                    return { ...course, image: "" };
                  })
                }
                className="absolute top-0 right-0 h-[40px] w-[40px] bg-red-800 rounded-full text-white m-0 p-0"
              >
                <IconX className="mx-auto" />
              </button>
            </div>
          )}
        </div>
        <Select
          label="Category"
          data={data}
          placeholder="Select a category"
          nothingFound="Nothing found"
          searchable
          creatable
          value={course?.category}
          onChange={(val) =>
            setCourse((course) => {
              return { ...course, category: val };
            })
          }
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            setData((current) => [...current, query]);
            return;
          }}
        />
        <TextInput
          label="Course name"
          placeholder="Course name"
          value={course?.name}
          onChange={(e) =>
            setCourse((course) => {
              return { ...course, name: e.target.value };
            })
          }
          required
        />
        <Textarea
          minRows={8}
          label="Course description"
          placeholder="Course description"
          value={course?.description}
          onChange={(e) =>
            setCourse((course) => {
              return { ...course, description: e.target.value };
            })
          }
          required
        />

        <NumberInput
          label="Course cost"
          placeholder="Course cost"
          value={course?.price}
          onChange={(val) => {
            console.log(val);
            setCourse((course) => {
              return { ...course, price: val };
            });
          }}
          icon={"Ksh. "}
        />

        <Checkbox
          color="red"
          value={course?.onSale}
          label="Course on sale"
          onChange={(e) =>
            setCourse((course) => {
              return { ...course, onSale: e.target.checked };
            })
          }
        />

        <Checkbox
          color="red"
          value={course?.featured}
          label="Featured course"
          onChange={(e) =>
            setCourse((course) => {
              return { ...course, featured: e.target.checked };
            })
          }
        />
        {course?.onSale && (
          <NumberInput
            label="Course was"
            placeholder="Course was"
            value={course?.was}
            onChange={(val) => {
              console.log(val);
              setCourse((course) => {
                return { ...course, was: val };
              });
            }}
            icon={"Ksh. "}
          />
        )}

        <Space h={20} />
        <div className="flex flex-row-reverse w-full">
          <Button color="red" loading={loading} type="submit">
            Add course
          </Button>
        </div>
      </form>
    </div>
  );
};

const PM = ({ loggedIn }) => {
  return (
    <div>
      <Tabs defaultValue="view" variant="outline">
        <Tabs.List>
          <Tabs.Tab value="view">View products</Tabs.Tab>
          <Tabs.Tab value="add">Add product</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="view" pt="xs">
          <ViewProducts loggedIn={loggedIn} />
        </Tabs.Panel>

        <Tabs.Panel value="add" pt="xs">
          {loggedIn?.canModifyProducts ? (
            <AddProductForm />
          ) : (
            <div className="mt-[20%]">
              <UnAuthorized />
            </div>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

const AddProductForm = () => {
  const productFileInput = useRef();
  const specsFileInput = useRef();
  const [catsNsubCats, setCatsNSubCats] = useState();
  const [catList, setCatList] = useState([]);
  const [subcatList, setSubCatList] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [productImage, setProductImage] = useState("");
  const [data, setData] = useState([]);
  const [specsheetImage, setSpecsheetImage] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const graphqlClient = useClient();

  const UPLOAD_PRODUCT = `
      mutation UPLOAD_PRODUCT(
        $category: String
        $subCategory: String
        $name: String
        $image: String
        $specSheet: String
        $description: String
        $featured: Boolean
        $price: Int
      ){
        addProduct(
          category: $category
          subCategory: $subCategory
          name: $name
          image: $image
          specSheet: $specSheet
          description : $description
          featured: $featured
          price: $price
        ){
          id
          name
        }
      }  
  `;

  const GET_CATSNSUBCATS = `
  query {
  getCatsNSubcats{
    label
    subcategories
  }
}
  `;

  useEffect(() => {
    graphqlClient
      .query(GET_CATSNSUBCATS)
      .toPromise()
      .then(({ data, error }) => {
        if (data && !error) {
          setCatsNSubCats(data?.getCatsNSubcats);
          setCatList(data?.getCatsNSubcats?.map((obj) => obj.label));
        }
      });
  }, []);

  const [_, uploadProduct] = useMutation(UPLOAD_PRODUCT);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let base64;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64 = reader.result;
        resolve(base64);
      };
      reader.onerror = () => {
        reject(null);
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !category ||
      !subcategory ||
      !name ||
      !productImage ||
      !specsheetImage
    ) {
      showNotification({
        title: "Missing key fields",
        color: "orange",
        message:
          "Check category , sub-category , name , productImage or specsheet if empty",
      });
      return;
    }
    setLoading(true);

    let productBase64 = await getBase64(productImage);
    let specsheetBase64 = await getBase64(specsheetImage);

    uploadProduct({
      category,
      subCategory: subcategory,
      name,
      image: productBase64,
      specSheet: specsheetBase64,
      description,
      featured,
    })
      .then(({ error, data }) => {
        console.log(error, data);
        if (!error && data) {
          showNotification({
            message: "Product is now viewable on the website",
            color: "green",
            title: "Product uploaded successfully!",
          });
          return;
        }
        showNotification({
          message: "Error adding the product to the database",
          color: "red",
          title: "Product upload failed!",
        });
      })
      .catch((err) => {
        showNotification({
          message: "Error adding the product to the database",
          color: "red",
          title: "Product upload failed!",
        });
      })
      .finally(() => {
        setCategory("");
        setSubcategory("");
        setName("");
        setProductImage("");
        setSpecsheetImage("");
        setDescription("");
        setLoading(false);
      });
  };

  const bullet = "\u2022";
  const bulletWithSpace = `${bullet} `;
  const enter = 13;
  const handleInput = (event) => {
    const { keyCode, target } = event;
    const { selectionStart, value } = target;

    if (keyCode === enter) {
      console.log("a");
      target.value = [...value]
        .map((c, i) => (i === selectionStart - 1 ? `\n${bulletWithSpace}` : c))
        .join("");
      console.log(target.value);

      target.selectionStart = selectionStart + bulletWithSpace.length;
      target.selectionEnd = selectionStart + bulletWithSpace.length;
    }

    if (value[0] !== bullet) {
      target.value = `${bulletWithSpace}${value}`;
    }
  };

  function getSubcategoriesByCategory(output, category) {
    const categoryObj = output?.find((obj) => obj?.label === category);
    return categoryObj ? categoryObj?.subcategories : [];
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8">
      <div>
        <Select
          label="Category"
          data={catList}
          placeholder="Select a category"
          nothingFound="Nothing found"
          searchable
          creatable
          value={category}
          onChange={(val) => {
            setCategory(val);
            setSubCatList(() => getSubcategoriesByCategory(catsNsubCats, val));
          }}
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            setCategory(query);
            setCatList((current) => [...current, query]);
            return;
          }}
        />
      </div>

      <div>
        <Select
          label="Sub Category"
          data={subcatList}
          placeholder="Select a sub-category"
          nothingFound="Nothing found"
          searchable
          creatable
          value={subcategory}
          onChange={setSubcategory}
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            setSubcategory(query);
            setSubCatList((current) => [...current, query]);
            return;
          }}
        />
      </div>

      <div>
        <TextInput
          label="Name"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <NumberInput
          placeholder="Price"
          label="Product price (Ksh.)"
          value={price}
          onChange={setPrice}
        />
      </div>

      <div>
        <label className="text-[0.9rem]">
          Product image <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          ref={productFileInput}
          className="hidden"
          onChange={(e) => setProductImage(e.target.files[0])}
        />
        <button
          className="bg-green-600 text-white p-2 flex space-x-1 mt-4"
          onClick={() => productFileInput.current.click()}
        >
          <IconUpload />
          <span className="mt-[4px]">Upload</span>
        </button>

        {productImage && (
          <div className="p-8 relative w-[90%]">
            <img
              src={URL.createObjectURL(productImage)}
              alt="product"
              className="aspect-auto"
            />
            <button
              onClick={() => setProductImage("")}
              className="absolute top-0 right-0 h-[40px] w-[40px] bg-red-800 rounded-full text-white m-0 p-0"
            >
              <IconX className="mx-auto" />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="text-[0.9rem]">
          Specification sheet <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          ref={specsFileInput}
          className="hidden"
          onChange={(e) => setSpecsheetImage(e.target.files[0])}
        />
        <button
          className="bg-green-600 text-white p-2 flex space-x-1 mt-4"
          onClick={() => specsFileInput.current.click()}
        >
          <IconUpload />
          <span className="mt-[4px]">Upload</span>
        </button>

        {specsheetImage && (
          <div className="p-8 relative w-[90%]">
            <img
              src={URL.createObjectURL(specsheetImage)}
              alt="specsheet"
              className="aspect-auto"
            />
            <button
              onClick={() => setSpecsheetImage("")}
              className="absolute top-0 right-0 h-[40px] w-[40px] bg-red-800 rounded-full text-white m-0 p-0"
            >
              <IconX className="mx-auto" />
            </button>
          </div>
        )}
      </div>

      <div>
        <Textarea
          label="Description"
          placeholder="Enter product description"
          value={description}
          onKeyUp={handleInput}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          required
          minRows={10}
        />
      </div>

      <div>
        <Checkbox
          onChange={(e) => setFeatured(e.target.checked)}
          value={featured}
          label="Featured product"
        />
      </div>

      <Button type="submit" loading={loading}>
        Add Product
      </Button>
    </form>
  );
};

const ViewProducts = ({ loggedIn }) => {
  const GET_PRODUCTS = `
     query GET_PRODUCTS{
      getProducts{
        id
        name
        category
        subCategory
        image
        specSheet
        description
        removed
        featured
        price
      }
    }
  `;
  const [keyword, setKeyword] = useState("");
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: GET_PRODUCTS,
    requestPolicy: "cache-and-network",
  });

  if (fetching) return <p>Loading ....</p>;
  if (error) return <p>Error ..</p>;
  return (
    <>
      <Input
        placeholder="Search product name , category or sub-category"
        rightSection={<IconSearch />}
        value={keyword}
        style={{ margin: 8 }}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className="grid gap-8 grid-cols-5 p-6">
        {data?.getProducts
          .filter((product) => {
            if (
              product?.name.toLowerCase().includes(keyword.toLowerCase()) ||
              product?.category.toLowerCase().includes(keyword.toLowerCase()) ||
              product?.subCategory.toLowerCase().includes(keyword.toLowerCase())
            ) {
              return product;
            } else if (!keyword) {
              return product;
            }
          })
          .map((product, i) => (
            <Product
              loggedIn={loggedIn}
              data={product}
              key={i}
              refresh={reexecuteQuery}
            />
          ))}
      </div>
    </>
  );
};

const Product = ({ data, refresh, loggedIn }) => {
  const graphqlClient = useClient();
  const router = useRouter();

  const productFileInput = useRef();
  const specsFileInput = useRef();
  const [catsNsubCats, setCatsNSubCats] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setOpenEditModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [catList, setCatList] = useState([]);
  const [subcatList, setSubCatList] = useState([]);
  const [product, setProduct] = useState({
    name: data?.name,
    category: data?.category,
    subCategory: data?.subCategory,
    image: null,
    specSheet: null,
    description: data?.description,
    price: data?.price,
    featured: data?.featured,
  });
  const [loading, setLoading] = useState(false);

  const GET_CATSNSUBCATS = `
  query {
  getCatsNSubcats{
    label
    subcategories
  }
}
  `;

  function getSubcategoriesByCategory(output, category) {
    const categoryObj = output?.find((obj) => obj?.label === category);
    return categoryObj ? categoryObj?.subcategories : [];
  }

  useEffect(() => {
    graphqlClient
      .query(GET_CATSNSUBCATS)
      .toPromise()
      .then(({ data: _data, error }) => {
        if (data && !error) {
          setCatsNSubCats(_data?.getCatsNSubcats);
          setCatList(_data?.getCatsNSubcats?.map((obj) => obj.label));
          setSubCatList(() =>
            getSubcategoriesByCategory(_data?.getCatsNSubcats, data?.category)
          );
        }
      });
  }, []);

  const UPDATE_PRODUCT = `
    mutation UPDATE_PRODUCT(
        $id: ID!
        $removed: Boolean
        $name: String
        $category: String
        $subCategory: String
        $description: String
        $image: String
        $specSheet: String
        $featured: Boolean
        $price: Int
    ){
      updateProduct(
        id: $id
        removed: $removed
        name : $name
        category: $category
        subCategory: $subCategory
        description : $description
        image: $image
        specSheet: $specSheet
        featured: $featured
        price: $price
      ){
        id
        removed
        name 
        category
        subCategory
        description 
      }
    }
  `;

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let base64;
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        base64 = reader.result;
        resolve(base64);
      };
      reader.onerror = () => {
        reject(null);
      };
    });
  };

  const [_, _updateProduct] = useMutation(UPDATE_PRODUCT);

  const handleDelete = () => {
    if (loggedIn?.canModifyProducts) {
      _updateProduct({
        id: data?.id,
        removed: true,
      })
        .then(({ data, error }) => {
          if (data && !error) {
            showNotification({
              message: "Product deleted successfully",
              color: "green",
              title: "Success!",
            });
            return;
          } else {
            showNotification({
              message: "Connection error",
              color: "red",
              title: "Failed to delete product",
            });
          }
        })
        .catch((err) => {
          showNotification({
            message: "Connection error",
            color: "red",
            title: "Failed to delete product",
          });
        })
        .finally(() => {
          refresh();
          setModalOpen(false);
        });
    } else {
      showNotification({
        title: "Unauthorised",
        message: "You are unauthorised to perform this action!",
        color: "red",
      });
      return;
    }
    setConfirmText("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (loggedIn?.canModifyProducts) {
      let productBase64 = product?.image
        ? await getBase64(product?.image)
        : null;
      let specsheetBase64 = product?.image
        ? await getBase64(product?.specSheet)
        : null;

      let update;

      if (productBase64 && !specsheetBase64) {
        update = {
          id: data?.id,
          name: product?.name,
          category: product?.category,
          subCategory: product?.subCategory,
          description: product?.description,
          image: productBase64,
          featured: product?.featured,
          price: product?.price,
        };
      } else if (!productBase64 && specsheetBase64) {
        update = {
          id: data?.id,
          name: product?.name,
          category: product?.category,
          subCategory: product?.subCategory,
          description: product?.description,
          specSheet: specsheetBase64,
          featured: product?.featured,
          price: product?.price,
        };
      } else if (productBase64 && specsheetBase64) {
        update = {
          id: data?.id,
          name: product?.name,
          category: product?.category,
          subCategory: product?.subCategory,
          description: product?.description,
          image: productBase64,
          specSheet: specsheetBase64,
          featured: product?.featured,
          price: product?.price,
        };
      } else {
        update = {
          id: data?.id,
          name: product?.name,
          category: product?.category,
          subCategory: product?.subCategory,
          description: product?.description,
          featured: product?.featured,
          price: product?.price,
        };
      }

      _updateProduct(update)
        .then(({ data, error }) => {
          if (data && !error) {
            showNotification({
              message: "Product updated successfully",
              color: "green",
              title: "Success!",
            });
            setLoading(false);
            return;
          } else {
            showNotification({
              message: "Connection error",
              color: "red",
              title: "Failed to update product",
            });
            setLoading(false);
          }
        })
        .catch((err) => {
          showNotification({
            message: "Connection error",
            color: "red",
            title: "Failed to delete product",
          });
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
          refresh();
          setOpenEditModal(false);
        });
    } else {
      showNotification({
        title: "Unauthorised",
        message: "You are unauthorised to perform this action!",
        color: "red",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {data?.featured && (
        <Badge
          style={{ position: "absolute", top: 0, right: 0, zIndex: 99 }}
          size="sm"
        >
          Featured
        </Badge>
      )}
      <Card
        w={"100%"}
        className="hover:scale-110 hover:text-blue-600 hover:cursor-pointer"
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        onClick={() => setModalOpen(true)}
      >
        <Card.Section>
          <img
            src={`${data?.image}`}
            height="100%"
            width="100%"
            alt={data?.name}
          />
        </Card.Section>
        <Text weight={500}>{data?.name}</Text>
      </Card>

      <Modal
        size="80%"
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<h2 className="text-[1.5rem]">{data?.name}</h2>}
        centered
      >
        {/* Modal content */}
        <div className="flex space-x-12 mt-12">
          <div className="w-1/3">
            <img src={data?.image} alt={data?.name} className="w-full" />
          </div>
          <div className="w-2/3">
            <Breadcrumbs className="text-red-700">
              {[
                new String(data?.category).toUpperCase(),
                new String(data?.subCategory).toUpperCase(),
              ]}
            </Breadcrumbs>
            <Space h={20} />
            <h3 className="text-[1.5rem] mb-2">Features</h3>
            <Text c="dimmed" fz="sm" fw="lighter">
              {data?.description}
            </Text>
            <h3 className="text-[1.5rem] mb-2 mt-6">
              Technical Specifications
            </h3>
            <img src={data?.specSheet} alt={data?.name} className="w-full" />
            {data?.price && (
              <h1 className="text-red-700">
                Ksh.{" "}
                {data?.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h1>
            )}

            <Space h={40} />
            <div className="flex flex-row-reverse space-x-4">
              <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                  <Button color="red" ml={12}>
                    Delete
                  </Button>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <div className="space-y-2">
                    <Text c="dimmed" fw="lighter">
                      To confirm deletion, type <Kbd>serenepsl</Kbd>
                    </Text>
                    <Input
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      variant="filled"
                      className="w-full"
                    />
                    {confirmText == "serenepsl" && (
                      <Button fullWidth color="green" onClick={handleDelete}>
                        Confirm deletion
                      </Button>
                    )}
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
              <Button
                color="red"
                variant="outline"
                ml={12}
                onClick={() => setOpenEditModal(true)}
              >
                Edit
              </Button>
            </div>

            <Modal
              size="80%"
              opened={editModal}
              onClose={() => setOpenEditModal(false)}
              title={<h2 className="text-[1.5rem]">{data?.name}</h2>}
              centered
            >
              <form onSubmit={handleUpdate} className="space-y-4 p-8">
                <div>
                  <Select
                    label="Category"
                    data={catList}
                    placeholder="Select a category"
                    nothingFound="Nothing found"
                    searchable
                    creatable
                    value={product.category}
                    onChange={(val) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          category: val,
                        };
                      });
                      setSubCatList(() =>
                        getSubcategoriesByCategory(catsNsubCats, val)
                      );
                    }}
                    getCreateLabel={(query) => `+ Create ${query}`}
                    onCreate={(query) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          category: val,
                        };
                      });
                      setCatList((current) => [...current, query]);
                      return;
                    }}
                  />
                </div>

                <div>
                  <Select
                    label="Sub Category"
                    data={subcatList}
                    placeholder="Select a sub-category"
                    nothingFound="Nothing found"
                    searchable
                    creatable
                    value={product.subCategory}
                    onChange={(val) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          subCategory: val,
                        };
                      });
                    }}
                    getCreateLabel={(query) => `+ Create ${query}`}
                    onCreate={(query) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          subCategory: val,
                        };
                      });
                      setSubCatList((current) => [...current, query]);
                      return;
                    }}
                  />
                </div>

                <div>
                  <TextInput
                    label="New name"
                    placeholder="New product name"
                    value={product.name}
                    onChange={(e) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          name: e.target.value,
                        };
                      });
                    }}
                    required
                  />
                </div>

                <div>
                  <NumberInput
                    thousandsSeparator=","
                    placeholder="Price"
                    label="Product price (Ksh.)"
                    value={product.price}
                    onChange={(val) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          price: val,
                        };
                      });
                    }}
                  />
                </div>

                <div>
                  <label className="text-[0.9rem]">
                    Product image <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    ref={productFileInput}
                    className="hidden"
                    onChange={(e) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          image: e.target.files[0],
                        };
                      });
                    }}
                  />
                  <button
                    className="bg-green-600 text-white p-2 flex space-x-1 mt-4"
                    onClick={() => productFileInput.current.click()}
                  >
                    <IconUpload />
                    <span className="mt-[4px]">Upload</span>
                  </button>

                  {product?.image && (
                    <div className="p-8 relative w-[90%]">
                      <img
                        src={URL.createObjectURL(product?.image)}
                        alt="product"
                        className="aspect-auto"
                      />
                      <button
                        onClick={() => {
                          setProduct((product) => {
                            return {
                              ...product,
                              image: "",
                            };
                          });
                        }}
                        className="absolute top-0 right-0 h-[40px] w-[40px] bg-red-800 rounded-full text-white m-0 p-0"
                      >
                        <IconX className="mx-auto" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[0.9rem]">
                    Specification sheet <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    ref={specsFileInput}
                    className="hidden"
                    onChange={(e) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          specSheet: e.target.files[0],
                        };
                      });
                    }}
                  />
                  <button
                    className="bg-green-600 text-white p-2 flex space-x-1 mt-4"
                    onClick={() => specsFileInput.current.click()}
                  >
                    <IconUpload />
                    <span className="mt-[4px]">Upload</span>
                  </button>

                  {product?.specSheet && (
                    <div className="p-8 relative w-[90%]">
                      <img
                        src={URL.createObjectURL(product?.specSheet)}
                        alt="specsheet"
                        className="aspect-auto"
                      />
                      <button
                        onClick={() => {
                          setProduct((product) => {
                            return {
                              ...product,
                              specSheet: "",
                            };
                          });
                        }}
                        className="absolute top-0 right-0 h-[40px] w-[40px] bg-red-800 rounded-full text-white m-0 p-0"
                      >
                        <IconX className="mx-auto" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <Textarea
                    label="Description"
                    placeholder="Enter product description"
                    value={product?.description}
                    onChange={(e) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          description: e.target.val,
                        };
                      });
                    }}
                    required
                    minRows={10}
                  />
                </div>

                <div>
                  <Checkbox
                    checked={product?.featured}
                    onChange={(e) => {
                      setProduct((product) => {
                        return {
                          ...product,
                          featured: e.target.checked,
                        };
                      });
                    }}
                    value={product?.featured}
                    label="Featured product"
                  />
                </div>

                <Button type="submit" loading={loading}>
                  Update product
                </Button>
              </form>
            </Modal>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const CI = ({ loggedIn }) => {
  const router = useRouter();
  const graphqlClient = useClient();

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

  const [footer, setFooter] = useState({
    callUs: "",
    officeAddress: "",
    workingTime: "",
    aboutUs: "",
    facebookURL: "",
    linkedInURL: "",
    youtubeURL: "",
    mailingURL: "",
  });
  const [loading, setLoading] = useState(false);

  const UPDATE_SECTION = `
    mutation UPDATE_SECTION(
      $identifier: String
      $value: String
    ){
      updateSection(
        identifier: $identifier
        value: $value
      ){
        value
        identifier   
      }
    }
  `;

  useEffect(() => {
    graphqlClient
      .query(GET_SECTIONS)
      .toPromise()
      .then(({ data, error }) => {
        setFooter({
          callUs: data?.getSections.filter(
            (section) => section?.identifier == "callUs"
          )[0].value,
          officeAddress: data?.getSections.filter(
            (section) => section?.identifier == "officeAddress"
          )[0].value,
          workingTime: data?.getSections.filter(
            (section) => section?.identifier == "workingTime"
          )[0].value,
          aboutUs: data?.getSections.filter(
            (section) => section?.identifier == "aboutUs"
          )[0].value,
          facebookURL: data?.getSections.filter(
            (section) => section?.identifier == "facebookURL"
          )[0].value,
          linkedInURL: data?.getSections.filter(
            (section) => section?.identifier == "linkedInURL"
          )[0].value,
          youtubeURL: data?.getSections.filter(
            (section) => section?.identifier == "youtubeURL"
          )[0].value,
          mailingURL: data?.getSections.filter(
            (section) => section?.identifier == "mailingURL"
          )[0].value,
        });
      });
  }, []);

  const [updateResults, _updateSection] = useMutation(UPDATE_SECTION);

  const handleUpdate = () => {
    setLoading(true);
    let docParams = [];

    for (const key in footer) {
      docParams.push({
        value: footer[key],
        identifier: key,
      });
    }

    for (let section of docParams) {
      _updateSection(section)
        .then(({ data, error }) => {
          if (data && !error) {
            setLoading(false);
          } else {
            console.log(data, error);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-8">
      <Text>Use this form to change contact details</Text>

      <div className="flex justify-between max-h-[70vh] overflow-y-auto  mt-8 ">
        <div className="space-y-3 w-[40%]">
          <TextInput
            label="Call Us number"
            value={footer?.callUs}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  callUs: e.target.value,
                };
              });
            }}
          />
          <TextInput
            label="Office address"
            value={footer?.officeAddress}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  officeAddress: e.target.value,
                };
              });
            }}
          />
          <TextInput
            label="Working time"
            value={footer?.workingTime}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  workingTime: e.target.value,
                };
              });
            }}
          />
          <Textarea
            minRows={4}
            label="About Us"
            value={footer?.aboutUs}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  aboutUs: e.target.value,
                };
              });
            }}
          />
        </div>
        <div className="w-[40%] space-y-3">
          <TextInput
            label="Facebook URL"
            value={footer?.facebookURL}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  facebookURL: e.target.value,
                };
              });
            }}
          />
          <TextInput
            label="LinkedIn URL"
            value={footer?.linkedInURL}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  linkedInURL: e.target.value,
                };
              });
            }}
          />
          <TextInput
            label="Youtube URL"
            value={footer?.youtubeURL}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  youtubeURL: e.target.value,
                };
              });
            }}
          />
          <TextInput
            label="Mailing email"
            value={footer?.mailingURL}
            onChange={(e) => {
              setFooter((_footer) => {
                return {
                  ..._footer,
                  mailingURL: e.target.value,
                };
              });
            }}
          />
          <Button
            loading={loading}
            onClick={handleUpdate}
            color="red"
            fullWidth
            mt={8}
          >
            Update information
          </Button>
        </div>
      </div>
    </div>
  );
};
