import React from 'react';
import { PhotoProvider, PhotoSlider } from 'react-photo-view';

class MyPhotoProvider extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            mages: [],
            visible: false,
            index: 0,
            updateItem: this.handleUpdateItem,
            removeItem: this.handleRemoveItem,
            onShow: this.handleShow,
        }
    }

    handleUpdateItem = (imageItem) => {
        this.setState((prev) => {
            const { images } = prev;
            const index = images.findIndex((n) => n.key === imageItem.key);
            if (index > -1) {
                images.splice(index, 1, imageItem);
                return {
                    images: [...images],
                };
            }
            return {
                images: images.concat(imageItem),
            };
        });
    };

    handleRemoveItem = (key) => {
        this.setState(({ images, index }) => {
            const nextImages = images.filter((item) => item.key !== key);
            const nextEndIndex = nextImages.length - 1;
            return {
                images: nextImages,
                index: Math.min(nextEndIndex, index),
            };
        });
    };

    handleShow = (key) => {
        const { onVisibleChange } = this.props;
        const { images } = this.state;
        const index = images.findIndex((item) => item.key === key);
        this.setState({
            visible: true,
            index,
        });
    
        if (typeof onVisibleChange === 'function') {
            onVisibleChange(true, index, this.state);
        }
    };

    handleClose = () => {
        const { onVisibleChange } = this.props;
        this.setState({
            visible: false,
        });
    
        if (typeof onVisibleChange === 'function') {
            onVisibleChange(false, this.state.index, this.state);
        }
    };

    handleIndexChange = (index) => {
        const { onIndexChange } = this.props;
        this.setState({
            index,
        });
    
        if (typeof onIndexChange === 'function') {
            onIndexChange(index, this.state);
        }
    };

    render() {
        const { children, onIndexChange, onVisibleChange, ...restProps } = this.props;
        const { images, visible, index } = this.state;
    
        return (
            <PhotoContext.Provider value={this.state}>
                {children}
                <PhotoSlider
                    images={images}
                    visible={visible}
                    index={index}
                    onIndexChange={this.handleIndexChange}
                    onClose={this.handleClose}
                    {...restProps}
                />
            </PhotoContext.Provider>
        );
      }
}

export default MyPhotoProvider;