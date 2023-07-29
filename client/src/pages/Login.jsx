import { Form, Link, redirect, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/login", data);
    toast.success("Login successfull");
    return redirect("/dashboard");
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const handleTestUser = async () => {
    const data = {
      email: "test@gmail.com",
      password: "123456",
    };

    try {
      await customFetch.post("/auth/login", data);
      toast.success("test user logged in successfull");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn />
        <button
          type="button"
          className="btn btn-block"
          onClick={handleTestUser}
        >
          explore the app
        </button>
        <p>
          Not a member?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
