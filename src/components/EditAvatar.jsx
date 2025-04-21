

import { useState } from "react";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
const pinataApiKey = "065a151ca15825e68c6d";
const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmNGEyZTQ1ZC03ZGQzLTRlMGQtOWI2Zi1mZjcxMDg0N2Y0YzMiLCJlbWFpbCI6InJhbWF6YW4uZG5tekBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDY1YTE1MWNhMTU4MjVlNjhjNmQiLCJzY29wZWRLZXlTZWNyZXQiOiI1YmJjMTQ1YjgwY2I2ZGUzM2ZlNGI2Y2E2MDU2OGQ1OTgxM2U0MjllMGExNDZhZDgzZGI4NTcyNjMwYjRiZjE2IiwiZXhwIjoxNzc2NTA3MTE2fQ.Meql7okeqQs-j8A-gVHGUDPrmDpl3SSJ2OIE_9ebYLk"
const client = create("http://localhost:5001/api/v0", {});
window.Buffer = window.Buffer || Buffer;

function EditAvatar() { 

    const [file, setFile] = useState(null);
    const [urlArr, setUrlArr] = useState([]);

    const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
        setFile(window.Buffer(reader.result));
    };

    e.preventDefault();
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const cid = await client.add(file);
        console.log(cid);
        const url = `https://ipfs.infura.io/ipfs/${cid.path}`;
        setUrlArr((prev) => [...prev, url]);
    } catch (error) {
        console.log(error.message);
    }
    };

    return ( 
        <>  
            <div className="main">
                <form onSubmit={handleSubmit}>
                <input type="file" onChange={retrieveFile} />
                <button type="submit" className="button">Submit</button>
                </form>
            </div>

            <div className="display">
                {urlArr.length !== 0
                ? urlArr.map((el) => <span>{el}</span>)
                : <h3>Upload data</h3>}
            </div> 
        </>
     );
}

export default EditAvatar;