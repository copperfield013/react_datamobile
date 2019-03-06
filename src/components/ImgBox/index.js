import React ,{ Component } from 'react'
import { ImagePicker } from 'antd-mobile';

export default class ImgBox extends Component{

    state={
        files:this.props.files?this.props.files:[]
    }
    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
          files,
        });
      }
    render(){
        const {files}=this.state
        return (
            <div>
                <ImagePicker
                    files={files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={files.length < 1}
                    multiple={false}
                />
            </div>
        )
    }
}
    