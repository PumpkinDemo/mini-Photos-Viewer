import React from "react";

class ViewBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            url: props.src,
            onDone: props.onDone
        }
    }

    componentDidMount(){
        console.log(this.state.url);
        this.state.onDone();
    }

    render(){
        let url = this.state.url;
        return (<>
            {<div style={{
                margin: "25px",
                width: "200px",
                height: "200px",
                cursor: "pointer",
                background: `url(${url}) no-repeat center`,
                backgroundSize: "cover",
            }}/>}
        </>);
    }
}

export default ViewBox;