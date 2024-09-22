import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface IUseRequestProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  body?: any;
  params?: any;
  onSuccess?: (data: any) => void;
}

const useRequest = (props: IUseRequestProps) => {
  const {
    method,
    url,
    body,
    params,
    onSuccess
  } = props;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const makeRequest = async () => {
    setIsLoading(true);
    try {
      const payload: any = method === 'GET' ? {params} : {body};
      const response = await fetch(
          `http://localhost:8081${url}`, {
          method,
          ...payload,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
        const data = await response.json();

        setData(data);
        setErrorMessage(null);
        if (onSuccess) {
          onSuccess(data);
        }

      } else {
        const error = await response.json();

        if (response.status === 401) {
          navigate('/auth')
        }

        setErrorMessage(error.message ?? 'Ошибка');
        setData(null);

      }
    } catch (e) {
      setErrorMessage(JSON.stringify(e))
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    errorMessage,
    makeRequest,
  }
};

export {useRequest};
