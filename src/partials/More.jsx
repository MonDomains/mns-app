import ResolverBox from "../components/Buttons/ResolverBox";

function More(props) { 
    return ( 
        <div className='d-flex flex-column gap-3'> 
             <div className='bg-light-subtle border border-light-subtle rounded-4'>
                <div className='d-flex flex-row p-4 justify-content-between border-bottom'>
                    <h5 className='fw-bold'>Resolver</h5>
                </div>
                <div className='d-flex flex-column flex-lg-row p-3 gap-3'>
                    <ResolverBox {...props} />
                </div>
            </div>
        </div>
    );
}

export default More;
