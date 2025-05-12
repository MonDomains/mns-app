import { ethers } from 'ethers'; 
import moment from 'moment';
import { validate } from "@ensdomains/ens-validation"

export const obscureAddress = (address) => {
    return address?.substring(0, 5) + '...' + address?.substring(address?.length - 5, address?.length);
}

export const obscureName = (name, len) => {
    if(getLength(name) > len) {
        return Array.from(name).slice(0, len / 2).join("") + "..." + Array.from(name).slice(name.length - (len / 2), name.length).join("");
    } else {
        return name;
    }
}

export const getLength = (label) => { 
    return Array.from(label).length;
}
 
export function getTimeAgo(timestamp) {
    if(timestamp === null) return "-";
    return  moment.unix(timestamp).fromNow()
}

export function getExpires(expires, suffix = false) {
    if(expires === null) return "-";
   
    return moment.unix(expires).add(GRACE_PERIOD, "days").fromNow(suffix);
}
  
export function isExpired(expires) { 
    return moment.unix(expires).utc().diff(moment().utc(), "seconds") <= -( (GRACE_PERIOD + PREMIUM_PERIOD) * 24 * 60 * 60)  ;
}

export function isExpiring(expires) {  
    return moment.unix(expires).utc().diff(moment().utc(), "seconds") <= 0 && moment.unix(expires).diff(moment(), "seconds") >= -(GRACE_PERIOD * 24 * 60 * 60);
}

export function isPremium(expires) { 
    return moment.unix(expires).utc().diff(moment(), "seconds") <= -(GRACE_PERIOD * 24 * 60 * 60) && moment.unix(expires).diff(moment(), "seconds") >= -((GRACE_PERIOD + PREMIUM_PERIOD) * 24 * 60 * 60)  ;
}

export function isAvailable(expires) {
    return expires === null || isExpired(expires) || isPremium(expires);
}
  
export function isValidDomain(name) {
    try {
      return isValidName(name) === true && name.indexOf(".") === -1;
    } catch {
      return false;
    }
}

export function isValidName(name) {
    try {
      return validate(name) === true && name === ethers.ensNormalize(name);
    } catch {
      return false;
    }
}
   
 
 