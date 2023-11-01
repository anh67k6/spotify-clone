import { Icon } from "@iconify/react";
import TextInput from "../components/shared/TextInput";
import PasswordInput from "../components/shared/PasswordInput";
const LoginComponent = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="logo p-5 border border-solid border-gray-300 w-full flex justify-center">
        <Icon icon="logos:spotify" width="150" />
      </div>
      <div className="inputRegion w-1/3 py-10 flex items-center justify-center flex-col">
        <div className="font-bold mb-12">To continue, log in to Spotify.</div>
        <TextInput
          label="Email address or username"
          placeholder="Email address or username"
        ></TextInput>
        <PasswordInput
          label="Password"
          placeholder="Password"
        ></PasswordInput>
      </div>
    </div>
  );
};

export default LoginComponent;
