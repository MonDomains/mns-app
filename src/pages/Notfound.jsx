import { Link, NavLink } from 'react-router-dom';

const NotFound = () => {
    return (
        <> 
        <div className='d-flex flex-column justify-content-center align-items-center '>
            <h2 className='display-2'>404</h2>
            <p>The page you were looking for does not exists.</p>
            <NavLink to="/">
                <button className='btn btn-light bg-light-subtle'>Go Back to Homepage</button>
            </NavLink>
        </div>
      </>
    );
};
  
export default NotFound;