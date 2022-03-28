import { PhotoSlider } from "react-photo-view";
import ViewBox from "./ViewBox";
import { useState, useEffect, useReducer } from "react";
import { InView } from "react-intersection-observer";
import { Input, InputNumber } from 'antd';
import './SetuAlbum.css'

const { Search } = Input;


const arrayShuffle = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let j = ~~(i + Math.random() * (arr.length - i));
        [ arr[i], arr[j] ] = [ arr[j], arr[i] ];
    }
}


const SetuAlbum = () => {

    const [images, setImages] = useState([]);
    const [sliderVisible, setSliderVisible] = useState(false);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [end, setEnd] = useState(20);
    const [keyword, setKeyword] = useState('');
    const [maxDisplay, setMaxDisplay] = useState(20);
    const [doneCnt, doneCntInc] = useReducer((state) => state + 1, 0);

    const backendHost = 'https://sese.pumpk1n.com';

    const get_images = () => {
        fetch(backendHost + '/setu/?action=list')
        .then(res => res.text())
        .then(res => JSON.parse(res))
        .then(res => {
            arrayShuffle(res);
            setImages(res);
        })
    }

    useEffect(() => { get_images();}, [])

    const showHandler = (index) => {
        setSliderIndex(index);
        setSliderVisible(true);
    }
    
    const closeHandler = () => {
        setSliderVisible(false);
    }

    const onSearch = (value) => {
        setKeyword(value);
    }

    const onInputNumberChange = (value) => {
        setMaxDisplay(value);
        if(end > value){
            setEnd(value);
        }
    }

    console.log("keyword", keyword);
    console.log("max display", maxDisplay);
    let image_urls = images.filter(e => !e || e.indexOf(keyword) > -1)
                           .map(e => backendHost + '/setu/image.php?img=' + e);
    // let real_image_urls = images.map(e => backendHost + '/setu/setus/' + e);
    let images_len = image_urls.length;

    return (<div>

        <div className="search">
            <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
            />
        </div>

        <div className="inputnumber">
            max display: <InputNumber min={20} defaultValue={20} onChange={onInputNumberChange} />
        </div>

        <div className="image-list">
            {image_urls.map((item, index) => (index < end &&
                <div className="image" onClick={() => {showHandler(index)}} key={item}>
                    <ViewBox src={item} onDone={doneCntInc}/>
                </div>
            ))}
        </div>
            
        <InView onChange={(inView) => {
            if(inView && end < images_len && end <= doneCnt && end < maxDisplay){
                setEnd(end+5);
            }else{
                console.log(end, images_len, doneCnt, maxDisplay);
            }
            console.log("end", inView);
        }}>
            {({ inView, ref, entry }) => {
                return (
                    <div ref={ref} className="end">
                        <center>
                            <p className="bottom-slogan">
                                前面的区域，以后再来探索吧～
                            </p>
                        </center>
                    </div>
                )
            }}
        </InView>
        
        <PhotoSlider 
            images={image_urls.map(item => ({ src: item }))} 
            // images={real_image_urls.map(item => ({ src:item }))}
            visible={sliderVisible}
            onClose={closeHandler}
            index={sliderIndex}
            onIndexChange={setSliderIndex}
        />
    </div>)
}

export default SetuAlbum;