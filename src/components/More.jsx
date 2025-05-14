import ResolverBox from "../components/Buttons/ResolverBox";
import { metaApiUrl } from "../config";
import CopyUrl from "./Buttons/CopyUrl";
import ShareButton from "./Buttons/ShareButton";
import MnsCard from "./Misc/MnsCard";

function More(props) { 
    return ( 
        <div className="d-flex flex-column gap-3">
            <div className='d-flex flex-column gap-3'> 
                <div className='bg-light-subtle border border-light-subtle rounded-4'>
                    <div className='d-flex flex-row p-4 justify-content-between border-bottom'>
                        <h5 className='fw-bold'>MNS Card</h5>
                    </div>
                    <div className='d-flex flex-column flex-md-row p-3 gap-3 align-items-center'>
                        <MnsCard  {...props} />
                        <div className="d-flex flex-column gap-3 flex-fill">
                            <ShareButton {...props} />
                            <CopyUrl url={`${metaApiUrl}/card/${props.name}`}  {...props}>
                                Copy MNS Card URL
                            </CopyUrl>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column gap-3'> 
                <div className='bg-light-subtle border border-light-subtle rounded-4'>
                    <div className='d-flex flex-row p-4 justify-content-between border-bottom'>
                        <h5 className='fw-bold'>Resolver</h5>
                    </div>
                    <div className='d-flex flex-column flex-md-row p-3 gap-3'>
                        <ResolverBox {...props} />
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default More;
