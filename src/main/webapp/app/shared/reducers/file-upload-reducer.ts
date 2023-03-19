import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import axios from 'axios';
import { API_URIS } from '../util/helpers';
import { FAILURE, REQUEST, SUCCESS } from './action-type.util';

export const ACTION_TYPES = {
  SET_FILE_UPLOAD_SAVING: 'fileUpload/SET_FILE_UPLOAD_SAVING',
  SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_ID: 'fileUpload/SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_ID',
  SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_TAG_NAME: 'fileUpload/SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_TAG_NAME',
  ASSICATE_UPLOADED_FILES_TO_ENTITY: 'fileUpload/ASSICATE_UPLOADED_FILES_TO_ENTITY',
  UPDATE_ENTITY_ID: 'fileUpload/UPDATE_ENTITY_ID',
  SET_FILE_UPLOADED_SAVING_WILL_TAKE_A_MOMENT: 'fileUpload/SET_FILE_UPLOADED_SAVING_WILL_TAKE_A_MOMENT',
};

const initialState = {
  loading: false,
  saving: false,
  savingFileWillTakeAMoment: false,
  entityToAssociateId: null,
  entityToAssicateTagName: null,
  updatedFileSize: 0,
};

export type FileUploadState = Readonly<typeof initialState>;

export default (state: FileUploadState = initialState, action): FileUploadState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.ASSICATE_UPLOADED_FILES_TO_ENTITY):
    case REQUEST(ACTION_TYPES.UPDATE_ENTITY_ID):
      return {
        ...state,
        loading: true,
        updatedFileSize: 0,
      };
    case FAILURE(ACTION_TYPES.ASSICATE_UPLOADED_FILES_TO_ENTITY):
    case FAILURE(ACTION_TYPES.UPDATE_ENTITY_ID):
      return {
        ...state,
        loading: false,
        updatedFileSize: 0,
      };
    case SUCCESS(ACTION_TYPES.ASSICATE_UPLOADED_FILES_TO_ENTITY):
    case SUCCESS(ACTION_TYPES.UPDATE_ENTITY_ID):
      return {
        ...state,
        loading: false,
        entityToAssociateId: null,
        updatedFileSize: action.payload.data,
      };
    case ACTION_TYPES.SET_FILE_UPLOAD_SAVING: {
      return {
        ...state,
        saving: action.saving,
      };
    }
    case ACTION_TYPES.SET_FILE_UPLOADED_SAVING_WILL_TAKE_A_MOMENT: {
      return {
        ...state,
        savingFileWillTakeAMoment: action.value,
      };
    }
    case ACTION_TYPES.SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_ID: {
      return {
        ...state,
        entityToAssociateId: action.id,
      };
    }
    case ACTION_TYPES.SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_TAG_NAME: {
      return {
        ...state,
        entityToAssicateTagName: action.tag,
      };
    }
    default:
      return state;
  }
};

export const setFileUploadSaving: (saving: boolean) => void = saving => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_FILE_UPLOAD_SAVING,
    saving,
  });
};

export const setFileUploadSavingWillTakeAMoment: (value: boolean) => void = value => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_FILE_UPLOADED_SAVING_WILL_TAKE_A_MOMENT,
    value,
  });
};

export const setFileUploadWillAssociateEntityId: (id: number) => void = id => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_ID,
    id,
  });
};

export const setFileUploadWillAssociateEntityTagName: (tag: string) => void = tag => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_FILE_UPLOAD_ENTITY_TO_ASSOCIATE_TAG_NAME,
    tag,
  });
};

export const associateFilesToEntity: (entityId: number, tag: string, userId: any) => void =
  (entityId: number, tag: string, userId: any) => async dispatch => {
    if (entityId && tag && userId && serviceIsOnline(SetupService.FILEMANAGER)) {
      let apiUri = `${API_URIS.mshzFileApiUri}/associateFileToEntity`;
      apiUri = `${apiUri}/?entityId=${entityId}&tag=${tag}&userId=${userId}`;
      const result = await dispatch({
        type: ACTION_TYPES.ASSICATE_UPLOADED_FILES_TO_ENTITY,
        payload: axios.get(apiUri),
      });
      return result;
    }
  };

export const upldateEntityId: (entityId: number, newEntityId: number, userId: any) => void =
  (entityId: number, newEntityId: number, userId: any) => async dispatch => {
    if (entityId && newEntityId && userId && serviceIsOnline(SetupService.FILEMANAGER)) {
      const formData = new FormData();
      formData.append('entityId', entityId.toString());
      formData.append('newEntityId', newEntityId.toString());
      formData.append('userId', userId.toString());
      const apiUri = `${API_URIS.mshzFileApiUri}/updateEntityId`;
      const result = await dispatch({
        type: ACTION_TYPES.UPDATE_ENTITY_ID,
        payload: axios.put(apiUri, formData),
      });
      return result;
    }
  };
