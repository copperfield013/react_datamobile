import React, {Component} from 'react'
import { ImagePicker } from 'antd-mobile';

export default class ImgBox extends Component {

	state = {
		files: this.props.files
	}
	onChange = (files, type) => {
		console.log(files, type);
		this.setState({
			files,
		});
		this.triggerChange(files.length > 0 ? files[0].file : "");
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange;
		if(onChange) {
			onChange(changedValue);
		}
	}
	render() {
		const {files} = this.state
		return(
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