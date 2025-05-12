import CopyText from "./CopyText"; 

function ParentBox(props) { 
    return (  
        <CopyText className="btn btn-default bg-body-tertiary border border-light-subtle border rounded-3 d-flex align-items-center justify-content-between gap-2" 
            text={"mon"}>
            <span className="fw-bold">parent</span>
            { "mon" }
        </CopyText>  
    );
}

export default ParentBox;
