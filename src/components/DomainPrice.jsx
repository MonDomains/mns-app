import monRegisterControllerABI from '../abi/MONRegisterController.json'
import loadericon from '../assets/images/loader-icon.svg';
import { useReadContract } from 'wagmi'
import { toast } from 'react-toastify'; 
import { fromWei } from '../helpers/String';
import { getChainId } from '@wagmi/core';
import { rainbowConfig } from '../config';

function DomainPrice({available, name, duration}) { 
 
    const monRegisterControllerConfig = {
        address: import.meta.env.VITE_APP_REGISTER_CONTROLLER,
        abi: monRegisterControllerABI
    };

    const { data: price, error, isPending } = useReadContract({
        ...monRegisterControllerConfig,
        functionName: 'rentPrice',
        args: [name, duration],
        chainId: getChainId(rainbowConfig)
    });
  
    if(error) toast.error("An error occured.")
    if(!available) return <></>

    if(isPending) {
        <span className='me-3'><img src={loadericon} alt="" /></span>
    } else {
        return ( 
            <> 
                <span className='me-3'>{ fromWei(  price.base.toString() ).toString() } {import.meta.env.VITE_APP_NATIVE_TOKEN} / Year</span>
            </>
         );
    }
}

export default DomainPrice;