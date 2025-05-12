import monRegisterControllerABI from '../abi/MONRegisterController.json'
import { useReadContract } from 'wagmi'
import { toast } from 'react-toastify'; 
import { chainId, registrarController } from '../config';
import { Spinner } from 'react-bootstrap';

function DomainPrice({available, name, duration}) { 
 
    const monRegisterControllerConfig = {
        address: registrarController,
        abi: monRegisterControllerABI
    };

    const { data: price, error, isPending } = useReadContract({
        ...monRegisterControllerConfig,
        functionName: 'rentPrice',
        args: [name, duration],
        chainId: chainId
    });
  
    if(error) toast.error("An error occured.")
    if(!available) return <></>

    if(isPending) {
        <span className='me-3'>
            <Spinner variant='primary' size='sm' />
        </span>
    } else {
        return ( 
            <> 
                <span className='me-3'>{ ethers.formatUnits(  price.base.toString() ).toString() } {import.meta.env.VITE_APP_NATIVE_TOKEN} / Year</span>
            </>
         );
    }
}

export default DomainPrice;