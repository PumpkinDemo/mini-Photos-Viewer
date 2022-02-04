import React, { useEffect, useState } from "react";
import { PhotoProvider, PhotoConsumer, PhotoSlider } from "react-photo-view";
import 'react-photo-view/dist/index.css';
import {Pagination} from 'antd'
import 'antd/dist/antd.min.css';
import "./SetuViewer.css";
import ViewBox from "./ViewBox";
import LazyLoad from "react-lazyload";
// import MyPhotoProvider from "./MyPhotoProvider";

const arrayShuffle = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let j = ~~(i + Math.random() * (arr.length - i));
        [ arr[i], arr[j] ] = [ arr[j], arr[i] ];
    }
}

class Viewer extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        let photoImages = this.props.images.map(e => 'http://sese.pumpk1n.com/setu/image.php?img=' + e);
        let realImages = this.props.images.map(e => 'http://sese.pumpk1n.com/setu/setus/' + e);
        let pageSize = this.props.pageSize;
        let pageStart = this.props.pageStart;
        let pageEnd = pageStart + pageSize;

        // console.log(realImages);
        return (
            <PhotoProvider>
                <div style={{display: "flex", }}>
                    {photoImages.map((item, index) => (
                        <PhotoConsumer key={index} src={item} intro={item}>
                            {pageStart <= index && index < pageEnd && <ViewBox url={item}/>}
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
        fetch('//sese.pumpk1n.com/setu/?action=list')
        .then(res => res.text())
        .then(res => JSON.parse(res))
        // .then(res => res.map(e => 'http://sese.pumpk1n.com/setu/image.php?img=' + e))
        .then(res => {
            this.setState({
                images: res
            })
            // console.log(res);
        })
    }

    pageChangeHandler = (pageNum) => {
        // console.log(pageNum);
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


class SetuAlbum extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [],
            visible: false,
            sliderIndex: 0
        }
        this.closeHandler = this.closeHandler.bind(this);
        this.showHandler = this.showHandler.bind(this);
        this.setSliderIndex = this.setSliderIndex.bind(this);
    }

    get_images(){
        fetch('//sese.pumpk1n.com/setu/?action=list')
        .then(res => res.text())
        .then(res => JSON.parse(res))
        .then(res => {
            arrayShuffle(res);
            this.setState({
                images: res,
            })
        })
    }

    setVisible(visible){
        this.setState({
            visible: visible
        })
    }

    setSliderIndex(index){
        this.setState({
            sliderIndex: index
        })
    }

    componentDidMount(){
        this.get_images();
    }

    showHandler(index){
        // console.log(index);
        // this.setSliderIndex(index);
        // this.setVisible(true);
        this.setState({
            sliderIndex: index,
            visible: true
        })
    }

    closeHandler(){
        this.setVisible(false);
    }

    render(){
        let images = this.state.images.map(e => 'http://sese.pumpk1n.com/setu/image.php?img=' + e);
        // console.log(images);
        return (<>
            <div className="image-list">
                {images.slice(0, 40).map((item, index) => (
                    // <LazyLoad offset={100} overflow={true}>
                        <div onClick={this.showHandler.bind(this, index)} key={index}>
                            {/* <PhotoConsumer key={index} src={item} intro={item}> */}
                                <ViewBox url={item} />
                            {/* </PhotoConsumer> */}
                        </div>
                    // </LazyLoad>
                ))}
            </div>
            
            <center className="bottom-completed">
                <p>已经到底啦</p>
            </center>
            
            <PhotoSlider 
                images={images.map(item => ({ src: item }))} 
                visible={this.state.visible}
                onClose={this.closeHandler}
                index={this.state.sliderIndex}
                onIndexChange={this.setSliderIndex}
            />
        </>);
    }
}

export default SetuViewer;
export { SetuAlbum };