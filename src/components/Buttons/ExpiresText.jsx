import moment from "moment";
import { gracePeriod } from "../../config";
 
function ExpiresText(props) { 
    
    function IsExpiring(expires) {
        return moment.unix(expires).utc().diff(moment().utc(), "seconds") <= 0 && moment.unix(expires).diff(moment(), "seconds") >= -(gracePeriod * 24 * 60 * 60)
    }

    function IsExpired(expires) {
        return moment.unix(expires).utc().diff(moment().utc(), "seconds") <= -( (gracePeriod) * 24 * 60 * 60)  ;
    }

    function getExpires(expires) {
        if(expires === null) return "-"; 
        return moment.unix(expires).add(gracePeriod, "days").fromNow(false);
    }
    
    return ( 
        <>
        {IsExpiring(props.expires) ? <span className="text-warning" {...props}>Expiring Soon</span>: <></>}
        {IsExpired(props.expires) ? <span className="text-danger" {...props}>Expired</span>: <></>}
        {!IsExpiring(props.expires) && !IsExpired(props.expires) ? <small className="text-muted" {...props}>Expires {getExpires(props.expires)} </small>: <></>}
        </>
    );
}

export default ExpiresText;
