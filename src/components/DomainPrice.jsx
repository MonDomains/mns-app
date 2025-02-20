import monRegisterControllerABI from '../abi/MONRegisterController.json'
import loadericon from '../assets/images/loader-icon.svg';
import { useReadContract } from 'wagmi'
import { toast } from 'react-toastify'; 
import { fromWei } from '../helpers/String';
import { monadTestnet } from 'wagmi/chains'

function DomainPrice({available, name, duration}) { 
 
    const monRegisterControllerConfig = {
        address: import.meta.env.VITE_APP_MONREGISTERCONTROLLER,
        abi: monRegisterControllerABI
    };

    const { data: price, error, isPending } = useReadContract({
        ...monRegisterControllerConfig,
        functionName: 'rentPrice',
        args: [name, duration],
        chainId: import.meta.env.VITE_APP_NODE_ENV === "production" ? monadTestnet.id: monadTestnet.id
    });
  
    if(error) toast.error(error.message)
    if(!available) return <></>

    if(isPending) {
        <span className='me-3'><img src={loadericon} alt="" /></span>
    } else {
        return ( 
            <> 
                <span className='me-3'>{ fromWei(  price.base.toString() ).toString() } {import.meta.env.VITE_APP_NATIVE_TOKEN} / YEAR</span>
            </>
         );
    }
}

export default DomainPrice;