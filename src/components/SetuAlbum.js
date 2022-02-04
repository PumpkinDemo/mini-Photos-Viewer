import { PhotoSlider } from "react-photo-view";
import ViewBox from "./ViewBox";
import { useState, useEffect, useCallback } from "react";
import { InView } from "react-intersection-observer";

import './SetuAlbum.css'

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

    const get_images = () => {
        fetch('//sese.pumpk1n.com/setu/?action=list')
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

    let image_urls = images.map(e => 'http://sese.pumpk1n.com/setu/image.php?img=' + e);
    let real_image_urls = images.map(e => 'http://sese.pumpk1n.com/setu/setus/' + e)
    let images_len = image_urls.length;

    return (<div>
        <div className="image-list">
            {image_urls.map((item, index) => (index < end &&
                <div className="image" onClick={() => {showHandler(index)}} key={index}>
                    <ViewBox src={item} />
                </div>
            ))}
        </div>
            
        <InView onChange={(inView) => {
            if(inView && end < images_len && end < 220){
                setEnd(end+5);
            }
            console.log(inView);
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
            visible={sliderVisible}
            onClose={closeHandler}
            index={sliderIndex}
            onIndexChange={setSliderIndex}
        />
    </div>)
}

export default SetuAlbum;