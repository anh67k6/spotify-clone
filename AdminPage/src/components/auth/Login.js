// Login.js
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import TextInput from '../../shared/TextInput';
import PasswordInput from '../../shared/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { makeUnauthenticatedPOSTRequest } from '../../utils/serverHelpers';
import { useCookies } from 'react-cookie';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie] = useCookies(['token']);
  const navigate = useNavigate();

  const login = async () => {
    const data = { email, password };
    const response = await makeUnauthenticatedPOSTRequest('/auth/login', data);
    if (response && !response.err) {
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie('token', token, { path: '/', expires: date });
      alert('Success');
      navigate('/');
    } else {
      alert('Failure');
    }
  };

  useEffect(() => {
    if (cookies.token) {
      navigate('/');
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="logo p-5 border-b border-solid border-gray-900 w-full flex justify-center">
        <Icon icon="mdi:administrator-outline" width="100" />
      </div>
      <div className="inputRegion w-1/3 py-10 flex items-center justify-center flex-col">
        <div className="font-bold mb-4">Log in to manage the website</div>
        <TextInput
          label="Email address"
          placeholder="Email address"
          className="my-6"
          value={email}
          setValue={setEmail}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          value={password}
          setValue={setPassword}
        />
        <div className=" w-full flex items-center justify-end my-8">
          <button
            className="bg-red-400 font-semibold p-3 px-10 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              login();
            }}
          >
            LOG IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;




