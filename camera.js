import React,{Component} from "react"
import {Button,Image,View,Platform} from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"
import { color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes"
export default class PickImage extends React.Component {
    constructor() {
        super()
        this.state={
            image:null
        }
    }
    getPermissionAsync=async()=>{
        if(Platform.OS!=="web"){
            const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=="granted"){
                alert("Sorry, we need camera roll permissions")
            }
        }
    }
    componentDidMount(){
        this.getPermissionAsync()
    }
    pickImage=async()=>{
        try{
            let result=await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:True,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({
                    image:result.data
                })
                this.uploadImage(result.uri)
            }
        }catch(e){
            alert(e)
        }
    }
    uploadImage=async(uri)=>{
        const data=new FormData()
        let fileName= uri.split('/')[uri.split("/").length-1]
        let type=`image/${uri.split(".")[uri.split(".").length-1]}`
        const filesToUpload={
            uri:uri,
            name:fileName,
            type:type
        }
        data.append("digit",filesToUpload)
        fetch("https://f292a3137990.ngrok.io/predict-digit",{method: "POST",
    body:data,
    headers:{
        "content-type":"multipart/form-data"
    }
    }).then(response=>response.json() ).then(result=>{
        console.log(
            "success",result
        )
    }).catch(err=>{
        console.log("err",err)
    })
    }

    render(){
        let {image}=this.state

        return(
        <View style={{flex:1,alignItems: 'center',justifyContent: 'center'}}>
            <Button title="Pick an image from camera roll" onPress={this.pickImage} />
        </View>

        )
    }
}
