/* eslint-disable prettier/prettier */
import { Platform } from 'react-native';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';

// create bucket storage reference to not yet existing image
// const reference = storage().ref('black-t-shirt-sm.png');
export const FireBaseStorage = storage();
export const getFileLocalPath = response => {
    const { path, uri } = response;
    return Platform.OS === 'android' ? path : uri;
};

export const createStorageReferenceToFile = response => {
    let iosFileName = null;
    if (Platform.OS === 'ios') {
        // let spliText = response.uri.split('.');
        // let extractFile = spliText[spliText.length - 2].replace('/', '');
        // iosFileName = extractFile.split('/');
        let spliText = response.uri.split('/');
        iosFileName = spliText[spliText.length - 1];
    }
    //create folder name majaplace to store images; 
    return storage().ref(Platform.OS === 'android' ? `majaplace/${response.fileName}` : `majaplace/${iosFileName}`);
};


export const uploadFileToFireBase = async (imagePickerResponse) => {

    try {
        const fileSource = getFileLocalPath(imagePickerResponse);
        const storageRef = createStorageReferenceToFile(imagePickerResponse);

        await storageRef.putFile(fileSource);
        const textUrl = await getUrl(imagePickerResponse);
        return textUrl;
    } catch (error) {
        console.log('error', error);
    }
    // const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/black-t-shirt-sm.png`;
    //       // uploads file
    //       await reference.putFile(pathToFile);
};

export const getUrl = async (response) => {
    let iosFileName = null;
    if (Platform.OS === 'ios') {
        let spliText = response.uri.split('/');
        iosFileName = spliText[spliText.length - 1];
        // console.warn('iosFileName', iosFileName);
    }
    try {
        const url = await storage()
            .ref(Platform.OS === 'android' ? `majaplace/${response.fileName}` : `majaplace/${iosFileName}`)
            .getDownloadURL();
        return url;
    } catch (error) {
        console.log('error', error);
    }
}
