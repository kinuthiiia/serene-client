import { Button, Divider, Input, PasswordInput, Space } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconMail, IconPassword } from "@tabler/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "urql";

export default function Login() {
  const [trainee, setTrainee] = useState({
    email: "",
    password: "",
    fullName: "",
    isSignUp: false,
    rPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const GET_TRAINEES = `
    query GET_TRAINEES{
      getTrainees{
        id
        email
        fullName
        password
      }
    }
`;

  const [{ data, fetching, error }] = useQuery({
    query: GET_TRAINEES,
  });

  const ADD_TRAINEE = `
        mutation ADD_TRAINEE(
            $fullName: String
            $email: String
            $password: String
        ){
            addTrainee(
                email: $email
                fullName: $fullName
                password: $password
            ){
                id
                email
                fullName
                password
            }
        }
    `;

  const [_, _addTrainee] = useMutation(ADD_TRAINEE);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, password, isSignUp } = trainee;
    setLoading(true);
    if (isSignUp) {
      _addTrainee({
        fullName,
        email,
        password,
      })
        .then(({ data, error }) => {
          console.log(data, error);
          if (data && !error) {
            if (typeof window !== "undefined" && window.localStorage) {
              localStorage.setItem("s_userId", data?.addTrainee?.id);
              showNotification({
                message: "Account successfully created",
                title: "Success!",
                color: "green",
              });
              router.push("/training/courses");
              return;
            }
          }
          showNotification({
            message: "Failed to create account",
            title: "Error!",
            color: "red",
          });
        })
        .catch((err) => {
          showNotification({
            message: "Failed to create account",
            title: "Error!",
            color: "red",
          });
        })
        .finally(() => {
          setLoading(false);
          setTrainee({
            email: "",
            password: "",
            fullName: "",
            isSignUp: false,
            rPassword: "",
          });
        });
    } else {
      data?.getTrainees.filter((trainee) => {
        if (trainee?.email == email && trainee?.password == password) {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("s_userId", trainee?.id);
            showNotification({
              message: `Welcome back ${trainee?.fullName.split(" ")[0]}`,
              title: "Success!",
              color: "green",
            });
            setLoading(false);
            router.push("/training/courses");
            return;
          }
          return;
        } else if (trainee?.email == email && trainee?.password !== password) {
          showNotification({
            message: "Incorrect password entered",
            title: "Error!",
            color: "red",
          });
          setLoading(false);
          return;
        }
      });
    }
  };

  return (
    <div className="bg-red-600 w-full h-screen relative">
      <form
        onSubmit={handleSubmit}
        className="p-8 w-2/5 space-y-4 bg-white mx-auto absolute top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]"
      >
        <h2 className="uppercase w-full text-[2.5rem] text-center">
          {!trainee.isSignUp ? "login" : "sign up"}
        </h2>
        {trainee?.isSignUp && (
          <Input
            variant="filled"
            placeholder="Full name"
            value={trainee?.fullName}
            onChange={(e) =>
              setTrainee((trainee) => {
                return { ...trainee, fullName: e.target.value };
              })
            }
            required
          />
        )}
        <Input
          variant="filled"
          placeholder="Email"
          rightSection={<IconMail color="#808080" size={16} />}
          value={trainee?.email}
          onChange={(e) =>
            setTrainee((trainee) => {
              return { ...trainee, email: e.target.value };
            })
          }
          required
        />
        <PasswordInput
          variant="filled"
          placeholder="Password"
          value={trainee?.password}
          onChange={(e) =>
            setTrainee((trainee) => {
              return { ...trainee, password: e.target.value };
            })
          }
          required
        />
        {trainee?.isSignUp && (
          <PasswordInput
            variant="filled"
            placeholder="Repeat password"
            value={trainee?.rPassword}
            required
            error={
              trainee.rPassword !== trainee.password
                ? "Passwords must match"
                : null
            }
            onChange={(e) =>
              setTrainee((trainee) => {
                return { ...trainee, rPassword: e.target.value };
              })
            }
          />
        )}

        {trainee?.isSignUp ? (
          <Divider
            my="xs"
            label={
              <p>
                Already have an account{" "}
                <span
                  onClick={() =>
                    setTrainee((trainee) => {
                      return { ...trainee, isSignUp: false };
                    })
                  }
                  className="cursor-pointer hover:underline text-blue-700"
                >
                  login
                </span>
              </p>
            }
            labelPosition="center"
          />
        ) : (
          <Divider
            my="xs"
            label={
              <p>
                New member?{" "}
                <span
                  onClick={() =>
                    setTrainee((trainee) => {
                      return { ...trainee, isSignUp: true };
                    })
                  }
                  className="cursor-pointer hover:underline text-blue-700"
                >
                  sign up
                </span>
              </p>
            }
            labelPosition="center"
          />
        )}

        <Space h={24} />
        {!trainee?.isSignUp && (
          <a className="cursor-pointer text-blue-600 text-[0.8rem]">
            Forgot password
          </a>
        )}

        <Button
          loading={loading}
          uppercase
          fullWidth
          type="submit"
          color="dark"
        >
          {trainee?.isSignUp ? "sign up" : "login"}
        </Button>
        <Button
          variant="subtle"
          fz="xs"
          color="red"
          fullWidth
          onClick={() => router.push("/")}
        >
          Back to site
        </Button>
      </form>
    </div>
  );
}
