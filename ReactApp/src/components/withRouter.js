import { useNavigate, useParams, useLocation } from 'react-router-dom';

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    
    return (
      <Component
        navigate={navigate}
        {...props}
        router={{ location, navigate, params }}
      />
    );
  };
  
  return Wrapper;
};