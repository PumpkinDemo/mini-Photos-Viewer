import React from "react";
import { PhotoProvider, PhotoConsumer } from "react-photo-view";
import 'react-photo-view/dist/index.css';
// import Pagination from '@mui/material/Pagination';
import {Pagination} from 'antd'
import 'antd/dist/antd.min.css';

import "./SetuViewer.css";

// import ImageContainer from "./ImageContainer";

class Viewer extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let photoImages = this.props.images;
        let pageSize = this.props.pageSize;
        let pageStart = this.props.pageStart;
        let pageEnd = pageStart + pageSize;

        // console.log(photoImages);
        return (
            <PhotoProvider>
            <div style={{display: "flex", }}>
                {photoImages.map((item, index) => (
                    <PhotoConsumer key={index} src={item} intro={item}>
                        {pageStart <= index && index < pageEnd && <div style={{
                            margin: "20px 20px 20px 20px",
                            width: "200px",
                            height: "400px",
                            cursor: "pointer",
                            background: `url(${item}) no-repeat center`,
                            backgroundSize: "cover",
                        }}/>}
                    </PhotoConsumer>
                ))}
            </div>
            </PhotoProvider>
        );
    }
}

class SetuViewer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pageStart: 0,
            pageSize: 5,
            images: []
        }
    }

    get_images(){
        fetch('http://sese.pumpk1n.com/setu/?action=list')
        .then(res => res.text())
        .then(res => JSON.parse(res))
        .then(res => res.map(e => 'http://sese.pumpk1n.com/setu/setus/' + e))
        .then(res => {
            this.setState({
                images: res
            })
            // console.log(res);
        })
    }

    pageChangeHandler = (pageNum) => {
        console.log(pageNum);
        this.setState({
            pageStart: pageNum - 1
        })
    }

    componentDidMount(){
        this.get_images();
    }

    render(){
        let pageStart = this.state.pageStart;
        let images = this.state.images
        let imageCnt = images.length;
        return (<div className="setu-viewer">
            <div className="viewer">
                <Viewer pageSize={5} pageStart={pageStart} images={images} />
            </div>
            <div className="pagination">
                <Pagination showSizeChanger={false}
                            showQuickJumper
                            defaultCurrent={1} 
                            total={imageCnt} 
                            pageSize={1} 
                            onChange={this.pageChangeHandler}/>
            </div>
        </div>)
    }
}

export default SetuViewer;